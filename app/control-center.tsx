"use client";

import { useMemo, useState } from "react";

type NavKey = "workbench" | "install" | "capture" | "analysis" | "experiments";

const navigation: { key: NavKey; label: string; glyph: string }[] = [
  { key: "workbench", label: "Workbench", glyph: "⌁" },
  { key: "install", label: "Setup & doctor", glyph: "↓" },
  { key: "capture", label: "Capture", glyph: "∿" },
  { key: "analysis", label: "Analysis", glyph: "⌗" },
  { key: "experiments", label: "Experiments", glyph: "▤" },
];

const setupChecks = [
  { label: "Apple Silicon", detail: "arm64 · native", state: "ready" },
  { label: "Homebrew", detail: "/opt/homebrew", state: "ready" },
  { label: "libusb", detail: "Not installed", state: "missing" },
  { label: "Python lab", detail: "3.12 requested", state: "missing" },
  { label: "ChipWhisperer", detail: "Not installed", state: "missing" },
  { label: "ARM toolchain", detail: "Not installed", state: "optional" },
];

const trace = [
  14, 17, 13, 19, 16, 22, 15, 18, 21, 16, 27, 12, 31, 20, 15, 25, 18, 23,
  39, 18, 15, 32, 21, 16, 28, 13, 44, 19, 24, 16, 33, 22, 17, 29, 14, 37,
  20, 25, 16, 31, 19, 23, 15, 27, 18, 21, 16, 24,
];

export function ControlCenter() {
  const [active, setActive] = useState<NavKey>("workbench");
  const [simulation, setSimulation] = useState(true);
  const [installing, setInstalling] = useState(false);
  const [samples, setSamples] = useState(5000);
  const [gain, setGain] = useState(22);

  const readiness = useMemo(
    () => setupChecks.filter((item) => item.state === "ready").length,
    [],
  );

  function startSafeInstall() {
    setInstalling(true);
    window.setTimeout(() => setInstalling(false), 1700);
  }

  return (
    <main className="lab-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            CW
          </div>
          <div>
            <strong>WhisperLab</strong>
            <span>local control plane</span>
          </div>
        </div>

        <nav aria-label="Primary navigation">
          {navigation.map((item) => (
            <button
              className={active === item.key ? "nav-item active" : "nav-item"}
              key={item.key}
              onClick={() => setActive(item.key)}
              type="button"
            >
              <span aria-hidden="true">{item.glyph}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-spacer" />
        <div className="local-lock">
          <span className="status-dot safe" />
          <div>
            <strong>Local only</strong>
            <span>127.0.0.1 · no cloud USB</span>
          </div>
        </div>
        <p className="build-id">PREVIEW · SIMULATOR MODE</p>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">APPLE SILICON LAB</p>
            <h1>{navigation.find((item) => item.key === active)?.label}</h1>
          </div>
          <div className="top-actions">
            <label className="mode-switch">
              <span>Simulator</span>
              <input
                checked={simulation}
                onChange={(event) => setSimulation(event.target.checked)}
                type="checkbox"
              />
              <span className="switch-track" aria-hidden="true">
                <span />
              </span>
            </label>
            <button className="device-button" type="button">
              <span className={simulation ? "status-dot safe" : "status-dot"} />
              {simulation ? "Demo device" : "Scan USB"}
            </button>
          </div>
        </header>

        <div className="content-grid">
          <section className="hero-panel">
            <div>
              <p className="kicker">FIRST-RUN READINESS</p>
              <h2>
                Your Mac is ready.
                <br />
                The lab stack is not—yet.
              </h2>
              <p className="hero-copy">
                A native-arm64 setup is planned. Nothing will modify Homebrew,
                your shell, or connected hardware until you review the actions.
              </p>
            </div>
            <div className="readiness-ring" aria-label={`${readiness} of 6 checks ready`}>
              <div>
                <strong>{readiness}/6</strong>
                <span>checks ready</span>
              </div>
            </div>
          </section>

          <section className="card setup-card">
            <div className="card-heading">
              <div>
                <p className="kicker">SYSTEM DOCTOR</p>
                <h3>Native stack</h3>
              </div>
              <button
                className="quiet-button"
                onClick={() => setActive("install")}
                type="button"
              >
                View report →
              </button>
            </div>
            <div className="check-list">
              {setupChecks.map((check) => (
                <div className="check-row" key={check.label}>
                  <span className={`check-icon ${check.state}`}>
                    {check.state === "ready" ? "✓" : check.state === "optional" ? "·" : "!"}
                  </span>
                  <strong>{check.label}</strong>
                  <span>{check.detail}</span>
                </div>
              ))}
            </div>
            <button
              className="primary-button"
              disabled={installing}
              onClick={startSafeInstall}
              type="button"
            >
              {installing ? "Preparing dry-run report…" : "Preview safe install"}
            </button>
          </section>

          <section className="card trace-card">
            <div className="card-heading">
              <div>
                <p className="kicker">LIVE PREVIEW</p>
                <h3>Power trace</h3>
              </div>
              <span className="demo-pill">SIMULATED</span>
            </div>
            <div className="trace-plot" aria-label="Simulated power trace">
              <div className="axis-label axis-y">ADC</div>
              <div className="trace-bars">
                {trace.map((value, index) => (
                  <span
                    key={`${index}-${value}`}
                    style={{ height: `${value * 1.7}%` }}
                  />
                ))}
              </div>
              <div className="axis-label axis-x">5,000 samples · 7.37 MHz</div>
            </div>
            <div className="metric-row">
              <div>
                <span>Peak</span>
                <strong>0.247</strong>
              </div>
              <div>
                <span>Trigger</span>
                <strong>1,842</strong>
              </div>
              <div>
                <span>Noise</span>
                <strong>18.3 mV</strong>
              </div>
            </div>
          </section>

          <section className="card control-card">
            <div className="card-heading">
              <div>
                <p className="kicker">CAPTURE PROFILE</p>
                <h3>SimpleSerial AES</h3>
              </div>
              <span className="unsaved">NOT APPLIED</span>
            </div>
            <label className="range-field">
              <span>
                Samples <strong>{samples.toLocaleString()}</strong>
              </span>
              <input
                max="20000"
                min="1000"
                onChange={(event) => setSamples(Number(event.target.value))}
                step="500"
                type="range"
                value={samples}
              />
            </label>
            <label className="range-field">
              <span>
                Gain <strong>{gain} dB</strong>
              </span>
              <input
                max="56"
                min="0"
                onChange={(event) => setGain(Number(event.target.value))}
                type="range"
                value={gain}
              />
            </label>
            <div className="select-row">
              <label>
                Clock
                <select defaultValue="7.37 MHz">
                  <option>7.37 MHz</option>
                  <option>10 MHz</option>
                  <option>20 MHz</option>
                </select>
              </label>
              <label>
                Trigger
                <select defaultValue="rising edge">
                  <option>rising edge</option>
                  <option>falling edge</option>
                </select>
              </label>
            </div>
            <button className="capture-button" type="button">
              <span>●</span> Capture one trace
            </button>
            <p className="safety-note">
              Simulator data only. Hardware controls remain locked until setup
              and device confirmation pass.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
