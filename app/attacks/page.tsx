"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { AttackBuilder } from "@/components/attack-builder";
import { useAttacks } from "@/lib/hooks";
import Link from "next/link";

const STATUS_FILTERS = ["all", "configured", "running", "completed", "failed"] as const;

export default function AttacksPage() {
  const { data: attacks, loading } = useAttacks();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showBuilder, setShowBuilder] = useState(false);

  const filtered = attacks.filter(
    (a) => statusFilter === "all" || a.status === statusFilter,
  );

  const statusColors: Record<string, string> = {
    configured: "text-gray-400",
    running: "text-amber-400",
    completed: "text-[var(--green)]",
    failed: "text-[var(--red)]",
  };

  return (
    <main className="lab-shell">
      <Sidebar />
      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">ANALYSIS</p>
            <h1>Attacks</h1>
          </div>
          <div className="top-actions">
            <button
              onClick={() => setShowBuilder(!showBuilder)}
              className={`rounded-lg px-4 py-2 text-[11px] font-mono transition ${
                showBuilder
                  ? "border border-[var(--line)] bg-transparent text-[var(--muted)]"
                  : "bg-[var(--green)] font-semibold text-[#10200f]"
              }`}
            >
              {showBuilder ? "Hide Builder" : "+ New Attack"}
            </button>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {showBuilder && (
            <AttackBuilder
              experimentId="exp-001"
              onLaunch={() => setShowBuilder(false)}
            />
          )}

          <div className="flex items-center gap-2">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`rounded-lg border px-3 py-2 text-[10px] font-mono transition ${
                  statusFilter === f
                    ? "border-[var(--green)] bg-[#17221d] text-[var(--green)]"
                    : "border-[var(--line)] bg-transparent text-[var(--muted)] hover:border-[#3a5245]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-xl border border-[var(--line)] bg-[var(--panel)]"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-[var(--line)]">
              <p className="text-[13px] text-[var(--muted)]">
                No attacks found
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((attack) => (
                <Link
                  key={attack.id}
                  href={`/attacks/${attack.id}`}
                  className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-[var(--panel)] p-5 transition hover:border-[#3a5245]"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--line)] bg-[#111915] text-[11px] font-mono font-bold uppercase text-[var(--green)]">
                      {attack.type}
                    </span>
                    <div>
                      <span className="block text-[14px] font-medium text-[var(--ink)]">
                        {attack.name}
                      </span>
                      <span className="mt-0.5 block text-[10px] font-mono text-[var(--muted)]">
                        {attack.config.trace_end - attack.config.trace_start} traces ·{" "}
                        {attack.config.model}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {attack.status === "running" && (
                      <div className="w-24">
                        <div className="h-1.5 overflow-hidden rounded-full bg-[#1c2922]">
                          <div
                            className="h-full rounded-full bg-[var(--green-strong)]"
                            style={{ width: `${attack.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    <span
                      className={`text-[10px] font-mono uppercase tracking-wider ${statusColors[attack.status]}`}
                    >
                      {attack.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
