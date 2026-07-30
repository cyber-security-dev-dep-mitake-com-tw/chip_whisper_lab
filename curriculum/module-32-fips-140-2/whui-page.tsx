"use client";

// Module 32: FIPS 140-2 Overview
// Interactive client component: pick a security level (1-4) and see the
// required hardware defenses accumulate, plus a simulated "attack" that
// tests whether the current level would detect/respond to it.

import { useState } from "react";

interface ModuleProps {
  moduleId: string;
  title: string;
}

type Level = 1 | 2 | 3 | 4;
type Attack = "none" | "physical-probe" | "voltage-glitch";

const LEVEL_REQUIREMENTS: Record<Level, string[]> = {
  1: ["NIST-approved algorithms only (AES, SHA-256, ...)"],
  2: ["+ Tamper-evident seals / coatings", "+ Role-based authentication"],
  3: [
    "+ Tamper-RESISTANT active intrusion detection",
    "+ Zeroization on physical intrusion (<ms)",
    "+ Identity-based authentication",
    "+ Physically isolated key I/O ports",
  ],
  4: [
    "+ Environmental Failure Protection (EFP)",
    "+ Voltage/temperature glitch sensors",
    "+ Auto lockdown outside safe operating envelope",
  ],
};

export default function ModulePage({
  moduleId = "module-32-fips-140-2",
  title = "FIPS 140-2 Overview",
}: ModuleProps) {
  const [level, setLevel] = useState<Level>(1);
  const [attack, setAttack] = useState<Attack>("none");

  const requirements = ([1, 2, 3, 4] as Level[])
    .filter((l) => l <= level)
    .flatMap((l) => LEVEL_REQUIREMENTS[l]);

  function evaluate(): { detected: boolean; note: string } {
    if (attack === "none") return { detected: true, note: "No attack simulated." };
    if (attack === "physical-probe") {
      return level >= 3
        ? { detected: true, note: "Tamper-resistant circuitry detects the probe and triggers zeroization within milliseconds." }
        : { detected: false, note: "Level 1/2 only requires tamper-EVIDENT protection — the probe succeeds; evidence is left, but the key is not zeroized in time." };
    }
    // voltage-glitch
    return level >= 4
      ? { detected: true, note: "Environmental Failure Protection senses the out-of-range voltage and locks the module before logic corrupts." }
      : { detected: false, note: "Without EFP (Level < 4), the voltage glitch can flip internal logic and bypass a security check undetected." };
  }

  const result = evaluate();

  return (
    <div className="module-container" style={{ fontFamily: "monospace", maxWidth: 760 }}>
      <header className="module-header">
        <h1>{moduleId}: {title}</h1>
        <p style={{ opacity: 0.7 }}>
          Slide the FIPS 140-2 security level, then simulate an attack to see
          whether the module's required defenses would catch it.
        </p>
      </header>

      <section style={{ marginTop: 16 }}>
        <label>
          Security Level: <strong>{level}</strong>
        </label>
        <input
          type="range"
          min={1}
          max={4}
          step={1}
          value={level}
          onChange={(e) => setLevel(Number(e.target.value) as Level)}
          style={{ width: "100%" }}
        />
      </section>

      <section
        style={{
          marginTop: 16,
          padding: 12,
          border: "1px solid #2a3a30",
          borderRadius: 8,
          background: "#111915",
        }}
      >
        <p style={{ marginTop: 0, color: "#b2ff9f" }}>Required defenses at Level {level}:</p>
        <ul style={{ marginBottom: 0 }}>
          {requirements.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: 20 }}>
        <p>Simulate an attack against this module:</p>
        <div style={{ display: "flex", gap: 8 }}>
          {(["none", "physical-probe", "voltage-glitch"] as Attack[]).map((a) => (
            <button
              key={a}
              onClick={() => setAttack(a)}
              style={{
                padding: "6px 14px",
                borderRadius: 6,
                border: "1px solid currentColor",
                background: attack === a ? "#3f7547" : "transparent",
                color: attack === a ? "#fff" : "inherit",
                cursor: "pointer",
              }}
            >
              {a === "none" ? "No attack" : a === "physical-probe" ? "Physical probing" : "Voltage glitch"}
            </button>
          ))}
        </div>

        <p
          style={{
            marginTop: 12,
            padding: 10,
            borderRadius: 6,
            border: `1px solid ${result.detected ? "#3f7547" : "#e08a8a"}`,
            color: result.detected ? "#b2ff9f" : "#e08a8a",
          }}
        >
          {result.detected ? "DEFENDED: " : "BYPASSED: "}
          {result.note}
        </p>
      </section>
    </div>
  );
}
