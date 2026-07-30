"use client";

// Module 37: Entropy Source
// Interactive client component: a noise-source simulator with adjustable
// sample count, bias, and a "temperature/correlation" slider (simulating
// frequency-injection-locking style environmental attack), computing live
// min-entropy H_inf = -log2(max probability) from the simulated bit
// distribution over byte-sized outputs.

import { useMemo, useState } from "react";

interface ModuleProps {
  moduleId: string;
  title: string;
}

// Simulate `samples` byte outputs (0-255) from a noisy source with a given
// bias toward one dominant byte value (modeling environmental lock-in) plus
// uniform background noise.
function simulate(samples: number, dominance: number, seed: number): number[] {
  const counts = new Array(256).fill(0);
  // Simple deterministic PRNG (mulberry32) seeded for reproducibility per seed.
  let s = seed >>> 0;
  function rand() {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  const dominantValue = 0x00; // stuck-at pattern under strong lock-in
  for (let i = 0; i < samples; i++) {
    if (rand() < dominance) {
      counts[dominantValue]++;
    } else {
      counts[Math.floor(rand() * 256)]++;
    }
  }
  return counts;
}

function minEntropy(counts: number[], total: number) {
  const pMax = Math.max(...counts) / total;
  const hMin = pMax > 0 ? -Math.log2(pMax) : 8;
  return { pMax, hMin };
}

export default function ModulePage({
  moduleId = "module-37-entropy-source",
  title = "Entropy Source",
}: ModuleProps) {
  const [samples, setSamples] = useState(10000);
  const [tempDrift, setTempDrift] = useState(0); // 0 = normal, 100 = extreme env attack
  const [seed, setSeed] = useState(1);

  // Map temperature/correlation drift (0-100) to a dominance probability
  // (0 = ideal uniform 8-bit entropy, 1 = fully locked / stuck-at).
  const dominance = tempDrift / 100;

  const counts = useMemo(() => simulate(samples, dominance, seed), [samples, dominance, seed]);
  const { pMax, hMin } = useMemo(() => minEntropy(counts, samples), [counts, samples]);

  const idealMax = 8; // bits, for an 8-bit uniform source
  const quality = hMin / idealMax;
  const color = quality > 0.9 ? "#b2ff9f" : quality > 0.5 ? "#e0a54c" : "#e08a8a";

  return (
    <div className="module-container" style={{ fontFamily: "monospace", maxWidth: 780 }}>
      <header className="module-header">
        <h1>{moduleId}: {title}</h1>
        <p style={{ opacity: 0.7 }}>
          Simulate a byte-output noise source and watch the min-entropy
          H∞ = -log2(p_max) recompute live as you adjust the sample count and
          an environmental drift slider (modeling frequency-injection lock-in
          on a ring-oscillator TRNG).
        </p>
      </header>

      <section style={{ marginTop: 16 }}>
        <label>
          Sample count: <strong>{samples.toLocaleString()}</strong>
        </label>
        <input
          type="range"
          min={100}
          max={100000}
          step={100}
          value={samples}
          onChange={(e) => setSamples(Number(e.target.value))}
          style={{ width: "100%" }}
        />

        <label style={{ display: "block", marginTop: 12 }}>
          Environmental drift / attack strength (temperature extreme, EM injection lock-in): <strong>{tempDrift}%</strong>
        </label>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={tempDrift}
          onChange={(e) => setTempDrift(Number(e.target.value))}
          style={{ width: "100%" }}
        />

        <button
          onClick={() => setSeed((s) => s + 1)}
          style={{ marginTop: 12, padding: "6px 14px", borderRadius: 6, border: "1px solid currentColor", cursor: "pointer" }}
        >
          Re-run simulation (new seed)
        </button>
      </section>

      <section
        style={{
          marginTop: 20,
          padding: 12,
          border: `1px solid ${color}`,
          borderRadius: 8,
          background: "#111915",
        }}
      >
        <p style={{ margin: 0 }}>Most frequent byte probability p_max = {pMax.toFixed(5)}</p>
        <p style={{ margin: 0 }}>
          Min-Entropy H∞ = -log2(p_max) = <strong style={{ color }}>{hMin.toFixed(3)} bits/byte</strong>
          <span style={{ opacity: 0.6 }}> (ideal: 8 bits/byte)</span>
        </p>
        <div
          style={{
            marginTop: 8,
            height: 10,
            background: "#2a3a30",
            borderRadius: 6,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${Math.min(100, quality * 100)}%`,
              height: "100%",
              background: color,
              transition: "width 0.2s",
            }}
          />
        </div>
        <p style={{ marginTop: 8, marginBottom: 0, fontSize: 12, opacity: 0.8 }}>
          {tempDrift > 50
            ? "Severe environmental drift/lock-in — the source is trending toward a stuck-at byte value, collapsing min-entropy. A real RTL health test (RCT) would trip here."
            : tempDrift > 15
            ? "Moderate drift detected — min-entropy is reduced but still usable after conditioning."
            : "Source behaving close to ideal — near-uniform byte distribution."}
        </p>
      </section>
    </div>
  );
}
