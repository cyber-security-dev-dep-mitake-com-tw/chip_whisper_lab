import type {
  Experiment,
  Trace,
  Attack,
  Target,
  Report,
  Module,
} from "./types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchApi<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new ApiError(res.status, `API error: ${res.statusText}`);
  }

  return res.json();
}

export const api = {
  experiments: {
    list: () => fetchApi<Experiment[]>("/experiments"),
    get: (id: string) => fetchApi<Experiment>(`/experiments/${id}`),
    create: (data: Partial<Experiment>) =>
      fetchApi<Experiment>("/experiments", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Experiment>) =>
      fetchApi<Experiment>(`/experiments/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchApi<void>(`/experiments/${id}`, { method: "DELETE" }),
  },

  traces: {
    list: (experimentId?: string) =>
      fetchApi<Trace[]>(
        experimentId ? `/experiments/${experimentId}/traces` : "/traces",
      ),
    get: (id: string) => fetchApi<Trace>(`/traces/${id}`),
    upload: (experimentId: string, file: File) => {
      const form = new FormData();
      form.append("file", file);
      return fetchApi<Trace>(`/experiments/${experimentId}/traces`, {
        method: "POST",
        body: form,
        headers: {},
      });
    },
  },

  attacks: {
    list: (experimentId?: string) =>
      fetchApi<Attack[]>(
        experimentId ? `/experiments/${experimentId}/attacks` : "/attacks",
      ),
    get: (id: string) => fetchApi<Attack>(`/attacks/${id}`),
    create: (data: Partial<Attack>) =>
      fetchApi<Attack>("/attacks", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    launch: (id: string) =>
      fetchApi<Attack>(`/attacks/${id}/launch`, { method: "POST" }),
    cancel: (id: string) =>
      fetchApi<void>(`/attacks/${id}/cancel`, { method: "POST" }),
  },

  targets: {
    list: () => fetchApi<Target[]>("/targets"),
    get: (id: string) => fetchApi<Target>(`/targets/${id}`),
    flash: (id: string, firmware: string) =>
      fetchApi<Target>(`/targets/${id}/flash`, {
        method: "POST",
        body: JSON.stringify({ firmware }),
      }),
    test: (id: string) =>
      fetchApi<{ ok: boolean }>(`/targets/${id}/test`, { method: "POST" }),
  },

  reports: {
    list: (experimentId?: string) =>
      fetchApi<Report[]>(
        experimentId ? `/experiments/${experimentId}/reports` : "/reports",
      ),
    generate: (data: { experiment_id: string; template: string }) =>
      fetchApi<Report>("/reports", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    download: (id: string) =>
      fetchApi<{ url: string }>(`/reports/${id}/download`),
  },

  modules: {
    list: () => fetchApi<Module[]>("/learn/modules"),
    get: (id: string) => fetchApi<Module>(`/learn/modules/${id}`),
  },
};
