"use client";

import { useState } from "react";

const TEMPLATES = [
  {
    id: "standard",
    name: "Standard",
    desc: "Summary of experiment, traces, and attack results",
  },
  {
    id: "detailed",
    name: "Detailed",
    desc: "Full analysis with all traces, correlations, and methodology",
  },
  {
    id: "academic",
    name: "Academic",
    desc: "Paper-ready format with LaTeX-style sections and citations",
  },
] as const;

export function ReportGenerator({
  experimentId,
  onGenerate,
}: {
  experimentId: string;
  onGenerate?: (template: string) => void;
}) {
  const [selected, setSelected] = useState<string>("standard");

  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-5">
      <div className="mb-4">
        <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--green)]">
          Report Generator
        </p>
        <h3 className="mt-1 text-[15px] font-medium text-[var(--ink)]">
          Choose Template
        </h3>
      </div>

      <div className="mb-5 space-y-2">
        {TEMPLATES.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => setSelected(tpl.id)}
            className={`w-full rounded-lg border p-4 text-left transition ${
              selected === tpl.id
                ? "border-[var(--green)] bg-[#17221d]"
                : "border-[var(--line)] bg-transparent hover:border-[#3a5245]"
            }`}
          >
            <span
              className={`block text-[13px] font-medium ${
                selected === tpl.id ? "text-[var(--green)]" : "text-[var(--ink)]"
              }`}
            >
              {tpl.name}
            </span>
            <span className="mt-1 block text-[10px] text-[var(--muted)]">
              {tpl.desc}
            </span>
          </button>
        ))}
      </div>

      <button
        onClick={() => onGenerate?.(selected)}
        className="w-full rounded-lg bg-[var(--green)] px-4 py-2.5 text-[11px] font-mono font-semibold text-[#10200f] transition hover:bg-[#b2ff9f]"
      >
        Generate Report
      </button>
    </div>
  );
}
