"use client";

// Module 35: NIST SP 800-131A - Algorithm and Key Transitions
// Interactive client component: pick an algorithm + key length and see the
// computed security strength (bits) and whether it is allowed / disallowed
// / legacy-only under NIST SP 800-131A.

import { useState } from "react";

interface ModuleProps {
  moduleId: string;
  title: string;
}

type AlgKey = { label: string; strength: number };

const SYMMETRIC: AlgKey[] = [
  { label: "2TDEA", strength: 80 },
  { label: "3TDEA", strength: 112 },
  { label: "AES-128", strength: 128 },
  { label: "AES-192", strength: 192 },
  { label: "AES-256", strength: 256 },
];

const ASYMMETRIC: AlgKey[] = [
  { label: "RSA-1024", strength: 80 },
  { label: "RSA-2048", strength: 112 },
  { label: "RSA-3072", strength: 128 },
  { label: "RSA-4096", strength: 152 },
  { label: "ECC P-256", strength: 128 },
];

const HASH: AlgKey[] = [
  { label: "SHA-1", strength: 80 },
  { label: "SHA-256", strength: 128 },
  { label: "SHA-384", strength: 192 },
  { label: "SHA-512", strength: 256 },
];

function statusFor(strength: number) {
  if (strength < 112) return { text: "DISALLOWED", color: "#e08a8a" };
  if (strength < 128) return { text: "LEGACY ONLY (decrypt existing data)", color: "#e0a54c" };
  return { text: "APPROVED for new designs", color: "#b2ff9f" };
}

function Picker({ title, options, value, onChange }: { title: string; options: AlgKey[]; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <p style={{ marginBottom: 4, opacity: 0.8 }}>{title}</p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ background: "#111915", color: "inherit", border: "1px solid #2a3a30", borderRadius: 6, padding: "4px 8px" }}
      >
        {options.map((o) => (
          <option key={o.label} value={o.label}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

export default function ModulePage({
  moduleId = "module-35-nist-800-131a",
  title = "NIST SP 800-131A - Algorithm and Key Transitions",
}: ModuleProps) {
  const [sym, setSym] = useState("AES-128");
  const [asym, setAsym] = useState("RSA-2048");
  const [hash, setHash] = useState("SHA-256");

  const symStrength = SYMMETRIC.find((a) => a.label === sym)!.strength;
  const asymStrength = ASYMMETRIC.find((a) => a.label === asym)!.strength;
  const hashStrength = HASH.find((a) => a.label === hash)!.strength;

  const overall = Math.min(symStrength, asymStrength, hashStrength);
  const overallStatus = statusFor(overall);

  return (
    <div className="module-container" style={{ fontFamily: "monospace", maxWidth: 760 }}>
      <header className="module-header">
        <h1>{moduleId}: {title}</h1>
        <p style={{ opacity: 0.7 }}>
          Build a hardware crypto stack from a symmetric cipher, an
          asymmetric/public-key algorithm, and a hash function. The weakest
          link determines the overall security strength.
        </p>
      </header>

      <section style={{ marginTop: 16 }}>
        <Picker title="Symmetric algorithm" options={SYMMETRIC} value={sym} onChange={setSym} />
        <Picker title="Asymmetric / public-key algorithm" options={ASYMMETRIC} value={asym} onChange={setAsym} />
        <Picker title="Hash function" options={HASH} value={hash} onChange={setHash} />
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
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <tbody>
            <tr>
              <td style={{ padding: 4 }}>{sym}</td>
              <td style={{ padding: 4 }}>{symStrength}-bit</td>
              <td style={{ padding: 4, color: statusFor(symStrength).color }}>{statusFor(symStrength).text}</td>
            </tr>
            <tr>
              <td style={{ padding: 4 }}>{asym}</td>
              <td style={{ padding: 4 }}>{asymStrength}-bit</td>
              <td style={{ padding: 4, color: statusFor(asymStrength).color }}>{statusFor(asymStrength).text}</td>
            </tr>
            <tr>
              <td style={{ padding: 4 }}>{hash}</td>
              <td style={{ padding: 4 }}>{hashStrength}-bit</td>
              <td style={{ padding: 4, color: statusFor(hashStrength).color }}>{statusFor(hashStrength).text}</td>
            </tr>
          </tbody>
        </table>

        <p style={{ marginTop: 12, marginBottom: 0, color: overallStatus.color }}>
          Overall stack security strength: <strong>{overall}-bit</strong> — {overallStatus.text}
          <br />
          <span style={{ fontSize: 12, opacity: 0.8 }}>
            (min(symmetric, asymmetric, hash) — the weakest primitive bounds the whole system)
          </span>
        </p>
      </section>
    </div>
  );
}
