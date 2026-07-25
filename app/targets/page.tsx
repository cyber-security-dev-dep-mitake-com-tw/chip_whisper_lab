"use client";

import { Sidebar } from "@/components/sidebar";
import { TargetCard } from "@/components/target-card";
import { useTargets } from "@/lib/hooks";

export default function TargetsPage() {
  const { data: targets, loading } = useTargets();

  return (
    <main className="lab-shell">
      <Sidebar />
      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">HARDWARE</p>
            <h1>Targets</h1>
          </div>
          <div className="top-actions">
            <button className="rounded-lg border border-[var(--line)] bg-transparent px-4 py-2 text-[11px] font-mono text-[var(--muted)] transition hover:border-[#3a5245] hover:text-[var(--ink)]">
              Scan USB
            </button>
            <button className="rounded-lg bg-[var(--green)] px-4 py-2 text-[11px] font-mono font-semibold text-[#10200f] transition hover:bg-[#b2ff9f]">
              + Add Target
            </button>
          </div>
        </header>

        <div className="p-6">
          {loading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-56 animate-pulse rounded-xl border border-[var(--line)] bg-[var(--panel)]"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {targets.map((target) => (
                <TargetCard
                  key={target.id}
                  target={target}
                  onFlash={() => {}}
                  onTest={() => {}}
                />
              ))}
            </div>
          )}

          <div className="mt-8 rounded-xl border border-[var(--line)] bg-[var(--panel)] p-5">
            <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--green)]">
              Supported Hardware
            </p>
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
              {[
                {
                  type: "cwlite",
                  name: "ChipWhisperer-Lite",
                  desc: "All-in-one capture + target board with STM32F303",
                },
                {
                  type: "cw308",
                  name: "ChipWhisperer Nano",
                  desc: "Compact capture device with USB-C and OLED",
                },
                {
                  type: "cw310",
                  name: "ChipWhisperer Pro",
                  desc: "Professional FPGA-based capture with DDR3 memory",
                },
              ].map((hw) => (
                <div
                  key={hw.type}
                  className="rounded-lg border border-[var(--line)] bg-[#111915] p-4"
                >
                  <span className="block text-[13px] font-medium text-[var(--ink)]">
                    {hw.name}
                  </span>
                  <span className="mt-1 block text-[10px] text-[var(--muted)] leading-relaxed">
                    {hw.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
