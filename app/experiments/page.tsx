"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { ExperimentCard } from "@/components/experiment-card";
import { useExperiments } from "@/lib/hooks";

const STATUS_FILTERS = ["all", "draft", "running", "completed", "failed"] as const;

export default function ExperimentsPage() {
  const { data: experiments, loading } = useExperiments();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = experiments.filter((exp) => {
    const matchesStatus =
      statusFilter === "all" || exp.status === statusFilter;
    const matchesSearch =
      exp.name.toLowerCase().includes(search.toLowerCase()) ||
      exp.description.toLowerCase().includes(search.toLowerCase()) ||
      exp.tags.some((t) => t.includes(search.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <main className="lab-shell">
      <Sidebar />
      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">RESEARCH</p>
            <h1>Experiments</h1>
          </div>
          <div className="top-actions">
            <button className="rounded-lg bg-[var(--green)] px-4 py-2 text-[11px] font-mono font-semibold text-[#10200f] transition hover:bg-[#b2ff9f]">
              + New Experiment
            </button>
          </div>
        </header>

        <div className="p-6">
          <div className="mb-5 flex items-center gap-3">
            <input
              type="text"
              placeholder="Search experiments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 rounded-lg border border-[var(--line)] bg-[#111915] px-4 py-2.5 text-[13px] text-[var(--ink)] outline-none placeholder:text-[var(--dim)] focus:border-[var(--green)]"
            />
            <div className="flex gap-1.5">
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
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-48 animate-pulse rounded-xl border border-[var(--line)] bg-[var(--panel)]"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-[var(--line)]">
              <p className="text-[13px] text-[var(--muted)]">
                No experiments found
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((exp) => (
                <ExperimentCard key={exp.id} experiment={exp} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
