"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { ReportGenerator } from "@/components/report-generator";
import { useReports } from "@/lib/hooks";

export default function ReportsPage() {
  const { data: reports, loading } = useReports();
  const [showGenerator, setShowGenerator] = useState(false);

  const statusColors: Record<string, string> = {
    generating: "text-amber-400",
    ready: "text-[var(--green)]",
    failed: "text-[var(--red)]",
  };

  return (
    <main className="lab-shell">
      <Sidebar />
      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">DOCUMENTATION</p>
            <h1>Reports</h1>
          </div>
          <div className="top-actions">
            <button
              onClick={() => setShowGenerator(!showGenerator)}
              className={`rounded-lg px-4 py-2 text-[11px] font-mono transition ${
                showGenerator
                  ? "border border-[var(--line)] bg-transparent text-[var(--muted)]"
                  : "bg-[var(--green)] font-semibold text-[#10200f]"
              }`}
            >
              {showGenerator ? "Hide Generator" : "+ Generate Report"}
            </button>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {showGenerator && (
            <ReportGenerator
              experimentId="exp-001"
              onGenerate={() => setShowGenerator(false)}
            />
          )}

          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-20 animate-pulse rounded-xl border border-[var(--line)] bg-[var(--panel)]"
                />
              ))}
            </div>
          ) : reports.length === 0 ? (
            <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-[var(--line)]">
              <p className="text-[13px] text-[var(--muted)]">
                No reports generated yet
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-[var(--panel)] p-5"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--line)] bg-[#111915] text-[16px]">
                      📄
                    </span>
                    <div>
                      <span className="block text-[14px] font-medium text-[var(--ink)]">
                        {report.name}
                      </span>
                      <span className="mt-0.5 block text-[10px] font-mono text-[var(--muted)]">
                        {report.template} template ·{" "}
                        {new Date(report.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-[10px] font-mono uppercase tracking-wider ${statusColors[report.status]}`}
                    >
                      {report.status}
                    </span>
                    {report.status === "ready" && (
                      <button className="rounded-lg border border-[var(--line)] bg-transparent px-3 py-1.5 text-[10px] font-mono text-[var(--muted)] transition hover:border-[#3a5245] hover:text-[var(--ink)]">
                        Download
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
