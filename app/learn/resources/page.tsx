"use client";

import Link from "next/link";
import { Sidebar } from "@/components/sidebar";

type ResourceEntry = {
  title: string;
  description: string;
  href: string;
  tags: string[];
};

type ResourceSection = {
  heading: string;
  entries: ResourceEntry[];
};

const SECTIONS: ResourceSection[] = [
  {
    heading: "1. 最佳入門英文教材 / Best English-Language Introductions",
    entries: [
      {
        title: "CyBOK Hardware Security Knowledge Area (v1.0.1)",
        description:
          "The most complete, clearly structured hardware-security body of knowledge (~41 pages): design lifecycle, Root of Trust, side-channel attacks, hardware Trojans, PUFs, trusted computing.",
        href: "https://www.cybok.org/media/downloads/Hardware_Security_v1.0.1.pdf",
        tags: ["EN", "Free"],
      },
      {
        title: "High-Level Approaches to Hardware Security: A Tutorial",
        description: "Pearce, Karri, Tan (2023) — two teaching case studies for beginners.",
        href: "https://arxiv.org/abs/2302.13445",
        tags: ["EN", "Free"],
      },
      {
        title: "Introduction to Hardware Security",
        description: "Yier Jin (2015) — classic short survey for building core concepts fast.",
        href: "https://www.mdpi.com/2079-9268/5/4/17",
        tags: ["EN", "Free"],
      },
    ],
  },
  {
    heading: "2. 中文／台灣相關入門資源 / Chinese-Language & Taiwan Resources",
    entries: [
      {
        title: "《IC設計中必須懂的資安基礎》(熵碼學院 / PUFacademy)",
        description:
          "Free ~8-hour Taiwan-produced beginner course: chip-security standards, hardware Root of Trust, security-chip market ecosystem, chip security design.",
        href: "https://pufacademy.com/basic.html",
        tags: ["ZH", "Free"],
      },
      {
        title: "PUFacademy 官網 / Homepage",
        description: "Basic + core-technology course tracks, video series.",
        href: "https://pufacademy.com/",
        tags: ["ZH", "Free"],
      },
      {
        title: "PUFacademy 核心技術 / Core Technology Track",
        description: "Intermediate/advanced hardware security topics including TRNG implementation.",
        href: "https://pufacademy.com/tech.html",
        tags: ["ZH", "Free"],
      },
    ],
  },
  {
    heading: "5. 熵源（Entropy Source）教學教材 / Entropy Source Materials",
    entries: [
      {
        title: "NIST SP 800-90B",
        description:
          "Recommendation for the Entropy Sources Used for Random Bit Generation — the authoritative entropy-source model, health tests, and estimation methods (IID / non-IID).",
        href: "https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-90B.pdf",
        tags: ["EN", "Free"],
      },
      {
        title: "Viktor Fischer — Random Number Generators for Cryptography",
        description: "Excellent introductory slide deck on TRNG design and evaluation.",
        href: "https://summerschool-croatia.cs.ru.nl/2014/slides/Random%20Number%20Generators%20for%20Cryptography.pdf",
        tags: ["EN", "Free"],
      },
      {
        title: "RISC-V Entropy Source Interface",
        description: "A modern implementation example: designing an entropy-source interface into a processor.",
        href: "https://eprint.iacr.org/2020/866.pdf",
        tags: ["EN", "Free"],
      },
      {
        title: "NIST SP800-90B_EntropyAssessment (tool)",
        description: "Open-source entropy estimation tool from NIST.",
        href: "https://github.com/usnistgov/SP800-90B_EntropyAssessment",
        tags: ["EN", "Free", "Tool"],
      },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <main className="lab-shell">
      <Sidebar />
      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">LEARN</p>
            <h1>Beginner Hardware Security Resources</h1>
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
          <div className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-5">
            <p className="text-[12px] text-[var(--muted)] leading-relaxed">
              A curated, free/downloadable reading list for learners starting out in chip
              security / hardware security. All entries are external links — no PDFs are
              hosted in this app. This complements{" "}
              <Link href="/learn/module-04-puf-trng" className="text-[var(--green)] underline">
                Module 04: PUF &amp; TRNG
              </Link>
              , which covers the same entropy-source topics at working-engineer depth. The full
              list (including additional handouts and advanced references) lives in the repo at{" "}
              <code className="text-[11px]">
                curriculum/resources/hardware-security-beginner-resources.md
              </code>
              .
            </p>
          </div>

          {SECTIONS.map((section) => (
            <div
              key={section.heading}
              className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-5"
            >
              <p className="mb-4 text-[10px] font-mono uppercase tracking-wider text-[var(--green)]">
                {section.heading}
              </p>
              <div className="space-y-4">
                {section.entries.map((entry) => (
                  <a
                    key={entry.href}
                    href={entry.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg border border-[var(--line)] p-3 transition hover:border-[#3a5245]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-[13px] font-medium text-[var(--ink)]">
                        {entry.title}
                      </h3>
                      <div className="flex shrink-0 gap-1">
                        {entry.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded bg-[#1c2922] px-1.5 py-0.5 text-[9px] font-mono text-[var(--muted)] border border-[#2a3a30]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="mt-1 text-[11px] text-[var(--dim)] leading-relaxed">
                      {entry.description}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
