"use client";

import Link from "next/link";
import type { Experiment } from "@/lib/types";

const statusStyles: Record<Experiment["status"], string> = {
  draft: "bg-gray-800 text-gray-400 border-gray-700",
  running: "bg-amber-900/30 text-amber-400 border-amber-700",
  completed: "bg-emerald-900/30 text-emerald-400 border-emerald-700",
  failed: "bg-red-900/30 text-red-400 border-red-700",
};

export function ExperimentCard({ experiment }: { experiment: Experiment }) {
  return (
    <Link
      href={`/experiments/${experiment.id}`}
      className="block rounded-xl border border-[var(--line)] bg-[var(--panel)] p-5 transition hover:border-[#3a5245] hover:bg-[#1a2620]"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-[15px] font-medium text-[var(--ink)] leading-tight">
          {experiment.name}
        </h3>
        <span
          className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-mono ${statusStyles[experiment.status]}`}
        >
          {experiment.status}
        </span>
      </div>

      <p className="mb-4 text-[12px] text-[var(--muted)] leading-relaxed line-clamp-2">
        {experiment.description}
      </p>

      <div className="grid grid-cols-3 gap-3 border-t border-[var(--line)] pt-3">
        <div>
          <span className="block text-[9px] font-mono uppercase tracking-wider text-[var(--dim)]">
            Traces
          </span>
          <span className="block text-[13px] font-mono text-[var(--ink)]">
            {experiment.trace_count.toLocaleString()}
          </span>
        </div>
        <div>
          <span className="block text-[9px] font-mono uppercase tracking-wider text-[var(--dim)]">
            Attacks
          </span>
          <span className="block text-[13px] font-mono text-[var(--ink)]">
            {experiment.attack_count}
          </span>
        </div>
        <div>
          <span className="block text-[9px] font-mono uppercase tracking-wider text-[var(--dim)]">
            Updated
          </span>
          <span className="block text-[13px] font-mono text-[var(--ink)]">
            {new Date(experiment.updated_at).toLocaleDateString()}
          </span>
        </div>
      </div>

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
    </Link>
  );
}
