"use client";

// Module 33: FIPS 140-3 modern framework
// Interactive client component: a timeline slider (2001-2027) showing the
// FIPS 140-2 -> FIPS 140-3 transition state and which standard is required
// for new designs at that point in time.

import { useState } from "react";

interface ModuleProps {
  moduleId: string;
  title: string;
}

function statusForYear(year: number) {
  if (year < 2019) {
    return {
      standard: "FIPS 140-2 only",
      note: "FIPS 140-3 has not been published yet (published 2019).",
      color: "#e0a54c",
    };
  }
  if (year < 2021) {
    return {
      standard: "FIPS 140-2 or FIPS 140-3",
      note: "Both standards accept new certification applications.",
      color: "#b2ff9f",
    };
  }
  if (year < 2027) {
    return {
      standard: "FIPS 140-3 required for new designs",
      note: "CMVP stopped accepting new FIPS 140-2 applications in 2021. Existing FIPS 140-2 certificates remain valid but are being phased to the Historical List.",
      color: "#b2ff9f",
    };
  }
  return {
    standard: "FIPS 140-3 only",
    note: "All FIPS 140-2 certificates have moved to the Historical List (end of 2026).",
    color: "#e08a8a",
  };
}

export default function ModulePage({
  moduleId = "module-33-fips-140-3",
  title = "FIPS 140-3 Modern Framework",
}: ModuleProps) {
  const [year, setYear] = useState(2024);
  const [scaMasking, setScaMasking] = useState(false);

  const status = statusForYear(year);
  const requiresScaEvidence = year >= 2019;
  const passesCert = !requiresScaEvidence || scaMasking;

  return (
    <div className="module-container" style={{ fontFamily: "monospace", maxWidth: 760 }}>
      <header className="module-header">
        <h1>{moduleId}: {title}</h1>
        <p style={{ opacity: 0.7 }}>
          Drag the year slider to see the FIPS 140-2 → FIPS 140-3 transition
          timeline, and check whether a design without SCA masking would pass
          certification at that point.
        </p>
      </header>

      <section style={{ marginTop: 16 }}>
        <label>
          Year: <strong>{year}</strong>
        </label>
        <input
          type="range"
          min={2001}
          max={2027}
          step={1}
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </section>

      <section
        style={{
          marginTop: 16,
          padding: 12,
          border: `1px solid ${status.color}`,
          borderRadius: 8,
          background: "#111915",
        }}
      >
        <p style={{ marginTop: 0, color: status.color }}>
          <strong>{status.standard}</strong>
        </p>
        <p style={{ marginBottom: 0 }}>{status.note}</p>
      </section>

      <section style={{ marginTop: 20 }}>
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="checkbox"
            checked={scaMasking}
            onChange={(e) => setScaMasking(e.target.checked)}
          />
          RTL implements Boolean masking / SCA hiding (SP 800-140F evidence)
        </label>

        <p
          style={{
            marginTop: 12,
            padding: 10,
            borderRadius: 6,
            border: `1px solid ${passesCert ? "#3f7547" : "#e08a8a"}`,
            color: passesCert ? "#b2ff9f" : "#e08a8a",
          }}
        >
          {passesCert
            ? "CERTIFICATION OK: SCA mitigation evidence satisfied (or not yet required at this year)."
            : "CERTIFICATION BLOCKED: FIPS 140-3 (SP 800-140F) requires explicit non-invasive attack mitigation evidence — add masking/hiding to pass."}
        </p>
      </section>
    </div>
  );
}
