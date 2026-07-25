export interface Experiment {
  id: string;
  name: string;
  description: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Trace {
  id: string;
  experimentId: string;
  traceSetName: string;
  numTraces: number;
  metadata: Record<string, unknown>;
  storagePath: string;
  createdAt: string;
}

export interface Attack {
  id: string;
  experimentId: string;
  attackType: "cpa" | "dpa" | "template" | "glitch" | "dfa";
  status: "pending" | "running" | "completed" | "failed";
  config: Record<string, unknown>;
  result: Record<string, unknown> | null;
  createdAt: string;
  completedAt: string | null;
}

export interface Target {
  id: string;
  name: string;
  targetType: "cw_lite" | "cw_nano" | "cw_pro" | "esp32_s3" | "simulator";
  connectionInfo: Record<string, unknown>;
  firmwarePath: string | null;
  createdAt: string;
}

export interface Report {
  id: string;
  experimentId: string;
  reportType: string;
  filePath: string;
  createdAt: string;
}

export interface CurriculumModule {
  id: string;
  slug: string;
  title: string;
  description: string;
  duration: string;
  prerequisites: string[];
}