"use client";

// Module 41: PUF-based Secure Co-processor
// Interactive client component: drive a request/response flow between a
// "host" and the PUF-based secure co-processor, showing key derivation
// and attestation steps, plus a fault-injection zeroization scenario.

import { useState } from "react";

interface ModuleProps {
  moduleId: string;
  title: string;
}

const STEPS = [
  { id: 0, label: "Host writes opcode + context to Mailbox", side: "host" },
  { id: 1, label: "KMU wakes, triggers PUF challenge-response read", side: "coproc" },
  { id: 2, label: "Fuzzy extractor Rep() reconstructs HUK from PUF + helper data", side: "coproc" },
  { id: 3, label: "KDF derives context key: K_ctx = KDF(HUK, label || context)", side: "coproc" },
  { id: 4, label: "Crypto Cluster signs/encrypts using K_ctx over the isolated key bus", side: "coproc" },
  { id: 5, label: "Result (ciphertext / attestation token) written back to Mailbox", side: "coproc" },
  { id: 6, label: "Host reads result — never sees HUK or K_ctx", side: "host" },
];

export default function ModulePage({
  moduleId = "module-41-puf-secure-coprocessor",
  title = "PUF-based Secure Co-processor",
}: ModuleProps) {
  const [step, setStep] = useState(0);
  const [faultAt, setFaultAt] = useState<number | null>(null);
  const [zeroized, setZeroized] = useState(false);
  const [context, setContext] = useState("session-key-2026");

  function advance() {
    if (zeroized) return;
    const next = step + 1;
    if (faultAt !== null && next === faultAt) {
      setZeroized(true);
      return;
    }
    setStep(Math.min(next, STEPS.length - 1));
  }

  function reset() {
    setStep(0);
    setZeroized(false);
  }

  return (
    <div className="module-container" style={{ fontFamily: "monospace", maxWidth: 820 }}>
      <header className="module-header">
        <h1>{moduleId}: {title}</h1>
        <p style={{ opacity: 0.7 }}>
          Step through a request from the host to the PUF-based secure co-processor. Try
          injecting a fault at a chosen step to see the co-processor's active zeroization
          response.
        </p>
      </header>

      <section style={{ margin: "16px 0", display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          Context string:
          <input
            value={context}
            onChange={(e) => setContext(e.target.value)}
            style={{ background: "transparent", border: "1px solid #4a5a50", borderRadius: 4, padding: "2px 6px", color: "inherit" }}
          />
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            type="checkbox"
            checked={faultAt === 2}
            onChange={(e) => {
              setFaultAt(e.target.checked ? 2 : null);
              reset();
            }}
          />
          Inject voltage glitch during PUF/HUK reconstruction (step 3)
        </label>
      </section>

      <div style={{ display: "flex", gap: 16 }}>
        <div style={{ flex: 1, border: "1px dashed #5a6a7a", borderRadius: 8, padding: 12 }}>
          <h3 style={{ marginTop: 0 }}>Host (main CPU)</h3>
          <p style={{ fontSize: 12, opacity: 0.8 }}>
            Can only write opcode/context to the mailbox and read back results. Never touches
            the PUF, HUK, or K_ctx.
          </p>
        </div>
        <div style={{ flex: 2, border: "2px solid #3f7547", borderRadius: 8, padding: 12 }}>
          <h3 style={{ marginTop: 0 }}>Secure Co-processor (KMU + Crypto Cluster)</h3>
          <ol style={{ listStyle: "none", padding: 0 }}>
            {STEPS.map((s, i) => (
              <li
                key={s.id}
                style={{
                  padding: "6px 10px",
                  marginBottom: 4,
                  borderRadius: 6,
                  border: "1px solid #2a3a30",
                  background: i < step ? "#1c2922" : i === step ? "#3f7547" : "transparent",
                  color: i === step ? "#fff" : "inherit",
                  opacity: i > step ? 0.5 : 1,
                  fontSize: 13,
                }}
              >
                {i + 1}. {s.label.replace("context", context)}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {zeroized ? (
        <div style={{ marginTop: 12, padding: 12, border: "1px solid #6b3434", borderRadius: 6, color: "#e08a8a" }}>
          ⚠ FAULT DETECTED at HUK reconstruction. Environmental sensors triggered KMU
          zeroization: PUF power cut, internal SRAM overwritten with random data. No key
          material or attestation result was ever produced.
        </div>
      ) : step === STEPS.length - 1 ? (
        <div style={{ marginTop: 12, padding: 12, border: "1px solid #3f7547", borderRadius: 6, color: "#b2ff9f" }}>
          ✓ Attestation/derivation complete. Host received only the final ciphertext/token —
          K_HUK and K_ctx existed only transiently inside the co-processor's isolated key bus.
        </div>
      ) : (
        <button
          onClick={advance}
          style={{ marginTop: 12, padding: "8px 16px", border: "1px solid currentColor", borderRadius: 6, cursor: "pointer" }}
        >
          Advance step →
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
