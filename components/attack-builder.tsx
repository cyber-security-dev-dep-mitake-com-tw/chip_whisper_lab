"use client";

import { useState } from "react";
import type { Attack, AttackConfig } from "@/lib/types";

const ATTACK_TYPES: { value: Attack["type"]; label: string; desc: string }[] = [
  { value: "cpa", label: "CPA", desc: "Correlation Power Analysis" },
  { value: "dpa", label: "DPA", desc: "Differential Power Analysis" },
  { value: "sca", label: "SCA", desc: "Simple Power Analysis" },
  { value: "glitch", label: "Glitch", desc: "Voltage Glitching" },
];

const STEPS = ["Type", "Configure", "Review"] as const;

const defaultConfig: AttackConfig = {
  trace_start: 0,
  trace_end: 5000,
  point_start: 0,
  point_end: 1500,
  model: "hamming weight",
  target_operation: "sbox_output",
  rounds: 1,
};

export function AttackBuilder({
  experimentId,
  onLaunch,
}: {
  experimentId: string;
  onLaunch?: (type: Attack["type"], config: AttackConfig) => void;
}) {
  const [step, setStep] = useState(0);
  const [attackType, setAttackType] = useState<Attack["type"]>("cpa");
  const [config, setConfig] = useState<AttackConfig>(defaultConfig);

  function next() {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function prev() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function handleLaunch() {
    onLaunch?.(attackType, config);
  }

  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-5">
      <div className="mb-5">
        <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--green)]">
          Attack Builder
        </p>
        <h3 className="mt-1 text-[15px] font-medium text-[var(--ink)]">
          Configure Attack
        </h3>
      </div>

      <div className="mb-5 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <button
              onClick={() => setStep(i)}
              className={`flex h-7 w-7 items-center justify-center rounded-full border text-[10px] font-mono transition ${
                i === step
                  ? "border-[var(--green)] bg-[#17221d] text-[var(--green)]"
                  : i < step
                    ? "border-[#3f7547] bg-[#1a2920] text-[var(--green)]"
                    : "border-[var(--line)] bg-transparent text-[var(--muted)]"
              }`}
            >
              {i < step ? "✓" : i + 1}
            </button>
            <span
              className={`text-[10px] font-mono ${
                i === step ? "text-[var(--ink)]" : "text-[var(--muted)]"
              }`}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div className="ml-2 h-px w-6 bg-[var(--line)]" />
            )}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="grid grid-cols-2 gap-3">
          {ATTACK_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => setAttackType(type.value)}
              className={`rounded-lg border p-4 text-left transition ${
                attackType === type.value
                  ? "border-[var(--green)] bg-[#17221d]"
                  : "border-[var(--line)] bg-transparent hover:border-[#3a5245]"
              }`}
            >
              <span
                className={`block text-[13px] font-medium ${
                  attackType === type.value
                    ? "text-[var(--green)]"
                    : "text-[var(--ink)]"
                }`}
              >
                {type.label}
              </span>
              <span className="mt-1 block text-[10px] text-[var(--muted)]">
                {type.desc}
              </span>
            </button>
          ))}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1 block text-[9px] font-mono uppercase tracking-wider text-[var(--dim)]">
                Trace Range Start
              </span>
              <input
                type="number"
                value={config.trace_start}
                onChange={(e) =>
                  setConfig({ ...config, trace_start: +e.target.value })
                }
                className="w-full rounded-lg border border-[var(--line)] bg-[#111915] px-3 py-2 text-[13px] font-mono text-[var(--ink)] outline-none focus:border-[var(--green)]"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[9px] font-mono uppercase tracking-wider text-[var(--dim)]">
                Trace Range End
              </span>
              <input
                type="number"
                value={config.trace_end}
                onChange={(e) =>
                  setConfig({ ...config, trace_end: +e.target.value })
                }
                className="w-full rounded-lg border border-[var(--line)] bg-[#111915] px-3 py-2 text-[13px] font-mono text-[var(--ink)] outline-none focus:border-[var(--green)]"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1 block text-[9px] font-mono uppercase tracking-wider text-[var(--dim)]">
                Sample Point Start
              </span>
              <input
                type="number"
                value={config.point_start}
                onChange={(e) =>
                  setConfig({ ...config, point_start: +e.target.value })
                }
                className="w-full rounded-lg border border-[var(--line)] bg-[#111915] px-3 py-2 text-[13px] font-mono text-[var(--ink)] outline-none focus:border-[var(--green)]"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[9px] font-mono uppercase tracking-wider text-[var(--dim)]">
                Sample Point End
              </span>
              <input
                type="number"
                value={config.point_end}
                onChange={(e) =>
                  setConfig({ ...config, point_end: +e.target.value })
                }
                className="w-full rounded-lg border border-[var(--line)] bg-[#111915] px-3 py-2 text-[13px] font-mono text-[var(--ink)] outline-none focus:border-[var(--green)]"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1 block text-[9px] font-mono uppercase tracking-wider text-[var(--dim)]">
                Power Model
              </span>
              <select
                value={config.model}
                onChange={(e) =>
                  setConfig({ ...config, model: e.target.value })
                }
                className="w-full rounded-lg border border-[var(--line)] bg-[#111915] px-3 py-2 text-[13px] font-mono text-[var(--ink)] outline-none focus:border-[var(--green)]"
              >
                <option value="hamming weight">Hamming Weight</option>
                <option value="hamming distance">Hamming Distance</option>
                <option value="identity">Identity</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-[9px] font-mono uppercase tracking-wider text-[var(--dim)]">
                Target Operation
              </span>
              <select
                value={config.target_operation}
                onChange={(e) =>
                  setConfig({ ...config, target_operation: e.target.value })
                }
                className="w-full rounded-lg border border-[var(--line)] bg-[#111915] px-3 py-2 text-[13px] font-mono text-[var(--ink)] outline-none focus:border-[var(--green)]"
              >
                <option value="sbox_output">SBox Output</option>
                <option value="sbox_input">SBox Input</option>
                <option value="key_addition">Key Addition</option>
                <option value="custom">Custom</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-[9px] font-mono uppercase tracking-wider text-[var(--dim)]">
              Rounds
            </span>
            <input
              type="number"
              min="1"
              max="16"
              value={config.rounds}
              onChange={(e) =>
                setConfig({ ...config, rounds: +e.target.value })
              }
              className="w-full rounded-lg border border-[var(--line)] bg-[#111915] px-3 py-2 text-[13px] font-mono text-[var(--ink)] outline-none focus:border-[var(--green)]"
            />
          </label>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <div className="rounded-lg border border-[var(--line)] bg-[#111915] p-4">
            <p className="text-[9px] font-mono uppercase tracking-wider text-[var(--dim)]">
              Attack Type
            </p>
            <p className="mt-1 text-[14px] font-medium text-[var(--ink)]">
              {ATTACK_TYPES.find((t) => t.value === attackType)?.label} -{" "}
              {ATTACK_TYPES.find((t) => t.value === attackType)?.desc}
            </p>
          </div>
          <div className="rounded-lg border border-[var(--line)] bg-[#111915] p-4">
            <p className="text-[9px] font-mono uppercase tracking-wider text-[var(--dim)]">
              Configuration
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-[12px] font-mono">
              <span className="text-[var(--muted)]">
                Traces: {config.trace_start}–{config.trace_end}
              </span>
              <span className="text-[var(--muted)]">
                Points: {config.point_start}–{config.point_end}
              </span>
              <span className="text-[var(--muted)]">Model: {config.model}</span>
              <span className="text-[var(--muted)]">
                Op: {config.target_operation}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-[var(--line)] pt-4">
        <button
          onClick={prev}
          disabled={step === 0}
          className="rounded-lg border border-[var(--line)] bg-transparent px-4 py-2 text-[11px] font-mono text-[var(--muted)] transition hover:border-[#3a5245] hover:text-[var(--ink)] disabled:opacity-40"
        >
          Back
        </button>
        {step < STEPS.length - 1 ? (
          <button
            onClick={next}
            className="rounded-lg bg-[var(--green)] px-4 py-2 text-[11px] font-mono font-semibold text-[#10200f] transition hover:bg-[#b2ff9f]"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleLaunch}
            className="rounded-lg bg-[var(--green)] px-4 py-2 text-[11px] font-mono font-semibold text-[#10200f] transition hover:bg-[#b2ff9f]"
          >
            Launch Attack
          </button>
        )}
      </div>
    </div>
  );
}
