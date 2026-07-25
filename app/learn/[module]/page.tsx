"use client";

import { use } from "react";
import { Sidebar } from "@/components/sidebar";
import { useModule } from "@/lib/hooks";
import Link from "next/link";

const THEORY_CONTENT: Record<string, { sections: { title: string; content: string }[] }> = {
  "mod-001": {
    sections: [
      {
        title: "What is Side-Channel Analysis?",
        content:
          "Side-channel analysis (SCA) exploits information leaked through physical implementations of cryptographic systems. Unlike mathematical attacks, SCA targets the hardware itself—power consumption, electromagnetic emissions, timing, and even acoustic signals.",
      },
      {
        title: "Power Analysis Basics",
        content:
          "Every CMOS circuit consumes power when transistors switch states. The power consumption pattern correlates with the data being processed. By measuring power traces during cryptographic operations, an attacker can extract secret keys.",
      },
      {
        title: "Simple vs. Differential Analysis",
        content:
          "Simple Power Analysis (SPA) involves visually inspecting a single power trace to identify operations. Differential Power Analysis (DPA) uses statistical methods across many traces to amplify small signal differences.",
      },
    ],
  },
  "mod-002": {
    sections: [
      {
        title: "Correlation Power Analysis Theory",
        content:
          "CPA uses Pearson correlation to find the relationship between a hypothetical power model and actual measurements. For each possible key byte, we compute the predicted power consumption and correlate it with the measured trace.",
      },
      {
        title: "Power Models",
        content:
          "The Hamming Weight model counts the number of set bits in a value. The Hamming Distance model considers bit transitions between consecutive states. Choice of model significantly affects attack success.",
      },
      {
        title: "Key Recovery Process",
        content:
          "We attack one byte at a time, computing correlations for all 256 possible values. The byte with the highest correlation is the most likely correct key byte. Repeating for all 16 bytes recovers the full AES-128 key.",
      },
    ],
  },
};

const DEFAULT_THEORY = {
  sections: [
    {
      title: "Module Overview",
      content:
        "This module covers essential concepts in hardware security and side-channel analysis. Follow the theory sections and complete the practical lab to master the material.",
    },
  ],
};

const difficultyColors: Record<string, string> = {
  beginner: "border-[#3f7547] text-[var(--green)]",
  intermediate: "border-[#6b5b34] text-[var(--amber)]",
  advanced: "border-[#6b3434] text-[var(--red)]",
};

export default function ModuleDetailPage({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const { module: moduleId } = use(params);
  const { data: mod } = useModule(moduleId);
  const theory = THEORY_CONTENT[moduleId] || DEFAULT_THEORY;

  return (
    <main className="lab-shell">
      <Sidebar />
      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">MODULE</p>
            <h1>{mod.title}</h1>
          </div>
          <div className="top-actions">
            <Link
              href="/learn"
              className="rounded-lg border border-[var(--line)] bg-transparent px-4 py-2 text-[11px] font-mono text-[var(--muted)] transition hover:border-[#3a5245] hover:text-[var(--ink)]"
            >
              ← Back
            </Link>
          </div>
        </header>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <span
              className={`rounded-md border px-2 py-0.5 text-[9px] font-mono ${difficultyColors[mod.difficulty]}`}
            >
              {mod.difficulty}
            </span>
            <span className="text-[10px] font-mono text-[var(--dim)]">
              {mod.duration}
            </span>
            <span className="rounded bg-[#1c2922] px-1.5 py-0.5 text-[9px] font-mono text-[var(--muted)] border border-[#2a3a30]">
              {mod.category}
            </span>
          </div>

          <div className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-5">
            <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--green)]">
              About
            </p>
            <p className="mt-2 text-[13px] text-[var(--muted)] leading-relaxed">
              {mod.description}
            </p>
          </div>

          <div className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-5">
            <p className="mb-4 text-[10px] font-mono uppercase tracking-wider text-[var(--green)]">
              Theory
            </p>
            <div className="space-y-5">
              {theory.sections.map((section, i) => (
                <div key={i}>
                  <h3 className="text-[14px] font-medium text-[var(--ink)]">
                    {section.title}
                  </h3>
                  <p className="mt-2 text-[12px] text-[var(--muted)] leading-relaxed">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {mod.lab_url && (
            <div className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-5">
              <p className="mb-3 text-[10px] font-mono uppercase tracking-wider text-[var(--green)]">
                Lab Notebook
              </p>
              <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed border-[var(--line)] bg-[#111915]">
                <div className="text-center">
                  <span className="block text-[32px]">📓</span>
                  <span className="mt-2 block text-[13px] text-[var(--muted)]">
                    Interactive lab notebook
                  </span>
                  <span className="mt-1 block text-[10px] text-[var(--dim)]">
                    Jupyter notebook embedded via iframe
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Link
              href="/experiments"
              className="flex-1 rounded-lg bg-[var(--green)] px-4 py-3 text-center text-[11px] font-mono font-semibold text-[#10200f] transition hover:bg-[#b2ff9f]"
            >
              Start Experiment
            </Link>
            <Link
              href="/traces"
              className="flex-1 rounded-lg border border-[var(--line)] bg-transparent px-4 py-3 text-center text-[11px] font-mono text-[var(--muted)] transition hover:border-[#3a5245] hover:text-[var(--ink)]"
            >
              View Sample Traces
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
