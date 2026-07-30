"use client";

// Module 25: Quantum Tunneling PUF
// Interactive client component: simulates Fowler-Nordheim tunneling current
// across an oxide with atomic-scale thickness variation, and derives a
// stable PUF response bit from a simulated "oxide breakdown" race.

import { useMemo, useState } from "react";

interface ModuleProps {
  moduleId: string;
  title: string;
}

// Simplified Fowler-Nordheim-style tunneling current model (illustrative, not
// calibrated to real device physics): J ~ exp(-B * Tox / Vox)
function tunnelingCurrent(Tox_nm: number, Vox: number) {
  const B = 22; // illustrative constant
  return Math.exp((-B * Tox_nm) / Math.max(Vox, 0.05)) * 1e6;
}

export default function ModulePage({
  moduleId = "module-25-quantum-tunneling-puf",
  title = "Quantum Tunneling PUF",
}: ModuleProps) {
  const [baseThickness, setBaseThickness] = useState(2.0); // nm
  const [voltage, setVoltage] = useState(4.0); // V stress voltage
  const [seed, setSeed] = useState(1);

  // Two adjacent cells with atomic-scale (±0.3nm) random thickness variation
  const { cellA, cellB, currentA, currentB, responseBit, ratio } =
    useMemo(() => {
      // Deterministic pseudo-random per seed so "re-roll" is reproducible
      let s = seed * 9301 + 49297;
      const rand = () => {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
      };
      const jitterA = (rand() - 0.5) * 0.6; // up to ±0.3nm atomic step
      const jitterB = (rand() - 0.5) * 0.6;
      const tA = Math.max(0.3, baseThickness + jitterA);
      const tB = Math.max(0.3, baseThickness + jitterB);
      const iA = tunnelingCurrent(tA, voltage);
      const iB = tunnelingCurrent(tB, voltage);
      const bit = iA > iB ? 1 : 0;
      return {
        cellA: tA,
        cellB: tB,
        currentA: iA,
        currentB: iB,
        responseBit: bit,
        ratio: Math.max(iA, iB) / Math.max(Math.min(iA, iB), 1e-12),
      };
    }, [baseThickness, voltage, seed]);

  const maxCurrent = Math.max(currentA, currentB, 1e-9);

  return (
    <div className="module-container" style={{ fontFamily: "monospace", maxWidth: 720 }}>
      <header className="module-header">
        <h1>{moduleId}: {title}</h1>
        <p style={{ opacity: 0.7 }}>
          Interactive: drag oxide thickness / stress voltage, then "race" two
          adjacent cells to see which one tunnels-through (breaks down) first
          and becomes the PUF response bit.
        </p>
      </header>

      <section style={{ marginTop: 16 }}>
        <label style={{ display: "block", marginBottom: 8 }}>
          Nominal gate oxide thickness T<sub>ox</sub>: {baseThickness.toFixed(2)} nm
          <input
            type="range"
            min={0.8}
            max={3.5}
            step={0.05}
            value={baseThickness}
            onChange={(e) => setBaseThickness(parseFloat(e.target.value))}
            style={{ width: "100%" }}
          />
        </label>

        <label style={{ display: "block", marginBottom: 8 }}>
          Stress voltage V<sub>ox</sub>: {voltage.toFixed(2)} V
          <input
            type="range"
            min={1}
            max={6}
            step={0.1}
            value={voltage}
            onChange={(e) => setVoltage(parseFloat(e.target.value))}
            style={{ width: "100%" }}
          />
        </label>

        <button
          onClick={() => setSeed((s) => s + 1)}
          style={{
            padding: "8px 16px",
            marginTop: 8,
            cursor: "pointer",
            border: "1px solid currentColor",
            borderRadius: 6,
          }}
        >
          Re-fabricate cells (new atomic-scale variation)
        </button>
      </section>

      <section style={{ marginTop: 24, display: "flex", gap: 24 }}>
        {[
          { label: "Cell A", thickness: cellA, current: currentA, won: responseBit === 1 },
          { label: "Cell B", thickness: cellB, current: currentB, won: responseBit === 0 },
        ].map((cell) => (
          <div key={cell.label} style={{ flex: 1 }}>
            <p>
              {cell.label} — T<sub>ox</sub> = {cell.thickness.toFixed(3)} nm{" "}
              {cell.won ? "🏆 breakdown" : "intact"}
            </p>
            <div
              style={{
                height: 120,
                background: "#1c2922",
                border: "1px solid #2a3a30",
                borderRadius: 6,
                display: "flex",
                alignItems: "flex-end",
                padding: 4,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: `${Math.min(100, (cell.current / maxCurrent) * 100)}%`,
                  background: cell.won ? "#b2ff9f" : "#3f7547",
                  borderRadius: 4,
                  transition: "height 0.3s",
                }}
              />
            </div>
            <p style={{ fontSize: 11, opacity: 0.6 }}>
              I<sub>tunnel</sub> ≈ {cell.current.toExponential(2)} (a.u.)
            </p>
          </div>
        ))}
      </section>

      <section style={{ marginTop: 24 }}>
        <p>
          Response bit = <strong>{responseBit}</strong> (current ratio ≈{" "}
          {ratio > 1e6 ? ratio.toExponential(1) : ratio.toFixed(1)}×)
        </p>
        <p style={{ fontSize: 12, opacity: 0.7 }}>
          Even a ~0.1 nm (sub-atomic-layer scale) difference in oxide
          thickness between the two adjacent cells produces an
          exponentially large tunneling-current gap — which is why, once one
          cell's oxide breaks down, the winner never flips on re-read: this
          is the "zero-ECC" reliability advantage described in theory.md §4.
        </p>
      </section>
    </div>
  );
}
