"use client";

// Module 30: Key Generation with PUF Solutions
// Interactive client component: a small illustrative Gen/Rep fuzzy-extractor
// walkthrough. Injects bit flips into an enrolled PUF response and shows a
// majority-vote (repetition code) error-correction demo recovering the key.

import { useMemo, useState } from "react";

interface ModuleProps {
  moduleId: string;
  title: string;
}

const BLOCK = 5; // repetition-code block size (majority vote over 5 raw bits per key bit)
const KEY_BITS = 8;

function randomBits(n: number, seed: number) {
  let s = seed;
  const bits: number[] = [];
  for (let i = 0; i < n; i++) {
    s = (s * 9301 + 49297) % 233280;
    bits.push(s / 233280 > 0.5 ? 1 : 0);
  }
  return bits;
}

export default function ModulePage({
  moduleId = "module-30-key-gen-puf",
  title = "Key Generation with PUF Solutions",
}: ModuleProps) {
  const [seed] = useState(() => Math.floor(Math.random() * 100000));
  const [ber, setBer] = useState(0.12); // bit error rate 0-0.3
  const [rerollNoise, setRerollNoise] = useState(0);

  // Enrollment: raw PUF response R (BLOCK bits per key bit), helper data W = R itself here (illustrative)
  const enrolledRaw = useMemo(() => randomBits(BLOCK * KEY_BITS, seed), [seed]);
  const enrolledKey = useMemo(() => {
    const key: number[] = [];
    for (let i = 0; i < KEY_BITS; i++) {
      const block = enrolledRaw.slice(i * BLOCK, i * BLOCK + BLOCK);
      const ones = block.reduce((a, b) => a + b, 0);
      key.push(ones > BLOCK / 2 ? 1 : 0);
    }
    return key;
  }, [enrolledRaw]);

  // Reproduction: noisy re-read R'
  const noisyRaw = useMemo(() => {
    let s = seed + 7919 + rerollNoise * 13;
    return enrolledRaw.map((bit) => {
      s = (s * 9301 + 49297) % 233280;
      const flip = s / 233280 < ber;
      return flip ? 1 - bit : bit;
    });
  }, [enrolledRaw, ber, seed, rerollNoise]);

  const reproducedKey = useMemo(() => {
    const key: number[] = [];
    for (let i = 0; i < KEY_BITS; i++) {
      const block = noisyRaw.slice(i * BLOCK, i * BLOCK + BLOCK);
      const ones = block.reduce((a, b) => a + b, 0);
      key.push(ones > BLOCK / 2 ? 1 : 0);
    }
    return key;
  }, [noisyRaw]);

  const rawBer = enrolledRaw.filter((b, i) => b !== noisyRaw[i]).length / enrolledRaw.length;
  const keyMatches = enrolledKey.every((b, i) => b === reproducedKey[i]);

  return (
    <div className="module-container" style={{ fontFamily: "monospace", maxWidth: 780 }}>
      <header className="module-header">
        <h1>{moduleId}: {title}</h1>
        <p style={{ opacity: 0.7 }}>
          Gen phase enrolls a raw PUF response once. Rep phase re-reads a
          noisy response and uses a majority-vote repetition code (a simple
          illustrative stand-in for BCH/Reed-Muller ECC) to recover the exact
          same key.
        </p>
      </header>

      <section style={{ marginTop: 16 }}>
        <label style={{ display: "block", marginBottom: 8 }}>
          Simulated bit error rate (BER): {(ber * 100).toFixed(0)}%
          <input
            type="range"
            min={0}
            max={0.3}
            step={0.01}
            value={ber}
            onChange={(e) => setBer(parseFloat(e.target.value))}
            style={{ width: "100%" }}
          />
        </label>
        <button
          onClick={() => setRerollNoise((n) => n + 1)}
          style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid currentColor", cursor: "pointer" }}
        >
          Re-power device (new noisy read)
        </button>
      </section>

      <section style={{ marginTop: 20 }}>
        <p style={{ fontSize: 12, opacity: 0.7 }}>Enrollment raw response R (helper data W is derived from this):</p>
        <div style={{ display: "flex", gap: 2, flexWrap: "wrap", marginBottom: 12 }}>
          {enrolledRaw.map((b, i) => (
            <span key={i} style={{ width: 18, textAlign: "center", background: "#1c2922", borderRadius: 3 }}>
              {b}
            </span>
          ))}
        </div>

        <p style={{ fontSize: 12, opacity: 0.7 }}>Reproduction noisy response R' (raw BER ≈ {(rawBer * 100).toFixed(1)}%, flips in red):</p>
        <div style={{ display: "flex", gap: 2, flexWrap: "wrap", marginBottom: 12 }}>
          {noisyRaw.map((b, i) => (
            <span
              key={i}
              style={{
                width: 18,
                textAlign: "center",
                background: b !== enrolledRaw[i] ? "#6b3434" : "#1c2922",
                borderRadius: 3,
              }}
            >
              {b}
            </span>
          ))}
        </div>

        <p style={{ fontSize: 12, opacity: 0.7 }}>
          Key bits after majority-vote ECC over blocks of {BLOCK} raw bits:
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <div>
            <p style={{ fontSize: 11, opacity: 0.6 }}>Enrolled key K</p>
            <div style={{ display: "flex", gap: 4 }}>
              {enrolledKey.map((b, i) => (
                <span key={i} style={{ width: 20, textAlign: "center", background: "#3f7547", color: "#fff", borderRadius: 3 }}>
                  {b}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize: 11, opacity: 0.6 }}>Reproduced key K'</p>
            <div style={{ display: "flex", gap: 4 }}>
              {reproducedKey.map((b, i) => (
                <span
                  key={i}
                  style={{
                    width: 20,
                    textAlign: "center",
                    background: b === enrolledKey[i] ? "#3f7547" : "#b23434",
                    color: "#fff",
                    borderRadius: 3,
                  }}
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>

        <p style={{ marginTop: 16, fontWeight: "bold", color: keyMatches ? "#3f7547" : "#b23434" }}>
          {keyMatches
            ? "✅ Key recovered exactly — ECC absorbed the raw bit errors."
            : "❌ Key mismatch — raw BER exceeded this repetition code's correction capacity. Real designs add a second BCH/Reed-Muller stage for this regime."}
        </p>
      </section>
    </div>
  );
}
