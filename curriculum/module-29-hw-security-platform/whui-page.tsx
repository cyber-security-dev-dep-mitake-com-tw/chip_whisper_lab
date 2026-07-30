"use client";

// Module 29: Hardware Security Platform
// Interactive client component: simulate a Rich-OS -> Mailbox -> Secure CPU
// round trip, showing that only a computation result ever crosses back,
// never the plaintext key — even when the requester is "compromised".

import { useState } from "react";

interface ModuleProps {
  moduleId: string;
  title: string;
}

type Step = "idle" | "sent" | "processing" | "checked" | "denied" | "done";

export default function ModulePage({
  moduleId = "module-29-hw-security-platform",
  title = "Hardware Security Platform",
}: ModuleProps) {
  const [step, setStep] = useState<Step>("idle");
  const [compromisedOS, setCompromisedOS] = useState(false);
  const [payload, setPayload] = useState("firmware_digest_0x9F21");
  const [hasPermission, setHasPermission] = useState(true);

  function send() {
    setStep("sent");
    setTimeout(() => setStep("processing"), 500);
    setTimeout(() => setStep("checked"), 1100);
    setTimeout(() => {
      setStep(hasPermission ? "done" : "denied");
    }, 1700);
  }

  function reset() {
    setStep("idle");
  }

  const signature = `SIG(${payload.slice(0, 8)}...)_${Math.abs(
    payload.split("").reduce((a, c) => a + c.charCodeAt(0), 0),
  ).toString(16)}`;

  return (
    <div className="module-container" style={{ fontFamily: "monospace", maxWidth: 760 }}>
      <header className="module-header">
        <h1>{moduleId}: {title}</h1>
        <p style={{ opacity: 0.7 }}>
          Send a request through the hardware mailbox. Notice that even a
          &quot;compromised&quot; main OS never receives the plaintext key — only a
          signed result, or a denial if it lacks permission.
        </p>
      </header>

      <section style={{ marginTop: 16 }}>
        <label style={{ display: "block", marginBottom: 8 }}>
          Payload to sign:{" "}
          <input
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            style={{ fontFamily: "monospace", padding: 4, width: 260 }}
          />
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <input
            type="checkbox"
            checked={compromisedOS}
            onChange={(e) => setCompromisedOS(e.target.checked)}
          />
          Main OS has been root-exploited by an attacker
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <input
            type="checkbox"
            checked={hasPermission}
            onChange={(e) => setHasPermission(e.target.checked)}
          />
          Requesting app has permission to use this key
        </label>
      </section>

      <section style={{ display: "flex", gap: 16, marginTop: 20 }}>
        <div
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 8,
            border: "1px solid " + (compromisedOS ? "#6b3434" : "#2a3a30"),
            background: compromisedOS ? "#2a1c1c" : "#111915",
          }}
        >
          <p style={{ fontWeight: "bold" }}>
            Main OS {compromisedOS ? "⚠️ (compromised, root)" : "(normal)"}
          </p>
          <p style={{ fontSize: 12 }}>Sends: cmd=SIGN, data=&quot;{payload}&quot;</p>
          <p style={{ fontSize: 12 }}>
            Receives:{" "}
            {step === "done"
              ? signature
              : step === "denied"
                ? "ACCESS_DENIED"
                : "— waiting —"}
          </p>
          <p style={{ fontSize: 11, opacity: 0.6 }}>
            Plaintext key visible to Main OS: <strong>NEVER</strong>
          </p>
        </div>

        <div
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 8,
            border: "1px solid #2a3a30",
            background:
              step === "processing" || step === "checked" ? "#3f7547" : "#111915",
            color: step === "processing" || step === "checked" ? "#fff" : "inherit",
            transition: "background 0.3s",
          }}
        >
          <p style={{ fontWeight: "bold" }}>Secure Platform (Mailbox + Secure CPU)</p>
          <p style={{ fontSize: 12 }}>
            State:{" "}
            {step === "idle" && "idle"}
            {step === "sent" && "request received via mailbox IRQ"}
            {step === "processing" && "checking ACL permission..."}
            {step === "checked" && (hasPermission ? "permission OK, running crypto op" : "permission DENIED")}
            {(step === "done" || step === "denied") && "result placed in mailbox"}
          </p>
        </div>
      </section>

      <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
        <button
          onClick={send}
          disabled={step !== "idle" && step !== "done" && step !== "denied"}
          style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid currentColor", cursor: "pointer" }}
        >
          Send request through mailbox
        </button>
        <button onClick={reset} style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid currentColor", cursor: "pointer" }}>
          Reset
        </button>
      </div>
    </div>
  );
}
