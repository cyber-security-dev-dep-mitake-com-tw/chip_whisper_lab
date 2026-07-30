"use client";

// Module 39: Chip Security Considerations - ARM PSA as an Example
// Interactive client component: explore the PSA-FF SPE/NSPE split and
// Secure Partitions, and compare PSA Certified assurance levels.

import { useState } from "react";

interface ModuleProps {
  moduleId: string;
  title: string;
}

const PARTITIONS = [
  {
    id: "crypto",
    name: "Crypto Service",
    desc: "AES/SHA/RSA/ECC operations. Receives ciphertext/plaintext + key handles via SPM Secure IPC; never exposes raw keys to NSPE.",
  },
  {
    id: "storage",
    name: "Protected Storage Service",
    desc: "Encrypted, integrity-checked storage of secrets (PSA Internal Trusted Storage / Protected Storage APIs).",
  },
  {
    id: "attestation",
    name: "Attestation Service",
    desc: "Produces a signed token describing device identity, boot state, and PSA-RoT measurements for remote verification.",
  },
  {
    id: "boot",
    name: "PSA Root of Trust (PSA-RoT)",
    desc: "The immutable first-execution code + HRoT: verifies and hands off to the next boot stage before any other partition runs.",
  },
];

const LEVELS = [
  {
    level: 1,
    name: "PSA Certified Level 1",
    method: "Self-assessment questionnaire against PSA's baseline security requirements.",
    covers: "Baseline software hygiene, presence of secure boot, debug port lockdown.",
  },
  {
    level: 2,
    name: "PSA Certified Level 2",
    method: "Independent lab evaluation of the PSA-RoT; functional testing plus basic non-invasive analysis.",
    covers: "Software attacks, basic side-channel leakage.",
  },
  {
    level: 3,
    name: "PSA Certified Level 3+",
    method: "In-depth vulnerability analysis and penetration testing, including invasive/semi-invasive physical attacks.",
    covers: "Fault injection, advanced side-channel analysis, hardware tampering.",
  },
];

export default function ModulePage({
  moduleId = "module-39-arm-psa",
  title = "Chip Security Considerations - ARM PSA as an Example",
}: ModuleProps) {
  const [selectedPartition, setSelectedPartition] = useState<string | null>(null);
  const [requestSent, setRequestSent] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(1);

  function sendRequest() {
    setRequestSent(true);
    setTimeout(() => setRequestSent(false), 1200);
  }

  const activePartition = PARTITIONS.find((p) => p.id === selectedPartition);
  const activeLevel = LEVELS.find((l) => l.level === selectedLevel)!;

  return (
    <div className="module-container" style={{ fontFamily: "monospace", maxWidth: 820 }}>
      <header className="module-header">
        <h1>{moduleId}: {title}</h1>
        <p style={{ opacity: 0.7 }}>
          Explore the PSA Firmware Framework's SPE/NSPE split. Click a Secure Partition to
          see what it protects, then try sending a request from the NSPE across the SPM
          boundary. Below, compare PSA Certified assurance levels.
        </p>
      </header>

      <section style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <div
          style={{
            flex: 1,
            border: "1px dashed #5a6a7a",
            borderRadius: 8,
            padding: 12,
          }}
        >
          <h3 style={{ marginTop: 0 }}>NSPE (Non-Secure)</h3>
          <p style={{ fontSize: 12, opacity: 0.8 }}>Rich OS / applications. Assumed to be fully compromised in the threat model.</p>
          <button
            onClick={sendRequest}
            style={{ padding: "6px 12px", border: "1px solid currentColor", borderRadius: 6, cursor: "pointer" }}
          >
            Send crypto request →
          </button>
          {requestSent && (
            <div style={{ marginTop: 8, fontSize: 12, color: "#7ec8ff" }}>
              Request parameters (opcode + handle) sent via Secure IPC...
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", fontSize: 12, opacity: 0.6 }}>
          SPM
          <br />
          boundary
          <br />
          ⇄
        </div>

        <div
          style={{
            flex: 2,
            border: "2px solid #3f7547",
            borderRadius: 8,
            padding: 12,
          }}
        >
          <h3 style={{ marginTop: 0 }}>SPE (Secure Processing Environment)</h3>
          <p style={{ fontSize: 12, opacity: 0.8 }}>
            Managed by the Secure Partition Manager (SPM). Click a partition:
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {PARTITIONS.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPartition(p.id)}
                style={{
                  padding: "6px 10px",
                  borderRadius: 6,
                  cursor: "pointer",
                  border: selectedPartition === p.id ? "2px solid #3f7547" : "1px solid #4a5a50",
                  background: selectedPartition === p.id ? "#1c2922" : "transparent",
                  color: "inherit",
                }}
              >
                {p.name}
              </button>
            ))}
          </div>
          {activePartition && (
            <div style={{ marginTop: 10, padding: 10, border: "1px solid #2a3a30", borderRadius: 6, fontSize: 13 }}>
              <strong>{activePartition.name}</strong>
              <p style={{ margin: "4px 0 0" }}>{activePartition.desc}</p>
              {requestSent && selectedPartition && (
                <p style={{ margin: "6px 0 0", color: "#b2ff9f" }}>
                  ✓ SPM routed the request here — the NSPE never touches this partition's memory or keys directly.
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <h3>PSA Certified Assurance Levels</h3>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          {LEVELS.map((l) => (
            <button
              key={l.level}
              onClick={() => setSelectedLevel(l.level)}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                cursor: "pointer",
                border: selectedLevel === l.level ? "2px solid #3f7547" : "1px solid #4a5a50",
                background: selectedLevel === l.level ? "#1c2922" : "transparent",
                color: "inherit",
              }}
            >
              Level {l.level}
            </button>
          ))}
        </div>
        <div style={{ padding: 12, border: "1px solid #2a3a30", borderRadius: 6, fontSize: 13 }}>
          <strong>{activeLevel.name}</strong>
          <p style={{ margin: "6px 0 0" }}><em>Evaluation method:</em> {activeLevel.method}</p>
          <p style={{ margin: "6px 0 0" }}><em>Covers:</em> {activeLevel.covers}</p>
        </div>
      </section>
    </div>
  );
}
