"use client";

// Module 38: IoT Security Regulation - SB-327 & DCMS Code of Practice
// Interactive client component: a compliance checklist mapping SB-327 and
// DCMS provisions to pass/fail toggle states, with an overall compliance
// score computed live.

import { useMemo, useState } from "react";

interface ModuleProps {
  moduleId: string;
  title: string;
}

type Provision = {
  id: string;
  source: "SB-327" | "DCMS";
  label: string;
  detail: string;
};

const PROVISIONS: Provision[] = [
  {
    id: "unique-credential",
    source: "SB-327",
    label: "Unique preprogrammed password OR forced first-use change",
    detail: "No global default password (e.g. admin/admin) ships on any unit.",
  },
  {
    id: "proportional-security",
    source: "SB-327",
    label: "Reasonable security feature(s) proportionate to data sensitivity",
    detail: "Security controls match the device's function and the sensitivity of data it handles.",
  },
  {
    id: "no-default-password-dcms",
    source: "DCMS",
    label: "No default passwords (unique per device)",
    detail: "Consistent with SB-327 — every device ships with a unique credential.",
  },
  {
    id: "vuln-disclosure",
    source: "DCMS",
    label: "Vulnerability disclosure policy in place",
    detail: "Public contact channel for researchers, with a committed remediation timeline.",
  },
  {
    id: "software-updates",
    source: "DCMS",
    label: "Secure software updates + disclosed minimum support period",
    detail: "Secure OTA update mechanism; minimum guaranteed update period stated on packaging/point of sale.",
  },
  {
    id: "secure-storage",
    source: "DCMS",
    label: "Securely store credentials and security-sensitive data",
    detail: "Hardware-protected non-volatile memory (Anti-Fuse OTP / TrustZone storage) for keys and credentials.",
  },
  {
    id: "software-integrity",
    source: "DCMS",
    label: "Ensure software integrity (Secure Boot / HRoT)",
    detail: "Immutable Boot ROM + hardware SHA/RSA/ECC signature verification at boot.",
  },
  {
    id: "min-attack-surface",
    source: "DCMS",
    label: "Minimise exposed attack surfaces (debug port lockdown)",
    detail: "JTAG/debug ports permanently gated or certificate-gated once the device leaves manufacturing/test.",
  },
];

export default function ModulePage({
  moduleId = "module-38-iot-security-regulation",
  title = "IoT Security Regulation: SB-327 & DCMS Code of Practice",
}: ModuleProps) {
  const [state, setState] = useState<Record<string, boolean>>(
    Object.fromEntries(PROVISIONS.map((p) => [p.id, false]))
  );

  const passedCount = useMemo(() => Object.values(state).filter(Boolean).length, [state]);
  const score = Math.round((passedCount / PROVISIONS.length) * 100);

  const sb327Count = PROVISIONS.filter((p) => p.source === "SB-327").length;
  const sb327Passed = PROVISIONS.filter((p) => p.source === "SB-327" && state[p.id]).length;
  const dcmsCount = PROVISIONS.filter((p) => p.source === "DCMS").length;
  const dcmsPassed = PROVISIONS.filter((p) => p.source === "DCMS" && state[p.id]).length;

  const color = score === 100 ? "#b2ff9f" : score >= 50 ? "#e0a54c" : "#e08a8a";

  function toggle(id: string) {
    setState((s) => ({ ...s, [id]: !s[id] }));
  }

  return (
    <div className="module-container" style={{ fontFamily: "monospace", maxWidth: 800 }}>
      <header className="module-header">
        <h1>{moduleId}: {title}</h1>
        <p style={{ opacity: 0.7 }}>
          Toggle each provision on/off to simulate a device's compliance
          posture against California SB-327 and the UK DCMS Code of Practice,
          and watch the overall compliance score update live.
        </p>
      </header>

      <section style={{ marginTop: 16 }}>
        {PROVISIONS.map((p) => (
          <label
            key={p.id}
            style={{
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
              padding: "8px 10px",
              marginBottom: 6,
              border: "1px solid #2a3a30",
              borderRadius: 6,
              background: state[p.id] ? "rgba(63,117,71,0.15)" : "#111915",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={state[p.id]}
              onChange={() => toggle(p.id)}
              style={{ marginTop: 3 }}
            />
            <span>
              <span
                style={{
                  fontSize: 11,
                  padding: "1px 6px",
                  borderRadius: 4,
                  border: "1px solid currentColor",
                  marginRight: 8,
                  color: p.source === "SB-327" ? "#e0a54c" : "#7fb8e0",
                }}
              >
                {p.source}
              </span>
              <strong>{p.label}</strong>
              <br />
              <span style={{ fontSize: 12, opacity: 0.7 }}>{p.detail}</span>
            </span>
          </label>
        ))}
      </section>

      <section
        style={{
          marginTop: 20,
          padding: 14,
          border: `1px solid ${color}`,
          borderRadius: 8,
          background: "#111915",
        }}
      >
        <p style={{ margin: 0, color }}>
          <strong>Overall compliance score: {score}%</strong> ({passedCount}/{PROVISIONS.length} provisions satisfied)
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
          <div style={{ width: `${score}%`, height: "100%", background: color, transition: "width 0.2s" }} />
        </div>
        <p style={{ marginTop: 10, marginBottom: 0, fontSize: 13 }}>
          SB-327: {sb327Passed}/{sb327Count} provisions &nbsp;|&nbsp; DCMS: {dcmsPassed}/{dcmsCount} provisions
        </p>
        <p style={{ marginTop: 8, marginBottom: 0, fontSize: 12, opacity: 0.75 }}>
          {score === 100
            ? "Fully compliant with both regulatory frameworks — legal market access to California and the UK is clear on these provisions."
            : "Incomplete — devices failing the default-password provisions in particular face the most direct legal exposure under both SB-327 and the UK PSTI Act."}
        </p>
      </section>
    </div>
  );
}
