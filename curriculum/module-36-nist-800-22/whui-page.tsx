"use client";

// Module 36: NIST SP 800-22 Randomness Tests
// Interactive client component: type/generate a bit sequence and see LIVE
// computed Monobit (Frequency) test and Runs test statistics + P-values,
// computed in plain JS (no libraries).

import { useMemo, useState } from "react";

interface ModuleProps {
  moduleId: string;
  title: string;
}

// Complementary error function approximation (Abramowitz & Stegun 7.1.26),
// sufficient precision for this illustrative test-statistic display.
function erfc(x: number): number {
  const z = Math.abs(x);
  const t = 1 / (1 + 0.5 * z);
  const tau =
    t *
    Math.exp(
      -z * z -
        1.26551223 +
        t *
          (1.00002368 +
            t *
              (0.37409196 +
                t *
                  (0.09678418 +
                    t *
                      (-0.18628806 +
                        t *
                          (0.27886807 +
                            t *
                              (-1.13520398 +
                                t *
                                  (1.48851587 +
                                    t * (-0.82215223 + t * 0.17087277))))))))
    );
  return x >= 0 ? tau : 2 - tau;
}

function monobitTest(bits: number[]) {
  const n = bits.length;
  if (n === 0) return { sObs: 0, pValue: 0 };
  const sum = bits.reduce((acc, b) => acc + (b === 1 ? 1 : -1), 0);
  const sObs = Math.abs(sum) / Math.sqrt(n);
  const pValue = erfc(sObs / Math.SQRT2);
  return { sObs, pValue };
}

function runsTest(bits: number[]) {
  const n = bits.length;
  if (n === 0) return { pi: 0, vObs: 0, pValue: 0, preTestFailed: true };
  const ones = bits.reduce((a, b) => a + b, 0);
  const pi = ones / n;
  if (Math.abs(pi - 0.5) >= 2 / Math.sqrt(n)) {
    return { pi, vObs: 0, pValue: 0, preTestFailed: true };
  }
  let vObs = 1;
  for (let i = 1; i < n; i++) {
    if (bits[i] !== bits[i - 1]) vObs++;
  }
  const num = Math.abs(vObs - 2 * n * pi * (1 - pi));
  const den = 2 * Math.sqrt(2 * n) * pi * (1 - pi);
  const pValue = den === 0 ? 0 : erfc(num / den);
  return { pi, vObs, pValue, preTestFailed: false };
}

function parseBits(input: string): number[] {
  return input
    .split("")
    .filter((c) => c === "0" || c === "1")
    .map((c) => Number(c));
}

function generate(n: number, biasP1: number): number[] {
  const bits: number[] = [];
  for (let i = 0; i < n; i++) bits.push(Math.random() < biasP1 ? 1 : 0);
  return bits;
}

export default function ModulePage({
  moduleId = "module-36-nist-800-22",
  title = "NIST SP 800-22 Randomness Tests",
}: ModuleProps) {
  const [input, setInput] = useState(() => generate(256, 0.5).join(""));

  const bits = useMemo(() => parseBits(input), [input]);
  const monobit = useMemo(() => monobitTest(bits), [bits]);
  const runs = useMemo(() => runsTest(bits), [bits]);

  const ALPHA = 0.01;
  const monobitPass = monobit.pValue >= ALPHA;
  const runsPass = !runs.preTestFailed && runs.pValue >= ALPHA;

  return (
    <div className="module-container" style={{ fontFamily: "monospace", maxWidth: 780 }}>
      <header className="module-header">
        <h1>{moduleId}: {title}</h1>
        <p style={{ opacity: 0.7 }}>
          Paste/generate a 0/1 bit sequence and watch the Monobit (Frequency)
          Test and Runs Test statistics recompute live, per NIST SP 800-22.
        </p>
      </header>

      <section style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          onClick={() => setInput(generate(256, 0.5).join(""))}
          style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid currentColor", cursor: "pointer" }}
        >
          Generate random (p=0.5)
        </button>
        <button
          onClick={() => setInput(generate(256, 0.7).join(""))}
          style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid #e0a54c", color: "#e0a54c", cursor: "pointer" }}
        >
          Generate biased (p(1)=0.7)
        </button>
        <button
          onClick={() => setInput("0".repeat(256))}
          style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid #e08a8a", color: "#e08a8a", cursor: "pointer" }}
        >
          Generate stuck-at-0
        </button>
      </section>

      <section style={{ marginTop: 12 }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={5}
          style={{
            width: "100%",
            fontFamily: "monospace",
            fontSize: 12,
            background: "#111915",
            color: "#b2ff9f",
            border: "1px solid #2a3a30",
            borderRadius: 8,
            padding: 8,
            wordBreak: "break-all",
          }}
          placeholder="Paste a 0/1 bit string here..."
        />
        <p style={{ fontSize: 12, opacity: 0.7 }}>n = {bits.length} bits (non-0/1 characters ignored)</p>
      </section>

      <section
        style={{
          marginTop: 16,
          padding: 12,
          border: `1px solid ${monobitPass ? "#3f7547" : "#e08a8a"}`,
          borderRadius: 8,
          background: "#111915",
        }}
      >
        <p style={{ marginTop: 0, color: "#b2ff9f" }}>1. Frequency (Monobit) Test</p>
        <p style={{ margin: 0 }}>s_obs = {monobit.sObs.toFixed(4)}</p>
        <p style={{ margin: 0 }}>P-value = {monobit.pValue.toFixed(6)}</p>
        <p style={{ marginTop: 6, marginBottom: 0, color: monobitPass ? "#b2ff9f" : "#e08a8a" }}>
          {monobitPass ? "PASS" : "FAIL"} (threshold P-value ≥ {ALPHA})
        </p>
      </section>

      <section
        style={{
          marginTop: 16,
          padding: 12,
          border: `1px solid ${runsPass ? "#3f7547" : "#e08a8a"}`,
          borderRadius: 8,
          background: "#111915",
        }}
      >
        <p style={{ marginTop: 0, color: "#b2ff9f" }}>3. Runs Test</p>
        <p style={{ margin: 0 }}>π (proportion of 1s) = {runs.pi.toFixed(4)}</p>
        {runs.preTestFailed ? (
          <p style={{ margin: 0, color: "#e08a8a" }}>
            Pre-test failed: |π - 0.5| too large — sequence is unbalanced enough that the runs test is not meaningful (frequency test already fails).
          </p>
        ) : (
          <>
            <p style={{ margin: 0 }}>V_n (observed runs) = {runs.vObs}</p>
            <p style={{ margin: 0 }}>P-value = {runs.pValue.toFixed(6)}</p>
          </>
        )}
        <p style={{ marginTop: 6, marginBottom: 0, color: runsPass ? "#b2ff9f" : "#e08a8a" }}>
          {runsPass ? "PASS" : "FAIL"} (threshold P-value ≥ {ALPHA})
        </p>
      </section>
    </div>
  );
}
