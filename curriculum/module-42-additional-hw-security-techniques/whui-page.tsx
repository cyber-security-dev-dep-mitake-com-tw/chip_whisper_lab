"use client";

// Module 42: Advanced Side-Channel Hiding Countermeasures
// Interactive client component: toggle shuffling, clock jitter, and
// dual-rail pre-charge logic to see the simulated effect on power-trace
// alignment and DPA correlation.

import { useMemo, useState } from "react";

interface ModuleProps {
  moduleId: string;
  title: string;
}

// Simple deterministic PRNG so traces are reproducible per toggle state.
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const N_OPS = 4; // 4 sub-operations, e.g. 4 AES byte lookups in this simplified demo
const N_TRACES = 6;
const SAMPLES_PER_OP = 12;

function buildTrace(
  rng: () => number,
  shuffling: boolean,
  jitter: boolean,
  dualRail: boolean,
  keyDependentPeak: number,
) {
  const order = [0, 1, 2, 3];
  if (shuffling) {
    // Fisher-Yates shuffle
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
  }
  const samples: number[] = [];
  for (let opIdx = 0; opIdx < N_OPS; opIdx++) {
    const op = order[opIdx];
    let len = SAMPLES_PER_OP;
    if (jitter) len += Math.floor(rng() * 6) - 3; // jittered width
    for (let s = 0; s < len; s++) {
      let base = 0.15 + rng() * 0.05;
      if (dualRail) {
        // Constant power regardless of processed data
        base = 0.3 + rng() * 0.02;
      } else if (op === keyDependentPeak) {
        // The "leaky" op has a data-dependent power bump
        base += 0.25;
      }
      samples.push(base);
    }
  }
  return samples;
}

export default function ModulePage({
  moduleId = "module-42-additional-hw-security-techniques",
  title = "Advanced Side-Channel Hiding Countermeasures",
}: ModuleProps) {
  const [shuffling, setShuffling] = useState(false);
  const [jitter, setJitter] = useState(false);
  const [dualRail, setDualRail] = useState(false);
  const [seedTick, setSeedTick] = useState(0);

  const traces = useMemo(() => {
    const result: number[][] = [];
    for (let t = 0; t < N_TRACES; t++) {
      const rng = mulberry32(1000 + t * 97 + seedTick * 733);
      result.push(buildTrace(rng, shuffling, jitter, dualRail, 2 /* leaky op index */));
    }
    return result;
  }, [shuffling, jitter, dualRail, seedTick]);

  // Rough "alignment score": how much variance exists in the trace-length
  // profile and peak timing across traces — a crude proxy for how well
  // an attacker could time-align traces for DPA/CPA.
  const correlationEstimate = useMemo(() => {
    const minLen = Math.min(...traces.map((t) => t.length));
    let sumVar = 0;
    for (let i = 0; i < minLen; i++) {
      const col = traces.map((t) => t[i]);
      const mean = col.reduce((a, b) => a + b, 0) / col.length;
      const variance = col.reduce((a, b) => a + (b - mean) ** 2, 0) / col.length;
      sumVar += variance;
    }
    // Base correlation drops as variance (misalignment) rises, and as
    // dual-rail flattens the data-dependent peak.
    const misalignmentPenalty = sumVar * 40;
    const dualRailPenalty = dualRail ? 0.75 : 0;
    let corr = 0.9 - misalignmentPenalty - dualRailPenalty;
    corr = Math.max(0.02, Math.min(0.9, corr));
    return corr;
  }, [traces, dualRail]);

  const width = 600;
  const height = 100;
  const maxLen = Math.max(...traces.map((t) => t.length));

  return (
    <div className="module-container" style={{ fontFamily: "monospace", maxWidth: 820 }}>
      <header className="module-header">
        <h1>{moduleId}: {title}</h1>
        <p style={{ opacity: 0.7 }}>
          Simulated power traces of a 4-sub-operation crypto routine (e.g. 4 AES byte lookups),
          one of which is "leaky" (data-dependent power bump). Toggle countermeasures below and
          watch how trace alignment degrades and the estimated DPA correlation drops.
        </p>
      </header>

      <section style={{ margin: "16px 0", display: "flex", gap: 20, flexWrap: "wrap" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input type="checkbox" checked={shuffling} onChange={(e) => setShuffling(e.target.checked)} />
          Operation shuffling (random op order)
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input type="checkbox" checked={jitter} onChange={(e) => setJitter(e.target.checked)} />
          Random clock jitter (op width varies)
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input type="checkbox" checked={dualRail} onChange={(e) => setDualRail(e.target.checked)} />
          Dual-rail pre-charge logic (constant power)
        </label>
        <button
          onClick={() => setSeedTick((s) => s + 1)}
          style={{ padding: "4px 10px", border: "1px solid currentColor", borderRadius: 6, cursor: "pointer" }}
        >
          Re-run traces
        </button>
      </section>

      <svg viewBox={`0 0 ${width} ${height * N_TRACES + N_TRACES * 6}`} style={{ width: "100%", border: "1px solid #2a3a30", borderRadius: 8 }}>
        {traces.map((trace, ti) => {
          const yOffset = ti * (height + 6);
          const stepX = width / maxLen;
          const points = trace
            .map((v, i) => `${i * stepX},${yOffset + height - v * height}`)
            .join(" ");
          return (
            <g key={ti}>
              <polyline points={points} fill="none" stroke="#7ec8ff" strokeWidth={1.5} />
              <text x={4} y={yOffset + 12} fontSize={9} fill="currentColor" opacity={0.5}>
                trace {ti + 1}
              </text>
            </g>
          );
        })}
      </svg>

      <div style={{ marginTop: 16, padding: 12, border: "1px solid #2a3a30", borderRadius: 6 }}>
        <strong>Estimated DPA correlation coefficient:</strong>{" "}
        <span style={{ color: correlationEstimate > 0.5 ? "#e08a8a" : correlationEstimate > 0.25 ? "#e0c03f" : "#b2ff9f" }}>
          {correlationEstimate.toFixed(2)}
        </span>
        <p style={{ fontSize: 12, opacity: 0.7, margin: "8px 0 0" }}>
          {correlationEstimate > 0.5
            ? "Traces are well-aligned and the leaky operation's power bump is visible at a consistent time offset — an attacker's DPA/CPA would likely succeed with few traces."
            : correlationEstimate > 0.25
              ? "Countermeasures partially smear/misalign the traces — an attacker needs substantially more traces to average out the noise."
              : "Traces are heavily misaligned and/or power is flattened by dual-rail logic — the statistical basis for DPA/CPA is largely destroyed."}
        </p>
      </div>
    </div>
  );
}
