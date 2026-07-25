"use client";

import type { Target } from "@/lib/types";

const statusStyles: Record<Target["status"], { dot: string; label: string }> = {
  connected: { dot: "bg-[var(--green-strong)] shadow-[0_0_0_3px_rgba(108,243,91,0.1)]", label: "Connected" },
  disconnected: { dot: "bg-[var(--red)] shadow-[0_0_0_3px_rgba(255,114,104,0.1)]", label: "Disconnected" },
  flash_needed: { dot: "bg-[var(--amber)] shadow-[0_0_0_3px_rgba(255,204,102,0.1)]", label: "Flash needed" },
};

const typeIcons: Record<Target["type"], string> = {
  cwlite: "⬡",
  cw308: "⬡",
  cw310: "⬡",
  simulator: "◎",
};

export function TargetCard({
  target,
  onFlash,
  onTest,
}: {
  target: Target;
  onFlash?: () => void;
  onTest?: () => void;
}) {
  const status = statusStyles[target.status];

  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-5 transition hover:border-[#3a5245]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--line)] bg-[#111915] text-[18px] text-[var(--muted)]">
            {typeIcons[target.type]}
          </span>
          <div>
            <h3 className="text-[14px] font-medium text-[var(--ink)]">
              {target.name}
            </h3>
            <span className="text-[10px] font-mono text-[var(--muted)]">
              {target.type.toUpperCase()} · {target.platform}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${status.dot}`} />
          <span className="text-[10px] font-mono text-[var(--muted)]">
            {status.label}
          </span>
        </div>
      </div>

      <div className="mb-4 space-y-2 rounded-lg border border-[var(--line)] bg-[#111915] p-3">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-[var(--dim)]">Firmware</span>
          <span className="text-[var(--ink)]">{target.firmware}</span>
        </div>
        {target.usb_port && (
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-[var(--dim)]">USB Port</span>
            <span className="text-[var(--ink)] truncate max-w-[180px]">
              {target.usb_port}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-[var(--dim)]">Last seen</span>
          <span className="text-[var(--ink)]">
            {new Date(target.last_seen).toLocaleTimeString()}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onFlash}
          className="flex-1 rounded-lg border border-[var(--line)] bg-transparent px-3 py-2 text-[10px] font-mono text-[var(--muted)] transition hover:border-[#3a5245] hover:text-[var(--ink)]"
        >
          Flash Firmware
        </button>
        <button
          onClick={onTest}
          className="flex-1 rounded-lg bg-[var(--green)] px-3 py-2 text-[10px] font-mono font-semibold text-[#10200f] transition hover:bg-[#b2ff9f]"
        >
          Test Connection
        </button>
      </div>
    </div>
  );
}
