"use client";

import { use } from "react";
import { Sidebar } from "@/components/sidebar";
import { TraceViewer } from "@/components/trace-viewer";
import { useExperiment, useTraces, useAttacks } from "@/lib/hooks";
import Link from "next/link";

export default function ExperimentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: experiment } = useExperiment(id);
  const { data: traces } = useTraces(id);
  const { data: attacks } = useAttacks(id);

  return (
    <main className="lab-shell">
      <Sidebar />
      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">EXPERIMENT</p>
            <h1>{experiment.name}</h1>
          </div>
          <div className="top-actions">
            <Link
              href="/experiments"
              className="rounded-lg border border-[var(--line)] bg-transparent px-4 py-2 text-[11px] font-mono text-[var(--muted)] transition hover:border-[#3a5245] hover:text-[var(--ink)]"
            >
              ← Back
            </Link>
          </div>
        </header>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-5">
              <p className="text-[9px] font-mono uppercase tracking-wider text-[var(--dim)]">
                Status
              </p>
              <span className="mt-1 inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-mono text-[var(--ink)]">
                {experiment.status}
              </span>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-5">
              <p className="text-[9px] font-mono uppercase tracking-wider text-[var(--dim)]">
                Traces
              </p>
              <span className="mt-1 block text-[22px] font-mono font-medium text-[var(--ink)]">
                {experiment.trace_count.toLocaleString()}
              </span>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-5">
              <p className="text-[9px] font-mono uppercase tracking-wider text-[var(--dim)]">
                Attacks
              </p>
              <span className="mt-1 block text-[22px] font-mono font-medium text-[var(--ink)]">
                {experiment.attack_count}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-5">
            <p className="text-[9px] font-mono uppercase tracking-wider text-[var(--dim)]">
              Description
            </p>
            <p className="mt-2 text-[13px] text-[var(--muted)] leading-relaxed">
              {experiment.description}
            </p>
            {experiment.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {experiment.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-[#1c2922] px-1.5 py-0.5 text-[9px] font-mono text-[var(--muted)] border border-[#2a3a30]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="mb-3 text-[14px] font-medium text-[var(--ink)]">
              Traces
            </h2>
            {traces.length === 0 ? (
              <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-[var(--line)]">
                <p className="text-[12px] text-[var(--muted)]">
                  No traces captured yet
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {traces.map((trace) => (
                  <TraceViewer key={trace.id} trace={trace} />
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="mb-3 text-[14px] font-medium text-[var(--ink)]">
              Attacks
            </h2>
            {attacks.length === 0 ? (
              <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-[var(--line)]">
                <p className="text-[12px] text-[var(--muted)]">
                  No attacks configured
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {attacks.map((atk) => (
                  <Link
                    key={atk.id}
                    href={`/attacks/${atk.id}`}
                    className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4 transition hover:border-[#3a5245]"
                  >
                    <div>
                      <span className="text-[13px] font-medium text-[var(--ink)]">
                        {atk.name}
                      </span>
                      <span className="ml-2 text-[10px] font-mono uppercase text-[var(--muted)]">
                        {atk.type}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-mono ${
                        atk.status === "completed"
                          ? "text-[var(--green)]"
                          : atk.status === "running"
                            ? "text-amber-400"
                            : "text-[var(--muted)]"
                      }`}
                    >
                      {atk.status}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
