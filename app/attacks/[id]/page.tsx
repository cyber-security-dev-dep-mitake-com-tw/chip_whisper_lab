"use client";

import { use } from "react";
import { Sidebar } from "@/components/sidebar";
import { AttackMonitor } from "@/components/attack-monitor";
import { useAttack } from "@/lib/hooks";
import Link from "next/link";

export default function AttackDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: attack } = useAttack(id);

  return (
    <main className="lab-shell">
      <Sidebar />
      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">ATTACK MONITOR</p>
            <h1>{attack.name}</h1>
          </div>
          <div className="top-actions">
            <Link
              href="/attacks"
              className="rounded-lg border border-[var(--line)] bg-transparent px-4 py-2 text-[11px] font-mono text-[var(--muted)] transition hover:border-[#3a5245] hover:text-[var(--ink)]"
            >
              ← Back
            </Link>
          </div>
        </header>

        <div className="p-6 space-y-6">
          <AttackMonitor attack={attack} />

          {attack.results && attack.results.correlations.length > 0 && (
            <div className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-5">
              <p className="mb-3 text-[10px] font-mono uppercase tracking-wider text-[var(--green)]">
                Correlation Plot
              </p>
              <div
                className="relative h-[200px] overflow-hidden border-l border-b border-[#33443b]"
                style={{
                  background:
                    "repeating-linear-gradient(0deg, transparent 0 36px, rgba(111,144,126,0.08) 37px), repeating-linear-gradient(90deg, transparent 0 59px, rgba(111,144,126,0.08) 60px)",
                }}
              >
                <svg
                  className="absolute inset-0 h-full w-full"
                  viewBox="0 0 256 180"
                  preserveAspectRatio="none"
                >
                  {attack.results.correlations.map((corr, i) => {
                    const barHeight = Math.abs(corr) * 160;
                    const isMax =
                      attack.results &&
                      corr === Math.max(...attack.results.correlations);
                    return (
                      <rect
                        key={i}
                        x={(i / 256) * 256}
                        y={180 - barHeight}
                        width={1}
                        height={barHeight}
                        fill={
                          isMax
                            ? "var(--green-strong)"
                            : "rgba(108,243,91,0.3)"
                        }
                      />
                    );
                  })}
                </svg>
                <span className="absolute top-1 left-1.5 text-[8px] font-mono text-[#607168]">
                  Correlation
                </span>
                <span className="absolute right-1.5 bottom-1.5 text-[8px] font-mono text-[#607168]">
                  256 key candidates
                </span>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-3 text-[11px] font-mono">
                <div>
                  <span className="text-[var(--dim)]">Best correlation</span>
                  <span className="ml-2 text-[var(--ink)]">
                    {Math.max(...attack.results.correlations).toFixed(4)}
                  </span>
                </div>
                <div>
                  <span className="text-[var(--dim)]">PGE</span>
                  <span className="ml-2 text-[var(--ink)]">
                    {attack.results.pge}
                  </span>
                </div>
                <div>
                  <span className="text-[var(--dim)]">SNR</span>
                  <span className="ml-2 text-[var(--ink)]">
                    {attack.results.snr.toFixed(1)} dB
                  </span>
                </div>
                <div>
                  <span className="text-[var(--dim)]">Recovered key</span>
                  <span className="ml-2 text-[var(--ink)]">
                    {attack.results.key_candidates
                      .slice(0, 4)
                      .map((b) => b.toString(16).padStart(2, "0"))
                      .join(" ")}
                    ...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-5">
            <p className="mb-3 text-[10px] font-mono uppercase tracking-wider text-[var(--green)]">
              Configuration
            </p>
            <div className="grid grid-cols-2 gap-3 text-[12px] font-mono lg:grid-cols-3">
              <div className="flex justify-between rounded-lg border border-[var(--line)] bg-[#111915] p-3">
                <span className="text-[var(--muted)]">Attack type</span>
                <span className="text-[var(--ink)] uppercase">{attack.type}</span>
              </div>
              <div className="flex justify-between rounded-lg border border-[var(--line)] bg-[#111915] p-3">
                <span className="text-[var(--muted)]">Trace range</span>
                <span className="text-[var(--ink)]">
                  {attack.config.trace_start}–{attack.config.trace_end}
                </span>
              </div>
              <div className="flex justify-between rounded-lg border border-[var(--line)] bg-[#111915] p-3">
                <span className="text-[var(--muted)]">Sample points</span>
                <span className="text-[var(--ink)]">
                  {attack.config.point_start}–{attack.config.point_end}
                </span>
              </div>
              <div className="flex justify-between rounded-lg border border-[var(--line)] bg-[#111915] p-3">
                <span className="text-[var(--muted)]">Power model</span>
                <span className="text-[var(--ink)]">{attack.config.model}</span>
              </div>
              <div className="flex justify-between rounded-lg border border-[var(--line)] bg-[#111915] p-3">
                <span className="text-[var(--muted)]">Target op</span>
                <span className="text-[var(--ink)]">
                  {attack.config.target_operation}
                </span>
              </div>
              <div className="flex justify-between rounded-lg border border-[var(--line)] bg-[#111915] p-3">
                <span className="text-[var(--muted)]">Rounds</span>
                <span className="text-[var(--ink)]">{attack.config.rounds}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
