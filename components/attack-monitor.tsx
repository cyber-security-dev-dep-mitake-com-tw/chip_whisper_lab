"use client";

import { useState, useEffect } from "react";
import type { Attack } from "@/lib/types";

const statusColors: Record<Attack["status"], string> = {
  configured: "text-gray-400",
  running: "text-amber-400",
  completed: "text-emerald-400",
  failed: "text-red-400",
};

export function AttackMonitor({ attack }: { attack: Attack }) {
  const [progress, setProgress] = useState(attack.progress);

  useEffect(() => {
    if (attack.status !== "running") return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + Math.random() * 3;
      });
    }, 300);
    return () => clearInterval(interval);
  }, [attack.status]);

  const effectiveProgress =
    attack.status === "running" ? Math.min(progress, 100) : attack.progress;

  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--green)]">
            Attack Monitor
          </p>
          <h3 className="mt-1 text-[15px] font-medium text-[var(--ink)]">
            {attack.name}
          </h3>
        </div>
        <span
          className={`text-[10px] font-mono uppercase tracking-wider ${statusColors[attack.status]}`}
        >
          {attack.status}
        </span>
      </div>

      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between text-[10px] font-mono text-[var(--muted)]">
          <span>Progress</span>
          <span>{effectiveProgress.toFixed(1)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#1c2922]">
          <div
            className="h-full rounded-full bg-[var(--green-strong)] transition-all duration-300"
            style={{ width: `${effectiveProgress}%` }}
          />
        </div>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-[var(--line)] bg-[#111915] p-3 text-center">
          <span className="block text-[9px] font-mono uppercase tracking-wider text-[var(--dim)]">
            Type
          </span>
          <span className="block mt-1 text-[14px] font-mono font-medium text-[var(--ink)] uppercase">
            {attack.type}
          </span>
        </div>
        <div className="rounded-lg border border-[var(--line)] bg-[#111915] p-3 text-center">
          <span className="block text-[9px] font-mono uppercase tracking-wider text-[var(--dim)]">
            Traces
          </span>
          <span className="block mt-1 text-[14px] font-mono font-medium text-[var(--ink)]">
            {attack.config.trace_end - attack.config.trace_start}
          </span>
        </div>
        <div className="rounded-lg border border-[var(--line)] bg-[#111915] p-3 text-center">
          <span className="block text-[9px] font-mono uppercase tracking-wider text-[var(--dim)]">
            Points
          </span>
          <span className="block mt-1 text-[14px] font-mono font-medium text-[var(--ink)]">
            {attack.config.point_end - attack.config.point_start}
          </span>
        </div>
      </div>

      {attack.results && (
        <div className="rounded-lg border border-[var(--line)] bg-[#111915] p-4">
          <p className="text-[9px] font-mono uppercase tracking-wider text-[var(--dim)]">
            Results
          </p>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <div>
              <span className="block text-[9px] font-mono text-[var(--dim)]">
                Success
              </span>
              <span
                className={`block text-[13px] font-mono font-medium ${
                  attack.results.success ? "text-[var(--green)]" : "text-[var(--red)]"
                }`}
              >
                {attack.results.success ? "Yes" : "No"}
              </span>
            </div>
            <div>
              <span className="block text-[9px] font-mono text-[var(--dim)]">
                PGE
              </span>
              <span className="block text-[13px] font-mono font-medium text-[var(--ink)]">
                {attack.results.pge}
              </span>
            </div>
            <div>
              <span className="block text-[9px] font-mono text-[var(--dim)]">
                SNR
              </span>
              <span className="block text-[13px] font-mono font-medium text-[var(--ink)]">
                {attack.results.snr.toFixed(1)} dB
              </span>
            </div>
            <div>
              <span className="block text-[9px] font-mono text-[var(--dim)]">
                Key
              </span>
              <span className="block text-[11px] font-mono text-[var(--ink)]">
                {attack.results.key_candidates
                  .map((b) => b.toString(16).padStart(2, "0"))
                  .join(" ")}
              </span>
            </div>
          </div>
        </div>
      )}

      {attack.started_at && (
        <div className="mt-3 flex items-center gap-4 text-[9px] font-mono text-[var(--dim)]">
          <span>Started: {new Date(attack.started_at).toLocaleTimeString()}</span>
          {attack.completed_at && (
            <span>
              Completed: {new Date(attack.completed_at).toLocaleTimeString()}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
