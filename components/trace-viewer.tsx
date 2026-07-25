"use client";

import type { Trace } from "@/lib/types";

export function TraceViewer({ trace }: { trace: Trace }) {
  const max = Math.max(...trace.samples);
  const min = Math.min(...trace.samples);
  const range = max - min || 1;

  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--green)]">
            Trace Viewer
          </p>
          <h3 className="mt-1 text-[15px] font-medium text-[var(--ink)]">
            {trace.name}
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--muted)]">
          <span>{trace.samples.length.toLocaleString()} samples</span>
          <span className="text-[var(--line)]">·</span>
          <span>{(trace.sample_rate / 1e6).toFixed(2)} MHz</span>
        </div>
      </div>

      <div
        className="relative h-[220px] overflow-hidden border-l border-b border-[#33443b]"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent 0 36px, rgba(111,144,126,0.08) 37px), repeating-linear-gradient(90deg, transparent 0 59px, rgba(111,144,126,0.08) 60px)",
        }}
      >
        <span className="absolute top-1 left-1.5 text-[8px] font-mono text-[#607168]">
          ADC
        </span>
        <span className="absolute right-1.5 bottom-1.5 text-[8px] font-mono text-[#607168]">
          {trace.samples.length.toLocaleString()} pts
        </span>

        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1000 200"
          preserveAspectRatio="none"
        >
          <polyline
            points={trace.samples
              .map(
                (v, i) =>
                  `${(i / (trace.samples.length - 1)) * 1000},${200 - ((v - min) / range) * 180}`,
              )
              .join(" ")}
            fill="none"
            stroke="var(--green-strong)"
            strokeWidth="1.5"
            className="drop-shadow-[0_0_6px_rgba(108,243,91,0.3)]"
          />
          {trace.trigger_sample > 0 && (
            <line
              x1={(trace.trigger_sample / (trace.samples.length - 1)) * 1000}
              y1="0"
              x2={(trace.trigger_sample / (trace.samples.length - 1)) * 1000}
              y2="200"
              stroke="var(--amber)"
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.6"
            />
          )}
        </svg>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-3 border-t border-[var(--line)] pt-3">
        <div>
          <span className="block text-[9px] font-mono uppercase tracking-wider text-[var(--dim)]">
            Peak
          </span>
          <span className="block text-[13px] font-mono text-[var(--ink)]">
            {max.toFixed(3)}
          </span>
        </div>
        <div>
          <span className="block text-[9px] font-mono uppercase tracking-wider text-[var(--dim)]">
            Trigger
          </span>
          <span className="block text-[13px] font-mono text-[var(--ink)]">
            {trace.trigger_sample.toLocaleString()}
          </span>
        </div>
        <div>
          <span className="block text-[9px] font-mono uppercase tracking-wider text-[var(--dim)]">
            Noise
          </span>
          <span className="block text-[13px] font-mono text-[var(--ink)]">
            {trace.noise_mV.toFixed(1)} mV
          </span>
        </div>
        <div>
          <span className="block text-[9px] font-mono uppercase tracking-wider text-[var(--dim)]">
            Min
          </span>
          <span className="block text-[13px] font-mono text-[var(--ink)]">
            {min.toFixed(3)}
          </span>
        </div>
      </div>
    </div>
  );
}
