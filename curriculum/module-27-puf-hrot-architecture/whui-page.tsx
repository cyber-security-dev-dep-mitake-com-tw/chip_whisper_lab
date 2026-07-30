"use client";

// Module 27: PUF-based Hardware Root of Trust Architecture
// Interactive client component: step through a PUF-driven secure boot
// sequence, injecting faults at chosen stages to see the HRoT's response.

import { useState } from "react";

interface ModuleProps {
  moduleId: string;
  title: string;
}

const STAGES = [
  { id: 0, label: "Reset — HRoT starts first" },
  { id: 1, label: "PUF + ECC generate HUK" },
  { id: 2, label: "Boot ROM loaded & verified" },
  { id: 3, label: "Bootloader signature check (RSA/SHA)" },
  { id: 4, label: "Chain-of-trust handover to main CPU" },
];

export default function ModulePage({
  moduleId = "module-27-puf-hrot-architecture",
  title = "PUF-based Hardware Root of Trust Architecture",
}: ModuleProps) {
  const [stage, setStage] = useState(0);
  const [tamperedBootloader, setTamperedBootloader] = useState(false);
  const [glitchAt, setGlitchAt] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);

  function step() {
    if (locked) return;
    const next = stage + 1;

    // Simulate the verification stage failing if the bootloader signature
    // doesn't match, unless an injected glitch flips the branch outcome.
    if (stage === 2 && next === 3) {
      // entering signature-check stage next tick is fine, check happens at 3->4
    }
    if (stage === 3 && tamperedBootloader && glitchAt !== 3) {
      setLocked(true);
      return;
    }
    setStage(Math.min(next, STAGES.length - 1));
  }

  function reset() {
    setStage(0);
    setLocked(false);
  }

  return (
    <div className="module-container" style={{ fontFamily: "monospace", maxWidth: 760 }}>
      <header className="module-header">
        <h1>{moduleId}: {title}</h1>
        <p style={{ opacity: 0.7 }}>
          Step through PUF-driven secure boot. Tamper with the bootloader and/or
          inject a fault at the signature-check stage to see whether the HRoT's
          redundant-logic state machine catches it.
        </p>
      </header>

      <section style={{ margin: "16px 0", display: "flex", gap: 16 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            type="checkbox"
            checked={tamperedBootloader}
            onChange={(e) => {
              setTamperedBootloader(e.target.checked);
              reset();
            }}
          />
          Attacker tampered with the bootloader image
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            type="checkbox"
            checked={glitchAt === 3}
            onChange={(e) => {
              setGlitchAt(e.target.checked ? 3 : null);
              reset();
            }}
          />
          Inject voltage glitch at signature-check stage
        </label>
      </section>

      <ol style={{ listStyle: "none", padding: 0 }}>
        {STAGES.map((s, i) => (
          <li
            key={s.id}
            style={{
              padding: "8px 12px",
              marginBottom: 6,
              borderRadius: 6,
              border: "1px solid #2a3a30",
              background:
                i < stage
                  ? "#1c2922"
                  : i === stage
                    ? "#3f7547"
                    : "transparent",
              color: i === stage ? "#fff" : "inherit",
              opacity: i > stage ? 0.5 : 1,
            }}
          >
            {i + 1}. {s.label}
          </li>
        ))}
      </ol>

      {locked ? (
        <div style={{ padding: 12, border: "1px solid #6b3434", borderRadius: 6, color: "#e08a8a" }}>
          🔒 SECURE LOCKDOWN: signature mismatch detected (Digest_A ≠ Digest_B).
          HRoT refuses to release CPU reset — system enters secure recovery mode.
        </div>
      ) : stage === STAGES.length - 1 ? (
        <div style={{ padding: 12, border: "1px solid #3f7547", borderRadius: 6, color: "#b2ff9f" }}>
          ✅ Chain of trust established — control handed off to main CPU.
          {tamperedBootloader && glitchAt === 3 && (
            <> (Note: a fault-injection attack bypassed the check this run — this is exactly why real HRoTs add redundant verification logic and glitch detectors, per theory.md §6.)</>
          )}
        </div>
      ) : (
        <button
          onClick={step}
          style={{
            padding: "8px 16px",
            border: "1px solid currentColor",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Advance boot stage →
        </button>
      )}

      <div style={{ marginTop: 12 }}>
        <button onClick={reset} style={{ fontSize: 12, opacity: 0.7, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
          Reset simulation
        </button>
      </div>
    </div>
  );
}
