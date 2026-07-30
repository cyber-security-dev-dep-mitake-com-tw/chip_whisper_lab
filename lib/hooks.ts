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
  {
    id: "module-04-puf-trng",
    title: "PUF & TRNG",
    description:
      "Physical Unclonable Functions and True Random Number Generators: RO-PUF, Arbiter PUF, SRAM PUF, ring-oscillator TRNGs, and entropy sources per NIST SP 800-90B.",
    category: "hardware",
    difficulty: "intermediate",
    duration: "3 hours",
    lab_url: "#",
  },
  {
    id: "module-22-qpuf",
    title: "Quantum PUF via IBM Quantum (Qiskit)",
    description:
      "QPUF design via decoherence/gate-error entropy sources, Von Neumann entropy, and the quantum-gravity entropy chain (Bekenstein-Hawking, Strominger-Vafa, Ryu-Takayanagi).",
    category: "advanced",
    difficulty: "advanced",
    duration: "3-4 hours",
    lab_url: "#",
  },
  {
    id: "module-25-quantum-tunneling-puf",
    title: "Quantum Tunneling PUF",
    description:
      "Atomic-scale quantum entropy via Fowler-Nordheim tunneling and gate-oxide hard breakdown (e.g. NeoPUF): near-100% reliability, zero-ECC, and aging immunity.",
    category: "hardware",
    difficulty: "advanced",
    duration: "1-1.5 hours",
    lab_url: "#",
  },
  {
    id: "module-26-puf-applications",
    title: "PUF-based Applications",
    description:
      "From keyless storage and fuzzy extraction to IC anti-counterfeiting, lightweight device authentication, firmware key wrapping, key derivation, and zero-touch cloud onboarding.",
    category: "hardware",
    difficulty: "intermediate",
    duration: "1.5-2 hours",
    lab_url: "#",
  },
  {
    id: "module-27-puf-hrot-architecture",
    title: "PUF-based Hardware Root of Trust Architecture",
    description:
      "How a PUF integrates with ECC, crypto accelerators, and a secure key bus into a Hardware Root of Trust: PUF-driven secure boot, lifecycle management, and tamper resistance.",
    category: "hardware",
    difficulty: "advanced",
    duration: "1.5-2 hours",
    lab_url: "#",
  },
  {
    id: "module-28-efuse-antifuse",
    title: "eFuse vs. Anti-Fuse Storage",
    description:
      "Electromigration-based eFuse vs. dielectric-breakdown-based Anti-Fuse OTP storage: physical mechanisms, reverse-engineering resistance, and root-of-trust key storage trade-offs.",
    category: "hardware",
    difficulty: "intermediate",
    duration: "1 hour",
    lab_url: "#",
  },
  {
    id: "module-29-hw-security-platform",
    title: "Hardware Security Platform",
    description:
      "Integrating PUF/HRoT, crypto accelerators, and a secure CPU into an isolated security subsystem, communicating with the Rich OS only via a hardware mailbox. Covers ARM PSA, OpenTitan, TPM 2.0.",
    category: "hardware",
    difficulty: "advanced",
    duration: "1 hour",
    lab_url: "#",
  },
  {
    id: "module-30-key-gen-puf",
    title: "Key Generation with PUF Solutions",
    description:
      "Fuzzy extractor Gen/Rep phases, multi-layer ECC (repetition + BCH/Reed-Muller), and privacy amplification for turning noisy PUF output into full-entropy cryptographic keys.",
    category: "hardware",
    difficulty: "intermediate",
    duration: "1-1.5 hours",
    lab_url: "#",
  },
  {
    id: "module-31-hw-security-background",
    title: "Background of Hardware Security",
    description:
      "The paradigm shift from software-only protection to hardware-rooted trust, the fabless supply chain's threat taxonomy (Trojans, side-channel, RE, counterfeiting), and Security-by-Design/PPAS.",
    category: "fundamentals",
    difficulty: "beginner",
    duration: "1-1.5 hours",
    lab_url: "#",
  },
  {
    id: "module-32-fips-140-2",
    title: "FIPS 140-2 Overview",
    description:
      "The cryptographic boundary, Critical Security Parameters (CSPs), and the four FIPS 140-2 security levels — from NIST-approved algorithms only up to tamper-resistant zeroization and Environmental Failure Protection.",
    category: "compliance",
    difficulty: "beginner",
    duration: "1 hour",
    lab_url: "#",
  },
  {
    id: "module-33-fips-140-3",
    title: "FIPS 140-3 Modern Framework",
    description:
      "Why NIST replaced FIPS 140-2, alignment with ISO/IEC 19790 and 24759, the new mandatory non-invasive (side-channel) attack mitigation requirement, and the FIPS 140-2 to 140-3 transition timeline.",
    category: "compliance",
    difficulty: "intermediate",
    duration: "1 hour",
    lab_url: "#",
  },
  {
    id: "module-34-cavp",
    title: "CAVP and Security Objectives",
    description:
      "The Cryptographic Algorithm Validation Program (CAVP), Known Answer Tests, Monte Carlo tests, ACVP automation, the four core security objectives, and three landmark hardware attack case studies (Fusée Gelée, ROCA, Xbox 360 Reset Glitch).",
    category: "compliance",
    difficulty: "intermediate",
    duration: "1.5 hours",
    lab_url: "#",
  },
  {
    id: "module-35-nist-800-131a",
    title: "NIST SP 800-131A - Algorithm and Key Transitions",
    description:
      "The security-strength metric and NIST's retirement schedule for symmetric, asymmetric, and hash algorithms/key-lengths, and its direct impact on hardware crypto-IP sizing and future-proofing.",
    category: "compliance",
    difficulty: "intermediate",
    duration: "1 hour",
    lab_url: "#",
  },
  {
    id: "module-36-nist-800-22",
    title: "NIST SP 800-22 Randomness Tests",
    description:
      "The 15-test NIST SP 800-22 statistical suite for randomness (Monobit, Runs, Spectral, Universal, Serial, Cumulative Sums, Random Excursions, and more), the P-value hypothesis-testing framework, and how it complements SP 800-90B min-entropy estimation.",
    category: "hardware",
    difficulty: "intermediate",
    duration: "1.5 hours",
    lab_url: "#",
  },
  {
    id: "module-37-entropy-source",
    title: "Entropy Source",
    description:
      "Physical entropy sources (thermal noise, ring-oscillator jitter, quantum tunneling, metastability) vs. software entropy pools, entropy conditioning/whitening, the hybrid TRNG-seeds-DRBG architecture, and NIST SP 800-90B min-entropy evaluation.",
    category: "hardware",
    difficulty: "intermediate",
    duration: "1.5 hours",
    lab_url: "#",
  },
  {
    id: "module-38-iot-security-regulation",
    title: "IoT Security Regulation: SB-327 & DCMS Code of Practice",
    description:
      "California SB-327's unique-password mandate and the UK DCMS Code of Practice's 13 guidelines (no default passwords, vulnerability disclosure, secure updates), and how both drive OTP/PUF device identity and HRoT secure boot requirements in silicon.",
    category: "compliance",
    difficulty: "intermediate",
    duration: "1.5 hours",
    lab_url: "#",
  },
  {
    id: "module-39-arm-psa",
    title: "Chip Security Considerations - ARM PSA as an Example",
    description:
      "ARM Platform Security Architecture as a real-world chip security framework: the Analyze/Architect/Implement/Certify methodology, the PSA-FF SPE/NSPE split, Secure Partitions, the SPM, and PSA Certified assurance levels.",
    category: "hardware",
    difficulty: "intermediate",
    duration: "1-1.5 hours",
    lab_url: "#",
  },
  {
    id: "module-40-chip-software-attacks",
    title: "Chip Software Attacks & Malicious Hardware Attacks",
    description:
      "Software attack vectors (buffer overflow, ROP/JOP, speculative execution) and their hardware countermeasures (NX bit, Pointer Authentication, MTE), plus malicious physical attacks (fault injection, invasive probing, hardware Trojans) and on-chip defenses.",
    category: "defense",
    difficulty: "advanced",
    duration: "2 hours",
    lab_url: "#",
  },
  {
    id: "module-41-puf-secure-coprocessor",
    title: "PUF-based Secure Co-processor",
    description:
      "Architecture of a PUF-backed secure co-processor: KMU, Crypto Cluster, and Mailbox/IPC; keyless storage at rest, PUF-gated secure boot, zero-touch provisioning, and the host/co-processor request-response flow with key derivation and attestation.",
    category: "hardware",
    difficulty: "advanced",
    duration: "1.5-2 hours",
    lab_url: "#",
  },
  {
    id: "module-42-additional-hw-security-techniques",
    title: "Advanced Side-Channel Hiding Countermeasures",
    description:
      "Shuffling (randomized operation order), time-domain hiding (clock jitter, dummy operations), and amplitude-domain hiding (dual-rail pre-charge logic, power equalizers) as complements to masking against DPA/CPA.",
    category: "defense",
    difficulty: "intermediate",
    duration: "1-1.5 hours",
    lab_url: "#",
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
