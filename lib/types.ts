export interface Experiment {
  id: string;
  name: string;
  description: string;
  status: "draft" | "running" | "completed" | "failed";
  target_id: string;
  created_at: string;
  updated_at: string;
  trace_count: number;
  attack_count: number;
  tags: string[];
}

export interface Trace {
  id: string;
  experiment_id: string;
  name: string;
  samples: number[];
  sample_rate: number;
  trigger_sample: number;
  voltage_peak: number;
  noise_mV: number;
  created_at: string;
  metadata: Record<string, unknown>;
}

export interface Attack {
  id: string;
  experiment_id: string;
  name: string;
  type: "cpa" | "dpa" | "sca" | "glitch";
  status: "configured" | "running" | "completed" | "failed";
  config: AttackConfig;
  progress: number;
  results?: AttackResults;
  created_at: string;
  started_at?: string;
  completed_at?: string;
}

export interface AttackConfig {
  trace_start: number;
  trace_end: number;
  point_start: number;
  point_end: number;
  model: string;
  target_operation: string;
  rounds: number;
}

export interface AttackResults {
  key_candidates: number[];
  success: boolean;
  pge: number;
  correlations: number[];
  snr: number;
}

export interface Target {
  id: string;
  name: string;
  type: "cwlite" | "cw308" | "cw310" | "simulator";
  status: "connected" | "disconnected" | "flash_needed";
  firmware: string;
  platform: string;
  usb_port?: string;
  last_seen: string;
}

export interface Report {
  id: string;
  experiment_id: string;
  name: string;
  template: "standard" | "detailed" | "academic";
  status: "generating" | "ready" | "failed";
  created_at: string;
  download_url?: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  category:
    | "fundamentals"
    | "attacks"
    | "hardware"
    | "advanced"
    | "compliance"
    | "defense";
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: string;
  lab_url?: string;
}
