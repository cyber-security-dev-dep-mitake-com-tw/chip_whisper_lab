"use client";

// Module 34: CAVP and Security Objectives
// Interactive client component: run a simulated Known-Answer-Test (KAT)
// against a "hardware" AES-like engine implementation, with a toggle to
// inject a one-bit implementation bug and see CAVP validation fail.

import { useState } from "react";

interface ModuleProps {
  moduleId: string;
  title: string;
}

const KNOWN_ANSWER = "3AD77BB40D7A3660A89ECAF32466EF97"; // reference KAT ciphertext (illustrative)

function simulateEngineOutput(buggy: boolean): string {
  if (!buggy) return KNOWN_ANSWER;
  // Flip one hex nibble to simulate a one-bit-class implementation defect.
  return KNOWN_ANSWER.slice(0, -1) + (KNOWN_ANSWER.endsWith("7") ? "6" : "7");
}

const OBJECTIVES = [
  { name: "Confidentiality", ok: true, hw: "Memory isolation, secure bus, anti-probe circuits" },
  { name: "Integrity", ok: true, hw: "SHA engine + ECDSA/RSA signature verification" },
  { name: "Authentication & Non-repudiation", ok: true, hw: "HRoT device private key + attestation" },
  { name: "Availability & Resiliency", ok: true, hw: "Watchdog timers, lockstep, zeroization on FI" },
];

export default function ModulePage({
  moduleId = "module-34-cavp",
  title = "CAVP and Security Objectives",
}: ModuleProps) {
  const [iterations, setIterations] = useState(1);
  const [buggy, setBuggy] = useState(false);
  const [ran, setRan] = useState(false);

  const output = simulateEngineOutput(buggy);
  const passed = output === KNOWN_ANSWER;

  function runKat() {
    setRan(true);
  }

  return (
    <div className="module-container" style={{ fontFamily: "monospace", maxWidth: 760 }}>
      <header className="module-header">
        <h1>{moduleId}: {title}</h1>
        <p style={{ opacity: 0.7 }}>
          Run a simulated Known-Answer-Test (KAT) against a hardware crypto
          engine. Toggle a one-bit implementation defect to see CAVP
          validation fail.
        </p>
      </header>

      <section style={{ marginTop: 16 }}>
        <label>
          Monte Carlo iterations: <strong>{iterations.toLocaleString()}</strong>
        </label>
        <input
          type="range"
          min={1}
          max={1000000}
          step={1000}
          value={iterations}
          onChange={(e) => setIterations(Number(e.target.value))}
          style={{ width: "100%" }}
        />

        <label style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12 }}>
          <input type="checkbox" checked={buggy} onChange={(e) => { setBuggy(e.target.checked); setRan(false); }} />
          Inject implementation defect into hardware engine
        </label>

        <button
          onClick={runKat}
          style={{ marginTop: 12, padding: "8px 16px", borderRadius: 6, border: "1px solid currentColor", cursor: "pointer" }}
        >
          Run KAT + Monte Carlo Test
        </button>
      </section>

      {ran && (
        <section
          style={{
            marginTop: 16,
            padding: 12,
            border: `1px solid ${passed ? "#3f7547" : "#e08a8a"}`,
            borderRadius: 8,
            background: "#111915",
          }}
        >
          <p style={{ margin: 0 }}>Known answer: <code>{KNOWN_ANSWER}</code></p>
          <p style={{ margin: 0 }}>Engine output: <code style={{ color: passed ? "#b2ff9f" : "#e08a8a" }}>{output}</code></p>
          <p style={{ margin: 0 }}>Iterations verified stable: <strong>{iterations.toLocaleString()}</strong></p>
          <p style={{ marginTop: 8, marginBottom: 0, color: passed ? "#b2ff9f" : "#e08a8a" }}>
            {passed
              ? "CAVP VALIDATION PASSED — output matches known answer exactly."
              : "CAVP VALIDATION FAILED — a single bit of difference disqualifies the implementation."}
          </p>
        </section>
      )}

      <section style={{ marginTop: 24 }}>
        <p style={{ color: "#b2ff9f" }}>Security Objectives (all require CAVP-validated primitives):</p>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <tbody>
            {OBJECTIVES.map((o) => (
              <tr key={o.name} style={{ borderTop: "1px solid #2a3a30" }}>
                <td style={{ padding: 6 }}>{o.name}</td>
                <td style={{ padding: 6, opacity: 0.8 }}>{o.hw}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
