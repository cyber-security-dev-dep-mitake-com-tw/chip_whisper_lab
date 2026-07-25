"use client";

import { use } from "react";
import { Sidebar } from "@/components/sidebar";
import { useTrace } from "@/lib/hooks";
import Link from "next/link";

export default function TraceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: trace } = useTrace(id);

  const max = Math.max(...trace.samples);
  const min = Math.min(...trace.samples);
  const range = max - min || 1;

  const COLS = 64;
  const ROWS = Math.ceil(trace.samples.length / COLS);
  const heatData: number[][] = [];
  for (let r = 0; r < ROWS; r++) {
    const row: number[] = [];
    for (let c = 0; c < COLS; c++) {
      const idx = r * COLS + c;
      row.push(idx < trace.samples.length ? trace.samples[idx] : 0);
    }
    heatData.push(row);
  }

  function heatColor(value: number): string {
    const norm = (value - min) / range;
    if (norm < 0.25) {
      const t = norm / 0.25;
      return `rgb(${Math.round(20 + t * 10)}, ${Math.round(20 + t * 30)}, ${Math.round(40 + t * 50)})`;
    }
    if (norm < 0.5) {
      const t = (norm - 0.25) / 0.25;
      return `rgb(${Math.round(30 + t * 50)}, ${Math.round(50 + t * 120)}, ${Math.round(90 - t * 20)})`;
    }
    if (norm < 0.75) {
      const t = (norm - 0.5) / 0.25;
      return `rgb(${Math.round(80 + t * 100)}, ${Math.round(170 + t * 50)}, ${Math.round(70 + t * 20)})`;
    }
    const t = (norm - 0.75) / 0.25;
    return `rgb(${Math.round(180 + t * 75)}, ${Math.round(220 + t * 35)}, ${Math.round(90 + t * 50)})`;
  }

  return (
    <main className="lab-shell">
      <Sidebar />
      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">TRACE DETAIL</p>
            <h1>{trace.name}</h1>
          </div>
          <div className="top-actions">
            <Link
              href="/traces"
              className="rounded-lg border border-[var(--line)] bg-transparent px-4 py-2 text-[11px] font-mono text-[var(--muted)] transition hover:border-[#3a5245] hover:text-[var(--ink)]"
            >
              ← Back
            </Link>
          </div>
        </header>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4">
              <span className="block text-[9px] font-mono uppercase tracking-wider text-[var(--dim)]">
                Samples
              </span>
              <span className="mt-1 block text-[18px] font-mono font-medium text-[var(--ink)]">
                {trace.samples.length.toLocaleString()}
              </span>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4">
              <span className="block text-[9px] font-mono uppercase tracking-wider text-[var(--dim)]">
                Sample Rate
              </span>
              <span className="mt-1 block text-[18px] font-mono font-medium text-[var(--ink)]">
                {(trace.sample_rate / 1e6).toFixed(2)} MHz
              </span>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4">
              <span className="block text-[9px] font-mono uppercase tracking-wider text-[var(--dim)]">
                Voltage Peak
              </span>
              <span className="mt-1 block text-[18px] font-mono font-medium text-[var(--ink)]">
                {trace.voltage_peak.toFixed(3)} V
              </span>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4">
              <span className="block text-[9px] font-mono uppercase tracking-wider text-[var(--dim)]">
                Noise
              </span>
              <span className="mt-1 block text-[18px] font-mono font-medium text-[var(--ink)]">
                {trace.noise_mV.toFixed(1)} mV
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-5">
            <p className="mb-3 text-[10px] font-mono uppercase tracking-wider text-[var(--green)]">
              Waveform
            </p>
            <div
              className="relative h-[240px] overflow-hidden border-l border-b border-[#33443b]"
              style={{
                background:
                  "repeating-linear-gradient(0deg, transparent 0 36px, rgba(111,144,126,0.08) 37px), repeating-linear-gradient(90deg, transparent 0 59px, rgba(111,144,126,0.08) 60px)",
              }}
            >
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 1000 220"
                preserveAspectRatio="none"
              >
                <polyline
                  points={trace.samples
                    .map(
                      (v, i) =>
                        `${(i / (trace.samples.length - 1)) * 1000},${220 - ((v - min) / range) * 200}`,
                    )
                    .join(" ")}
                  fill="none"
                  stroke="var(--green-strong)"
                  strokeWidth="1.2"
                  className="drop-shadow-[0_0_6px_rgba(108,243,91,0.3)]"
                />
                <line
                  x1={(trace.trigger_sample / (trace.samples.length - 1)) * 1000}
                  y1="0"
                  x2={(trace.trigger_sample / (trace.samples.length - 1)) * 1000}
                  y2="220"
                  stroke="var(--amber)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0.6"
                />
              </svg>
              <span className="absolute top-1 left-1.5 text-[8px] font-mono text-[#607168]">
                ADC
              </span>
              <span className="absolute right-1.5 bottom-1.5 text-[8px] font-mono text-[#607168]">
                {trace.trigger_sample} → trigger
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-5">
            <p className="mb-3 text-[10px] font-mono uppercase tracking-wider text-[var(--green)]">
              Power Heatmap
            </p>
            <p className="mb-3 text-[10px] text-[var(--muted)]">
              Each cell represents a sample window. Color intensity maps to power consumption.
            </p>
            <div className="overflow-x-auto">
              <div
                className="inline-grid gap-px"
                style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
              >
                {heatData.flat().map((val, i) => (
                  <div
                    key={i}
                    className="h-3 w-3 rounded-[1px]"
                    style={{ backgroundColor: heatColor(val) }}
                    title={`Sample ${i}: ${val.toFixed(3)}`}
                  />
                ))}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-[8px] font-mono text-[var(--dim)]">
              <span>Low</span>
              <div className="flex h-2 gap-px">
                {[0, 0.25, 0.5, 0.75, 1].map((v) => (
                  <div
                    key={v}
                    className="h-full w-4"
                    style={{
                      backgroundColor: heatColor(min + v * range),
                    }}
                  />
                ))}
              </div>
              <span>High</span>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-5">
            <p className="mb-3 text-[10px] font-mono uppercase tracking-wider text-[var(--green)]">
              Metadata
            </p>
            <div className="grid grid-cols-2 gap-3 text-[12px] font-mono">
              <div className="flex justify-between rounded-lg border border-[var(--line)] bg-[#111915] p-3">
                <span className="text-[var(--muted)]">Created</span>
                <span className="text-[var(--ink)]">
                  {new Date(trace.created_at).toLocaleString()}
                </span>
              </div>
              {Object.entries(trace.metadata).map(([key, val]) => (
                <div
                  key={key}
                  className="flex justify-between rounded-lg border border-[var(--line)] bg-[#111915] p-3"
                >
                  <span className="text-[var(--muted)]">{key}</span>
                  <span className="text-[var(--ink)]">{String(val)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
