"use client";

import { useState, useRef } from "react";
import { Sidebar } from "@/components/sidebar";
import { TraceViewer } from "@/components/trace-viewer";
import { useTraces } from "@/lib/hooks";

export default function TracesPage() {
  const { data: traces, loading } = useTraces();
  const [selectedTrace, setSelectedTrace] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeTrace = traces.find((t) => t.id === selectedTrace);

  return (
    <main className="lab-shell">
      <Sidebar />
      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">CAPTURE</p>
            <h1>Traces</h1>
          </div>
          <div className="top-actions">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg border border-[var(--line)] bg-transparent px-4 py-2 text-[11px] font-mono text-[var(--muted)] transition hover:border-[#3a5245] hover:text-[var(--ink)]"
            >
              Upload Trace
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".npy,.trs,.csv"
              className="hidden"
            />
            <button className="rounded-lg bg-[var(--green)] px-4 py-2 text-[11px] font-mono font-semibold text-[#10200f] transition hover:bg-[#b2ff9f]">
              Capture New
            </button>
          </div>
        </header>

        <div className="flex h-[calc(100vh-98px)]">
          <div className="w-72 flex-shrink-0 overflow-y-auto border-r border-[var(--line)] p-4">
            <p className="mb-3 text-[9px] font-mono uppercase tracking-wider text-[var(--dim)]">
              All Traces ({traces.length})
            </p>
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-16 animate-pulse rounded-lg border border-[var(--line)] bg-[var(--panel)]"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-1.5">
                {traces.map((trace) => (
                  <button
                    key={trace.id}
                    onClick={() => setSelectedTrace(trace.id)}
                    className={`w-full rounded-lg p-3 text-left transition ${
                      selectedTrace === trace.id
                        ? "border border-[var(--green)] bg-[#17221d]"
                        : "border border-transparent hover:bg-[#1a2620]"
                    }`}
                  >
                    <span className="block text-[12px] text-[var(--ink)]">
                      {trace.name}
                    </span>
                    <span className="mt-0.5 block text-[9px] font-mono text-[var(--muted)]">
                      {trace.samples.length.toLocaleString()} samples ·{" "}
                      {(trace.sample_rate / 1e6).toFixed(2)} MHz
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeTrace ? (
              <div className="space-y-4">
                <TraceViewer trace={activeTrace} />
                <div className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-5">
                  <p className="text-[9px] font-mono uppercase tracking-wider text-[var(--dim)]">
                    Metadata
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-3 text-[12px] font-mono">
                    {Object.entries(activeTrace.metadata).map(([key, val]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-[var(--muted)]">{key}</span>
                        <span className="text-[var(--ink)]">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-[13px] text-[var(--muted)]">
                  Select a trace to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
