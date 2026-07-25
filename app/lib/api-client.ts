const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json();
}

export const api = {
  getExperiments: (page = 1, pageSize = 20) =>
    fetchJson<{ items: Experiment[]; total: number; page: number; pages: number }>(
      `/experiments?page=${page}&page_size=${pageSize}`
    ),
  createExperiment: (body: { name: string; description?: string; tags?: string[] }) =>
    fetchJson<Experiment>("/experiments", { method: "POST", body: JSON.stringify(body) }),
  getExperiment: (id: string) => fetchJson<Experiment>(`/experiments/${id}`),
  updateExperiment: (id: string, body: Partial<Experiment>) =>
    fetchJson<Experiment>(`/experiments/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteExperiment: (id: string) =>
    fetchJson<void>(`/experiments/${id}`, { method: "DELETE" }),

  getTraces: (experimentId?: string, page = 1, pageSize = 20) => {
    const q = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
    if (experimentId) q.set("experiment_id", experimentId);
    return fetchJson<{ items: Trace[]; total: number; page: number; pages: number }>(
      `/traces?${q}`
    );
  },
  uploadTrace: (experimentId: string, file: File, traceSetName = "default") => {
    const form = new FormData();
    form.append("file", file);
    form.append("trace_set_name", traceSetName);
    return fetch(`${BASE_URL}/traces/upload?experiment_id=${experimentId}`, {
      method: "POST",
      body: form,
    }).then((r) => r.json());
  },
  getTrace: (id: string) => fetchJson<Trace>(`/traces/${id}`),
  downloadTrace: (id: string) => fetchJson<{ storagePath: string }>(`/traces/${id}/download`),

  getAttacks: (experimentId?: string, page = 1, pageSize = 20) => {
    const q = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
    if (experimentId) q.set("experiment_id", experimentId);
    return fetchJson<{ items: Attack[]; total: number; page: number; pages: number }>(
      `/attacks?${q}`
    );
  },
  createAttack: (body: { experimentId: string; attackType: string; config?: Record<string, unknown> }) =>
    fetchJson<Attack>("/attacks", { method: "POST", body: JSON.stringify(body) }),
  getAttack: (id: string) => fetchJson<Attack>(`/attacks/${id}`),
  getAttackResults: (id: string) =>
    fetchJson<{ attackId: string; attackType: string; results: Record<string, unknown> }>(
      `/attacks/${id}/results`
    ),

  getTargets: (page = 1, pageSize = 20) =>
    fetchJson<{ items: Target[]; total: number; page: number; pages: number }>(
      `/targets?page=${page}&page_size=${pageSize}`
    ),
  registerTarget: (body: Partial<Target>) =>
    fetchJson<Target>("/targets", { method: "POST", body: JSON.stringify(body) }),
  flashFirmware: (targetId: string, firmwarePath: string) =>
    fetchJson(`/targets/${targetId}/flash`, {
      method: "POST",
      body: JSON.stringify({ firmware_path: firmwarePath }),
    }),
  testConnection: (targetId: string) =>
    fetchJson<{ connected: boolean; detail: string }>(`/targets/${targetId}/test`),

  getReports: (experimentId?: string) => {
    const q = experimentId ? `?experiment_id=${experimentId}` : "";
    return fetchJson<{ items: Report[]; total: number }>(`/reports${q}`);
  },
  generateReport: (body: { experimentId: string; reportType: string }) =>
    fetchJson<Report>("/reports", { method: "POST", body: JSON.stringify(body) }),

  getHealth: () => fetchJson<{ status: string; version: string }>("/health"),
};