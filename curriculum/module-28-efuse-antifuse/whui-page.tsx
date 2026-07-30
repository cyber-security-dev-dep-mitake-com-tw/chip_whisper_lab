"use client";

// Module 28: eFuse vs. Anti-Fuse Storage
// Interactive client component: toggle between eFuse and Anti-Fuse, "program"
// a bit, and see an animated simplified cross-section plus the resulting
// resistance change.

import { useState } from "react";

interface ModuleProps {
  moduleId: string;
  title: string;
}

type FuseType = "efuse" | "antifuse";

export default function ModulePage({
  moduleId = "module-28-efuse-antifuse",
  title = "eFuse vs. Anti-Fuse Storage",
}: ModuleProps) {
  const [type, setType] = useState<FuseType>("efuse");
  const [programmed, setProgrammed] = useState(false);
  const [programming, setProgramming] = useState(false);

  const resistance =
    type === "efuse"
      ? programmed
        ? "~500 kΩ (link blown)"
        : "~50 Ω (intact link)"
      : programmed
        ? "~800 Ω (filament punched)"
        : "~2 GΩ (intact dielectric)";

  const bit = type === "efuse" ? (programmed ? 1 : 0) : programmed ? 1 : 0;

  function program() {
    if (programmed || programming) return;
    setProgramming(true);
    setTimeout(() => {
      setProgrammed(true);
      setProgramming(false);
    }, 700);
  }

  function reset() {
    setProgrammed(false);
    setProgramming(false);
  }

  return (
    <div className="module-container" style={{ fontFamily: "monospace", maxWidth: 720 }}>
      <header className="module-header">
        <h1>{moduleId}: {title}</h1>
        <p style={{ opacity: 0.7 }}>
          Choose a fuse technology, then apply a program pulse and watch the
          simplified cross-section change state.
        </p>
      </header>

      <section style={{ marginTop: 16, display: "flex", gap: 8 }}>
        {(["efuse", "antifuse"] as FuseType[]).map((t) => (
          <button
            key={t}
            onClick={() => {
              setType(t);
              reset();
            }}
            style={{
              padding: "6px 14px",
              borderRadius: 6,
              border: "1px solid currentColor",
              background: type === t ? "#3f7547" : "transparent",
              color: type === t ? "#fff" : "inherit",
              cursor: "pointer",
            }}
          >
            {t === "efuse" ? "eFuse" : "Anti-Fuse"}
          </button>
        ))}
      </section>

      <section
        style={{
          marginTop: 24,
          height: 160,
          border: "1px solid #2a3a30",
          borderRadius: 8,
          background: "#111915",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {type === "efuse" ? (
          <svg width="300" height="80" viewBox="0 0 300 80">
            <rect x="0" y="35" width="120" height="10" fill="#6b8f76" />
            <rect x="180" y="35" width="120" height="10" fill="#6b8f76" />
            {!programmed ? (
              <rect
                x="120"
                y="30"
                width="60"
                height="20"
                fill={programming ? "#e0a54c" : "#b2ff9f"}
                style={{ transition: "fill 0.3s" }}
              />
            ) : (
              <>
                <rect x="120" y="30" width="18" height="20" fill="#b2ff9f" />
                <rect x="162" y="30" width="18" height="20" fill="#b2ff9f" />
                <text x="140" y="20" fontSize="10" fill="#e08a8a">
                  gap (blown)
                </text>
              </>
            )}
          </svg>
        ) : (
          <svg width="300" height="100" viewBox="0 0 300 100">
            <rect x="60" y="10" width="180" height="15" fill="#6b8f76" />
            <rect
              x="60"
              y="30"
              width="180"
              height="40"
              fill={programmed ? "#1c2922" : programming ? "#e0a54c" : "#2a3a30"}
              style={{ transition: "fill 0.3s" }}
            />
            {programmed && (
              <rect x="146" y="30" width="8" height="40" fill="#b2ff9f" />
            )}
            <rect x="60" y="70" width="180" height="15" fill="#6b8f76" />
            <text x="90" y="95" fontSize="10" fill="#8fa896">
              {programmed ? "conductive filament through oxide" : "intact dielectric"}
            </text>
          </svg>
        )}
      </section>

      <section style={{ marginTop: 16 }}>
        <p>Stored bit: <strong>{bit}</strong></p>
        <p>Resistance: <strong>{resistance}</strong></p>
        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
          <button
            onClick={program}
            disabled={programmed || programming}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: "1px solid currentColor",
              cursor: programmed ? "default" : "pointer",
              opacity: programmed ? 0.5 : 1,
            }}
          >
            {programming ? "Programming…" : "Program (blow / breakdown)"}
          </button>
          <button
            onClick={reset}
            style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid currentColor", cursor: "pointer" }}
          >
            Reset (new unprogrammed cell)
          </button>
        </div>
        <p style={{ fontSize: 12, opacity: 0.7, marginTop: 12 }}>
          {type === "efuse"
            ? "eFuse: electromigration destroys a conductive link — visible as a physical gap under SEM after delayering (weaker reverse-engineering resistance)."
            : "Anti-Fuse: dielectric breakdown creates a conductive filament buried inside an insulator — much harder to see optically (stronger reverse-engineering resistance), same physical mechanism as the Module 25 quantum tunneling PUF."}
        </p>
      </section>
    </div>
  );
}
