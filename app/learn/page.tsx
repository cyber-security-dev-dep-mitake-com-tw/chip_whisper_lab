"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { useModules } from "@/lib/hooks";
import Link from "next/link";

const CATEGORIES = ["all", "fundamentals", "attacks", "hardware", "advanced"] as const;
const DIFFICULTIES = ["all", "beginner", "intermediate", "advanced"] as const;

const difficultyColors: Record<string, string> = {
  beginner: "border-[#3f7547] text-[var(--green)]",
  intermediate: "border-[#6b5b34] text-[var(--amber)]",
  advanced: "border-[#6b3434] text-[var(--red)]",
};

export default function LearnPage() {
  const { data: modules, loading } = useModules();
  const [category, setCategory] = useState<string>("all");
  const [difficulty, setDifficulty] = useState<string>("all");

  const filtered = modules.filter(
    (m) =>
      (category === "all" || m.category === category) &&
      (difficulty === "all" || m.difficulty === difficulty),
  );

  return (
    <main className="lab-shell">
      <Sidebar />
      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">EDUCATION</p>
            <h1>Learn</h1>
          </div>
        </header>

        <div className="p-6 space-y-6">
          <div className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-5">
            <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--green)]">
              Curriculum
            </p>
            <h2 className="mt-2 text-[18px] font-medium text-[var(--ink)]">
              Side-Channel Analysis Curriculum
            </h2>
            <p className="mt-2 text-[12px] text-[var(--muted)] leading-relaxed max-w-2xl">
              Master power analysis, fault injection, and hardware security through
              hands-on labs with real ChipWhisperer hardware. Each module includes
              theory, interactive notebooks, and practical exercises.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--dim)] mr-1">
              Category:
            </span>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-lg border px-3 py-1.5 text-[10px] font-mono transition ${
                  category === c
                    ? "border-[var(--green)] bg-[#17221d] text-[var(--green)]"
                    : "border-[var(--line)] bg-transparent text-[var(--muted)] hover:border-[#3a5245]"
                }`}
              >
                {c}
              </button>
            ))}
            <div className="w-px h-4 bg-[var(--line)] mx-1" />
            <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--dim)] mr-1">
              Level:
            </span>
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`rounded-lg border px-3 py-1.5 text-[10px] font-mono transition ${
                  difficulty === d
                    ? "border-[var(--green)] bg-[#17221d] text-[var(--green)]"
                    : "border-[var(--line)] bg-transparent text-[var(--muted)] hover:border-[#3a5245]"
                }`}
              >
                {d}
              </button>
            ))}
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
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((mod) => (
                <Link
                  key={mod.id}
                  href={`/learn/${mod.id}`}
                  className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-5 transition hover:border-[#3a5245] hover:bg-[#1a2620]"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span
                      className={`rounded-md border px-2 py-0.5 text-[9px] font-mono ${difficultyColors[mod.difficulty]}`}
                    >
                      {mod.difficulty}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--dim)]">
                      {mod.duration}
                    </span>
                  </div>
                  <h3 className="text-[14px] font-medium text-[var(--ink)] leading-snug">
                    {mod.title}
                  </h3>
                  <p className="mt-2 text-[11px] text-[var(--muted)] leading-relaxed line-clamp-2">
                    {mod.description}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="rounded bg-[#1c2922] px-1.5 py-0.5 text-[9px] font-mono text-[var(--muted)] border border-[#2a3a30]">
                      {mod.category}
                    </span>
                    {mod.lab_url && (
                      <span className="rounded bg-[#17221d] px-1.5 py-0.5 text-[9px] font-mono text-[var(--green)] border border-[#3f7547]">
                        Lab available
                      </span>
                    )}
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
