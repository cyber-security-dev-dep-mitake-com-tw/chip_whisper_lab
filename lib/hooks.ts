"use client";

import { useState, useEffect, useCallback } from "react";
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

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`);
  return res.json();
}

function useMockOrFetch<T>(key: string, fetcher: () => Promise<T>, mock: T) {
  const [data, setData] = useState<T>(mock);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetcher()
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((e) => {
        if (!cancelled) setError(String(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

  return { data, loading, error };
}

const MOCK_EXPERIMENTS: Experiment[] = [
  {
    id: "exp-001",
    name: "AES-128 CPA Attack",
    description: "Correlation power analysis on AES-128 SimpleSerial target",
    status: "completed",
    target_id: "tgt-001",
    created_at: "2026-07-20T10:30:00Z",
    updated_at: "2026-07-20T14:15:00Z",
    trace_count: 5000,
    attack_count: 3,
    tags: ["aes", "cpa", "simpleserial"],
  },
  {
    id: "exp-002",
    name: "RSA DPA Exploration",
    description: "Differential power analysis targeting RSA signing",
    status: "running",
    target_id: "tgt-002",
    created_at: "2026-07-22T09:00:00Z",
    updated_at: "2026-07-22T11:45:00Z",
    trace_count: 2500,
    attack_count: 1,
    tags: ["rsa", "dpa"],
  },
  {
    id: "exp-003",
    name: "Glitch Fault Injection",
    description: "Voltage glitching on ARM Cortex-M4 boot sequence",
    status: "draft",
    target_id: "tgt-001",
    created_at: "2026-07-24T16:00:00Z",
    updated_at: "2026-07-24T16:00:00Z",
    trace_count: 0,
    attack_count: 0,
    tags: ["glitch", "fault-injection"],
  },
];

const MOCK_TRACES: Trace[] = [
  {
    id: "trc-001",
    experiment_id: "exp-001",
    name: "AES round 1 - key byte 0",
    samples: Array.from({ length: 200 }, (_, i) =>
      Math.sin(i * 0.15) * 30 + 50 + Math.random() * 10,
    ),
    sample_rate: 7370000,
    trigger_sample: 45,
    voltage_peak: 0.247,
    noise_mV: 18.3,
    created_at: "2026-07-20T10:35:00Z",
    metadata: { key_byte_index: 0, round: 1 },
  },
];

const MOCK_ATTACKS: Attack[] = [
  {
    id: "atk-001",
    experiment_id: "exp-001",
    name: "CPA - AES key recovery",
    type: "cpa",
    status: "completed",
    config: {
      trace_start: 0,
      trace_end: 5000,
      point_start: 0,
      point_end: 1500,
      model: " hamming weight",
      target_operation: "sbox_output",
      rounds: 1,
    },
    progress: 100,
    results: {
      key_candidates: [0x2b, 0x7e, 0x15, 0x16, 0x28, 0xae, 0xd2, 0xa6, 0xab, 0xf7, 0x15, 0x88, 0x09, 0xcf, 0x4f, 0x3c],
      success: true,
      pge: 0,
      correlations: Array.from({ length: 256 }, (_, i) =>
        i === 0x2b ? 0.82 : Math.random() * 0.15,
      ),
      snr: 12.4,
    },
    created_at: "2026-07-20T12:00:00Z",
    started_at: "2026-07-20T12:00:00Z",
    completed_at: "2026-07-20T14:10:00Z",
  },
];

const MOCK_TARGETS: Target[] = [
  {
    id: "tgt-001",
    name: "ChipWhisperer-Lite",
    type: "cwlite",
    status: "connected",
    firmware: "simpleserial-aes.elf",
    platform: "stm32f3",
    usb_port: "/dev/tty.usbmodem21301",
    last_seen: "2026-07-24T18:00:00Z",
  },
  {
    id: "tgt-sim",
    name: "Simulator",
    type: "simulator",
    status: "connected",
    firmware: "virtual-aes",
    platform: "simulator",
    last_seen: "2026-07-24T18:00:00Z",
  },
];

const MOCK_REPORTS: Report[] = [
  {
    id: "rpt-001",
    experiment_id: "exp-001",
    name: "AES CPA Attack Report",
    template: "standard",
    status: "ready",
    created_at: "2026-07-20T15:00:00Z",
    download_url: "#",
  },
];

const MOCK_MODULES: Module[] = [
  {
    id: "mod-001",
    title: "Power Analysis Fundamentals",
    description: "Learn the basics of side-channel power analysis and signal processing.",
    category: "fundamentals",
    difficulty: "beginner",
    duration: "45 min",
    lab_url: "#",
  },
  {
    id: "mod-002",
    title: "Correlation Power Analysis",
    description: "Deep dive into CPA attacks on AES and other block ciphers.",
    category: "attacks",
    difficulty: "intermediate",
    duration: "90 min",
    lab_url: "#",
  },
  {
    id: "mod-003",
    title: "ChipWhisperer Hardware Setup",
    description: "Configure and connect your ChipWhisperer hardware for the first time.",
    category: "hardware",
    difficulty: "beginner",
    duration: "30 min",
  },
  {
    id: "mod-004",
    title: "Voltage Glitching",
    description: "Introduction to fault injection using voltage glitching techniques.",
    category: "advanced",
    difficulty: "advanced",
    duration: "120 min",
    lab_url: "#",
  },
  {
    id: "mod-005",
    title: "Differential Power Analysis",
    description: "Statistical methods for extracting keys from power traces.",
    category: "attacks",
    difficulty: "intermediate",
    duration: "75 min",
  },
  {
    id: "mod-006",
    title: "Trace Acquisition & Preprocessing",
    description: "Signal conditioning, alignment, and noise reduction techniques.",
    category: "fundamentals",
    difficulty: "beginner",
    duration: "60 min",
  },
];

export function useExperiments() {
  return useMockOrFetch(
    "experiments",
    () => fetchJson<Experiment[]>("/experiments"),
    MOCK_EXPERIMENTS,
  );
}

export function useExperiment(id: string) {
  return useMockOrFetch(
    `experiment-${id}`,
    () => fetchJson<Experiment>(`/experiments/${id}`),
    MOCK_EXPERIMENTS.find((e) => e.id === id) || MOCK_EXPERIMENTS[0],
  );
}

export function useTraces(experimentId?: string) {
  const path = experimentId
    ? `/experiments/${experimentId}/traces`
    : "/traces";
  return useMockOrFetch(`traces-${experimentId ?? "all"}`, () =>
    fetchJson<Trace[]>(path), MOCK_TRACES);
}

export function useTrace(id: string) {
  return useMockOrFetch(
    `trace-${id}`,
    () => fetchJson<Trace>(`/traces/${id}`),
    MOCK_TRACES.find((t) => t.id === id) || MOCK_TRACES[0],
  );
}

export function useAttacks(experimentId?: string) {
  const path = experimentId
    ? `/experiments/${experimentId}/attacks`
    : "/attacks";
  return useMockOrFetch(`attacks-${experimentId ?? "all"}`, () =>
    fetchJson<Attack[]>(path), MOCK_ATTACKS);
}

export function useAttack(id: string) {
  return useMockOrFetch(
    `attack-${id}`,
    () => fetchJson<Attack>(`/attacks/${id}`),
    MOCK_ATTACKS.find((a) => a.id === id) || MOCK_ATTACKS[0],
  );
}

export function useTargets() {
  return useMockOrFetch(
    "targets",
    () => fetchJson<Target[]>("/targets"),
    MOCK_TARGETS,
  );
}

export function useTarget(id: string) {
  return useMockOrFetch(
    `target-${id}`,
    () => fetchJson<Target>(`/targets/${id}`),
    MOCK_TARGETS.find((t) => t.id === id) || MOCK_TARGETS[0],
  );
}

export function useReports(experimentId?: string) {
  const path = experimentId
    ? `/experiments/${experimentId}/reports`
    : "/reports";
  return useMockOrFetch(`reports-${experimentId ?? "all"}`, () =>
    fetchJson<Report[]>(path), MOCK_REPORTS);
}

export function useModules() {
  return useMockOrFetch(
    "modules",
    () => fetchJson<Module[]>("/learn/modules"),
    MOCK_MODULES,
  );
}

export function useModule(id: string) {
  return useMockOrFetch(
    `module-${id}`,
    () => fetchJson<Module>(`/learn/modules/${id}`),
    MOCK_MODULES.find((m) => m.id === id) || MOCK_MODULES[0],
  );
}
