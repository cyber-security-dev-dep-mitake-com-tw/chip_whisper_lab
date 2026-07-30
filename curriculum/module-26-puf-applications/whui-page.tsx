"use client";

// Module 26: PUF-based Applications
// Interactive client component: pick a PUF application scenario and drive a
// small simulated challenge-response / key-wrap / anti-counterfeit flow.

import { useMemo, useState } from "react";

interface ModuleProps {
  moduleId: string;
  title: string;
}

const SCENARIOS = [
  { id: "keygen", label: "Key Generation (Keyless Storage)" },
  { id: "auth", label: "Device Authentication (Challenge-Response)" },
  { id: "anticounterfeit", label: "IC Anti-Counterfeiting" },
  { id: "keywrap", label: "Firmware Key Wrapping" },
] as const;

type ScenarioId = (typeof SCENARIOS)[number]["id"];

function hashLike(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (Math.imul(31, h) + input.charCodeAt(i)) | 0;
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

export default function ModulePage({
  moduleId = "module-26-puf-applications",
  title = "PUF-based Applications",
}: ModuleProps) {
  const [scenario, setScenario] = useState<ScenarioId>("keygen");
  const [challenge, setChallenge] = useState("C-0001");
  const [chipSerial, setChipSerial] = useState("CHIP-A7F3");
  const [powered, setPowered] = useState(true);

  const derivedResponse = useMemo(
    () => hashLike(chipSerial + "|" + challenge),
    [chipSerial, challenge],
  );

  const registeredDb: Record<string, string> = useMemo(
    () => ({
      "CHIP-A7F3": hashLike("CHIP-A7F3|C-0001"),
      "CHIP-B812": hashLike("CHIP-B812|C-0001"),
    }),
    [],
  );

  const dbMatch = registeredDb[chipSerial] === derivedResponse && challenge === "C-0001";

  return (
    <div className="module-container" style={{ fontFamily: "monospace", maxWidth: 760 }}>
      <header className="module-header">
        <h1>{moduleId}: {title}</h1>
        <p style={{ opacity: 0.7 }}>
          Pick a scenario and manipulate inputs to see how a single PUF
          primitive underlies several different security services.
        </p>
      </header>

      <section style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => setScenario(s.id)}
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              border: "1px solid currentColor",
              background: scenario === s.id ? "#3f7547" : "transparent",
              color: scenario === s.id ? "#fff" : "inherit",
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            {s.label}
          </button>
        ))}
      </section>

      <section style={{ marginTop: 20 }}>
        <label style={{ display: "block", marginBottom: 8 }}>
          Chip serial (simulated PUF seed):{" "}
          <input
            value={chipSerial}
            onChange={(e) => setChipSerial(e.target.value)}
            style={{ fontFamily: "monospace", padding: 4 }}
          />
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <input
            type="checkbox"
            checked={powered}
            onChange={(e) => setPowered(e.target.checked)}
          />
          Chip powered on
        </label>

        {(scenario === "keygen" || scenario === "keywrap") && (
          <div>
            <p>
              PUF response (only exists while powered):{" "}
              <strong>{powered ? derivedResponse : "— (no key present at rest) —"}</strong>
            </p>
            <p style={{ fontSize: 12, opacity: 0.7 }}>
              {scenario === "keygen"
                ? "Gen phase: derive K from R + helper data W. Power off ⇒ K vanishes; nothing to extract from static memory."
                : "This derived key wraps (AES-encrypts) firmware before it is written to external flash. Copying the ciphertext to another chip serial produces a different key and firmware fails to decrypt."}
            </p>
          </div>
        )}

        {scenario === "auth" && (
          <div>
            <label style={{ display: "block", marginBottom: 8 }}>
              Server-issued challenge:{" "}
              <input
                value={challenge}
                onChange={(e) => setChallenge(e.target.value)}
                style={{ fontFamily: "monospace", padding: 4 }}
              />
            </label>
            <p>Device computes R = PUF({challenge}) → <strong>{derivedResponse}</strong></p>
            <p style={{ fontSize: 12, opacity: 0.7 }}>
              Server compares R against its (C,R) database and then retires
              this challenge to prevent replay.
            </p>
          </div>
        )}

        {scenario === "anticounterfeit" && (
          <div>
            <p>
              Chip's live PUF fingerprint: <strong>{derivedResponse}</strong>
            </p>
            <p>
              Factory database lookup for &quot;{chipSerial}&quot;/C-0001:{" "}
              <strong style={{ color: dbMatch ? "#3f7547" : "#b23434" }}>
                {registeredDb[chipSerial]
                  ? dbMatch
                    ? "MATCH — genuine, registered part"
                    : "MISMATCH — possible counterfeit/clone"
                  : "NOT FOUND — unregistered/overproduced chip"}
              </strong>
            </p>
            <p style={{ fontSize: 12, opacity: 0.7 }}>
              Try serial &quot;CHIP-A7F3&quot; or &quot;CHIP-B812&quot; (registered), or any other string
              (unregistered / gray-market chip).
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
