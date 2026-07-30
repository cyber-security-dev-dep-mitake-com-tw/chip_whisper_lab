"use client";

// Module 31: Background of Hardware Security
// Interactive client component: explore the IC supply chain stages and
// toggle which stage is "compromised" to see which threat category applies
// and whether Security-by-Design controls at that stage would catch it.

import { useState } from "react";

interface ModuleProps {
  moduleId: string;
  title: string;
}

const STAGES = [
  {
    id: "ip",
    label: "3rd-Party IP Integration",
    threat: "Hardware Trojan (hidden trigger/payload in a licensed IP core)",
    control: "IP-level formal verification + information-flow tracking in EDA tools",
  },
  {
    id: "foundry",
    label: "Outsourced Foundry (Fabless → Fab)",
    threat: "Design theft or malicious logic-gate insertion at mask/GDSII stage",
    control: "Split manufacturing, camouflaged cells, post-silicon Trojan detection",
  },
  {
    id: "osat",
    label: "Outsourced Assembly & Test (OSAT)",
    threat: "Chip substitution, overproduction ('ghost ICs'), test-key leakage",
    control: "PUF-based anti-counterfeiting (Module 26), secure test-key provisioning",
  },
  {
    id: "field",
    label: "Field Deployment",
    threat: "Side-channel analysis (power/EM/timing) or physical reverse engineering",
    control: "Masking/hiding countermeasures, tamper sensors, secure boot",
  },
] as const;

export default function ModulePage({
  moduleId = "module-31-hw-security-background",
  title = "Background of Hardware Security",
}: ModuleProps) {
  const [active, setActive] = useState<string>(STAGES[0].id);
  const [securityByDesign, setSecurityByDesign] = useState(true);

  const stage = STAGES.find((s) => s.id === active)!;

  return (
    <div className="module-container" style={{ fontFamily: "monospace", maxWidth: 780 }}>
      <header className="module-header">
        <h1>{moduleId}: {title}</h1>
        <p style={{ opacity: 0.7 }}>
          Click through the fragmented, globalized IC supply chain to see
          which threat category applies at each stage — and how
          Security-by-Design changes the outcome.
        </p>
      </header>

      <section style={{ marginTop: 16, display: "flex", gap: 4, flexWrap: "wrap" }}>
        {STAGES.map((s, i) => (
          <div key={s.id} style={{ display: "flex", alignItems: "center" }}>
            <button
              onClick={() => setActive(s.id)}
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                border: "1px solid currentColor",
                background: active === s.id ? "#3f7547" : "transparent",
                color: active === s.id ? "#fff" : "inherit",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              {s.label}
            </button>
            {i < STAGES.length - 1 && <span style={{ margin: "0 6px" }}>→</span>}
          </div>
        ))}
      </section>

      <section style={{ marginTop: 20 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <input
            type="checkbox"
            checked={securityByDesign}
            onChange={(e) => setSecurityByDesign(e.target.checked)}
          />
          Security-by-Design controls active (PPAS threat modeling from spec stage)
        </label>

        <div style={{ padding: 16, border: "1px solid #2a3a30", borderRadius: 8, background: "#111915" }}>
          <p style={{ fontWeight: "bold" }}>{stage.label}</p>
          <p style={{ marginTop: 8 }}>
            <strong>Threat:</strong> {stage.threat}
          </p>
          <p style={{ marginTop: 8, color: securityByDesign ? "#3f7547" : "#b23434" }}>
            {securityByDesign
              ? `✅ Mitigated: ${stage.control}`
              : "❌ Unmitigated — without Security-by-Design, this threat is caught (if ever) only after tape-out, when fixing it requires a costly re-spin (theory.md §4)."}
          </p>
        </div>
      </section>
    </div>
  );
}
