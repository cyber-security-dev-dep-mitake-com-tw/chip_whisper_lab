"use client";

import { useEffect, useMemo, useState } from "react";

type NavKey = "workbench" | "install" | "capture" | "analysis" | "experiments";

const navigation: { key: NavKey; label: string; glyph: string }[] = [
  { key: "workbench", label: "Workbench", glyph: "⌁" },
  { key: "install", label: "Setup & doctor", glyph: "↓" },
  { key: "capture", label: "Capture", glyph: "∿" },
  { key: "analysis", label: "Analysis", glyph: "⌗" },
  { key: "experiments", label: "Experiments", glyph: "▤" },
];

const hardwareSetupChecks = [
  { label: "Apple Silicon", detail: "arm64 · native", state: "ready" },
  { label: "Homebrew", detail: "/opt/homebrew", state: "ready" },
  { label: "libusb", detail: "Not installed", state: "missing" },
  { label: "Python lab", detail: "3.12 requested", state: "missing" },
  { label: "ChipWhisperer", detail: "Not installed", state: "missing" },
  { label: "ARM toolchain", detail: "Not installed", state: "optional" },
];

const simulatedSetupChecks = [
  { label: "Apple Silicon", detail: "arm64 · native", state: "ready" },
  { label: "Homebrew", detail: "/opt/homebrew", state: "ready" },
  { label: "libusb", detail: "Simulated · no device I/O", state: "ready" },
  { label: "Python lab", detail: "Simulated · 3.12", state: "ready" },
  { label: "ChipWhisperer", detail: "Simulated · demo device", state: "ready" },
  { label: "ARM toolchain", detail: "Not installed", state: "optional" },
];

type ChipProfile = {
  id: string;
  name: string;
  arch: string;
  target: string;
  clock: string;
  protocol: string;
  peak: number;
  trigger: number;
  noise: number;
  samples: number;
  seed: number;
};

const chipProfiles: ChipProfile[] = [
  { id: "xmega128d4", name: "XMEGA128D4", arch: "AVR (8-bit)", target: "CW303", clock: "7.37 MHz", protocol: "SimpleSerial AES", peak: 0.247, trigger: 1842, noise: 18.3, samples: 5000, seed: 11 },
  { id: "atmega328p", name: "ATmega328P", arch: "AVR (8-bit)", target: "CW-Lite Arduino", clock: "16 MHz", protocol: "SimpleSerial AES", peak: 0.312, trigger: 2010, noise: 21.1, samples: 5000, seed: 23 },
  { id: "attiny85", name: "ATtiny85", arch: "AVR (8-bit)", target: "Custom UFO", clock: "8 MHz", protocol: "SimpleSerial XOR", peak: 0.198, trigger: 980, noise: 26.4, samples: 3000, seed: 37 },
  { id: "stm32f303", name: "STM32F303RCT6", arch: "ARM Cortex-M4", target: "CW308T-STM32F3", clock: "24 MHz", protocol: "SimpleSerial AES", peak: 0.156, trigger: 3210, noise: 12.7, samples: 5000, seed: 41 },
  { id: "stm32f415", name: "STM32F415RGT6", arch: "ARM Cortex-M4", target: "CW308T-STM32F4", clock: "24 MHz", protocol: "SimpleSerial RSA", peak: 0.171, trigger: 4055, noise: 14.9, samples: 24000, seed: 53 },
  { id: "stm32l051", name: "STM32L051K8", arch: "ARM Cortex-M0+", target: "CW308T-STM32L0", clock: "16 MHz", protocol: "SimpleSerial AES", peak: 0.134, trigger: 2760, noise: 10.2, samples: 5000, seed: 61 },
  { id: "sam3u", name: "SAM3U1C", arch: "ARM Cortex-M3", target: "CW308T-SAM3U", clock: "12 MHz", protocol: "SimpleSerial AES", peak: 0.189, trigger: 3390, noise: 15.6, samples: 5000, seed: 67 },
  { id: "k82f", name: "MK82FN256", arch: "ARM Cortex-M4F", target: "CW308T-K82F", clock: "24 MHz", protocol: "SimpleSerial ECC", peak: 0.203, trigger: 4890, noise: 16.8, samples: 10000, seed: 71 },
  { id: "nrf52840", name: "nRF52840", arch: "ARM Cortex-M4F", target: "CW308T-NRF52840", clock: "16 MHz", protocol: "SimpleSerial AES + BLE", peak: 0.221, trigger: 3120, noise: 19.5, samples: 5000, seed: 79 },
  { id: "cc2538", name: "CC2538SF53", arch: "ARM Cortex-M3", target: "CW308T-CC2538", clock: "32 MHz", protocol: "SimpleSerial AES", peak: 0.177, trigger: 3630, noise: 13.4, samples: 5000, seed: 83 },
  { id: "rp2040", name: "RP2040", arch: "ARM Cortex-M0+ (dual)", target: "Custom Pico target", clock: "12 MHz", protocol: "SimpleSerial AES", peak: 0.162, trigger: 2980, noise: 11.9, samples: 5000, seed: 89 },
  { id: "esp32", name: "ESP32-WROOM-32", arch: "Xtensa LX6", target: "Custom WiFi target", clock: "40 MHz", protocol: "SimpleSerial AES", peak: 0.288, trigger: 5210, noise: 24.6, samples: 10000, seed: 97 },
  { id: "esp8266", name: "ESP8266EX", arch: "Xtensa LX106", target: "Custom WiFi target", clock: "26 MHz", protocol: "SimpleSerial AES", peak: 0.264, trigger: 4780, noise: 23.1, samples: 8000, seed: 101 },
  { id: "gd32vf103", name: "GD32VF103CBT6", arch: "RISC-V (RV32IMAC)", target: "CW308T-GD32VF103", clock: "8 MHz", protocol: "SimpleSerial AES", peak: 0.145, trigger: 2455, noise: 12.0, samples: 5000, seed: 103 },
  { id: "fe310", name: "SiFive FE310", arch: "RISC-V (RV32IMAC)", target: "HiFive1 target", clock: "16 MHz", protocol: "SimpleSerial AES", peak: 0.151, trigger: 2690, noise: 12.9, samples: 5000, seed: 107 },
  { id: "msp430fr", name: "MSP430FR5969", arch: "MSP430 (16-bit)", target: "CW308T-MSP430FR", clock: "8 MHz", protocol: "SimpleSerial AES", peak: 0.121, trigger: 1690, noise: 9.6, samples: 5000, seed: 109 },
  { id: "pic24fj", name: "PIC24FJ128GA010", arch: "PIC24 (16-bit)", target: "Custom PIC target", clock: "8 MHz", protocol: "SimpleSerial AES", peak: 0.213, trigger: 2245, noise: 17.7, samples: 5000, seed: 113 },
  { id: "pic18f", name: "PIC18F4550", arch: "PIC18 (8-bit)", target: "Custom PIC target", clock: "20 MHz", protocol: "SimpleSerial XOR", peak: 0.229, trigger: 1975, noise: 20.3, samples: 4000, seed: 127 },
  { id: "atmega128rfa1", name: "ATmega128RFA1", arch: "AVR (8-bit) + 802.15.4", target: "Custom Zigbee target", clock: "16 MHz", protocol: "SimpleSerial AES", peak: 0.256, trigger: 2130, noise: 22.0, samples: 5000, seed: 131 },
  { id: "efm32gg", name: "EFM32GG11", arch: "ARM Cortex-M4F", target: "CW308T-EFM32GG11", clock: "24 MHz", protocol: "SimpleSerial AES", peak: 0.168, trigger: 3480, noise: 14.1, samples: 5000, seed: 137 },
];

function makeLcg(seed: number) {
  let state = seed;
  return () => {
    // Deterministic LCG so the same seed always renders the same shape.
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

function generateTrace(chip: ChipProfile, seedOffset = 0, bars = 48): number[] {
  const next = makeLcg(chip.seed + seedOffset);
  const base = chip.peak * 100;
  return Array.from({ length: bars }, () => {
    const jitter = (next() - 0.5) * base * 0.9;
    return Math.max(6, Math.round(base * 0.6 + jitter));
  });
}

function generateCorrelation(seed: number, guesses = 16) {
  const next = makeLcg(seed);
  const winner = Math.floor(next() * guesses);
  return Array.from({ length: guesses }, (_, index) =>
    index === winner ? 0.72 + next() * 0.2 : 0.08 + next() * 0.34,
  );
}

type Capture = {
  id: string;
  chipId: string;
  chipName: string;
  protocol: string;
  target: string;
  samples: number;
  gain: number;
  clock: string;
  peak: number;
  trigger: number;
  noise: number;
  trace: number[];
  capturedAt: number;
};

function hashSeed(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) & 0x7fffffff;
  }
  return hash || 1;
}

export function ControlCenter() {
  // Renders identically on server and first client paint (both false), so it
  // never causes a hydration mismatch. A real click can otherwise land on a
  // server-rendered button in the brief window before React finishes
  // attaching event listeners — the browser accepts the click but nothing
  // happens, since a bare <button> has no default action. This overlay
  // absorbs that first click instead of silently swallowing it on the
  // underlying (not-yet-interactive) control.
  const [booted, setBooted] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setBooted(true), 450);
    return () => window.clearTimeout(timer);
  }, []);

  const [active, setActive] = useState<NavKey>("workbench");
  const [simulation, setSimulation] = useState(true);
  const [installing, setInstalling] = useState(false);
  const [chipId, setChipId] = useState(chipProfiles[0].id);
  const [gain, setGain] = useState(22);
  const [profileApplied, setProfileApplied] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [captureCount, setCaptureCount] = useState(0);
  const [lastCapture, setLastCapture] = useState<Capture | null>(null);
  const [experiments, setExperiments] = useState<Capture[]>([]);
  const [loadedExperiment, setLoadedExperiment] = useState<Capture | null>(null);

  const chip = chipProfiles.find((item) => item.id === chipId) ?? chipProfiles[0];
  const [samples, setSamples] = useState(chip.samples);
  const trace = useMemo(() => generateTrace(chip), [chip]);

  const setupChecks = useMemo(() => {
    if (!simulation) return hardwareSetupChecks;
    return simulatedSetupChecks.map((check) =>
      check.label === "ChipWhisperer"
        ? { ...check, detail: `Simulated · ${chip.name} (${chip.target})` }
        : check,
    );
  }, [simulation, chip]);

  function selectChip(nextId: string) {
    setChipId(nextId);
    const nextChip = chipProfiles.find((item) => item.id === nextId);
    if (nextChip) setSamples(nextChip.samples);
    setProfileApplied(false);
    setLastCapture(null);
  }

  const readiness = useMemo(
    () => setupChecks.filter((item) => item.state === "ready").length,
    [setupChecks],
  );

  function startSafeInstall() {
    setInstalling(true);
    window.setTimeout(() => setInstalling(false), 1700);
  }

  function applyCaptureProfile() {
    setProfileApplied(true);
    setLastCapture(null);
  }

  function captureOneTrace() {
    if (!profileApplied || capturing) return;
    setCapturing(true);
    window.setTimeout(() => {
      const nextCount = captureCount + 1;
      const capture: Capture = {
        id: `cap-${chip.id}-${Date.now()}`,
        chipId: chip.id,
        chipName: chip.name,
        protocol: chip.protocol,
        target: chip.target,
        samples,
        gain,
        clock: chip.clock,
        peak: Number((chip.peak * (1 + (gain - 22) / 400)).toFixed(3)),
        trigger: chip.trigger,
        noise: Number((chip.noise * (1 - (gain - 22) / 500)).toFixed(1)),
        trace: generateTrace(chip, nextCount * 7),
        capturedAt: Date.now(),
      };
      setCaptureCount(nextCount);
      setLastCapture(capture);
      setCapturing(false);
    }, 900);
  }

  function saveExperiment() {
    if (!lastCapture) return;
    setExperiments((prev) =>
      prev.some((item) => item.id === lastCapture.id) ? prev : [lastCapture, ...prev],
    );
  }

  function loadExperiment(capture: Capture) {
    setLoadedExperiment(capture);
    setActive("analysis");
  }

  return (
    <>
      {!booted && (
        <div className="boot-gate" aria-hidden="true">
          <div className="boot-gate-mark">CW</div>
        </div>
      )}
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
            {simulation ? (
              <label className="device-button chip-picker">
                <span className="status-dot safe" />
                <select
                  aria-label="Simulated target chip"
                  onChange={(event) => selectChip(event.target.value)}
                  value={chipId}
                >
                  {chipProfiles.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <button className="device-button" type="button">
                <span className="status-dot" />
                Scan USB
              </button>
            )}
          </div>
        </header>

        <div className="content-grid">
          {(active === "workbench" || active === "install") && (
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
          )}

          {(active === "workbench" || active === "install") && (
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
          )}

          {(active === "workbench" || active === "capture" || active === "analysis") && (
            <section className="card trace-card">
              <div className="card-heading">
                <div>
                  <p className="kicker">
                    {active === "analysis" ? "ANALYSIS" : "LIVE PREVIEW"}
                  </p>
                  <h3>{chip.name} power trace</h3>
                </div>
                <span className="demo-pill">SIMULATED</span>
              </div>
              <div className="trace-plot" aria-label={`Simulated power trace for ${chip.name}`}>
                <div className="axis-label axis-y">ADC</div>
                <div className="trace-bars">
                  {trace.map((value, index) => (
                    <span
                      key={`${index}-${value}`}
                      style={{ height: `${value * 1.7}%` }}
                    />
                  ))}
                </div>
                <div className="axis-label axis-x">
                  {samples.toLocaleString()} samples · {chip.clock}
                </div>
              </div>
              <div className="metric-row">
                <div>
                  <span>Peak</span>
                  <strong>{chip.peak.toFixed(3)}</strong>
                </div>
                <div>
                  <span>Trigger</span>
                  <strong>{chip.trigger.toLocaleString()}</strong>
                </div>
                <div>
                  <span>Noise</span>
                  <strong>{chip.noise.toFixed(1)} mV</strong>
                </div>
              </div>
            </section>
          )}

          {active === "analysis" && (
            <section className="card control-card">
              <div className="card-heading">
                <div>
                  <p className="kicker">LEAKAGE ANALYSIS</p>
                  <h3>Correlation vs. key guess</h3>
                </div>
                <span className={loadedExperiment ? "unsaved applied" : "unsaved"}>
                  {loadedExperiment ? "EXPERIMENT LOADED" : "NO EXPERIMENT LOADED"}
                </span>
              </div>
              {loadedExperiment ? (
                <>
                  <p className="chip-subline">
                    {loadedExperiment.chipName} · {loadedExperiment.protocol} ·{" "}
                    {loadedExperiment.samples.toLocaleString()} samples ·{" "}
                    {new Date(loadedExperiment.capturedAt).toLocaleTimeString()}
                  </p>
                  {(() => {
                    const correlation = generateCorrelation(hashSeed(loadedExperiment.id));
                    const bestIndex = correlation.indexOf(Math.max(...correlation));
                    return (
                      <>
                        <div className="trace-plot correlation-plot" aria-label="Simulated correlation vs. key guess">
                          <div className="axis-label axis-y">ρ</div>
                          <div className="trace-bars correlation-bars">
                            {correlation.map((value, index) => (
                              <span
                                className={index === bestIndex ? "corr-bar best" : "corr-bar"}
                                key={index}
                                style={{ height: `${value * 100}%` }}
                              />
                            ))}
                          </div>
                          <div className="axis-label axis-x">key byte guess (0x00–0x0F)</div>
                        </div>
                        <p className="safety-note">
                          Peak correlation ρ = {correlation[bestIndex].toFixed(3)} at guess
                          0x{bestIndex.toString(16).toUpperCase().padStart(2, "0")} — simulated
                          recovered key byte.
                        </p>
                      </>
                    );
                  })()}
                </>
              ) : (
                <p className="safety-note">
                  Run a capture from the Capture tab, or open a saved experiment
                  from Experiments, to compute CPA/DPA correlation traces here.
                </p>
              )}
            </section>
          )}

          {(active === "workbench" || active === "capture") && (
            <section className="card control-card">
              <div className="card-heading">
                <div>
                  <p className="kicker">CAPTURE PROFILE</p>
                  <h3>{chip.protocol}</h3>
                  <p className="chip-subline">
                    {chip.name} · {chip.arch} · {chip.target}
                  </p>
                </div>
                <div className="profile-status">
                  <span className={profileApplied ? "unsaved applied" : "unsaved"}>
                    {profileApplied ? "APPLIED" : "NOT APPLIED"}
                  </span>
                  <button
                    className="quiet-button"
                    onClick={applyCaptureProfile}
                    type="button"
                  >
                    {profileApplied ? "Re-apply" : "Apply profile"}
                  </button>
                </div>
              </div>
              <label className="range-field">
                <span>
                  Samples <strong>{samples.toLocaleString()}</strong>
                </span>
                <input
                  max="30000"
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
                  <select disabled value={chip.clock}>
                    <option>{chip.clock}</option>
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
              <button
                className="capture-button"
                disabled={!profileApplied || capturing}
                onClick={captureOneTrace}
                title={profileApplied ? undefined : "Apply the capture profile first"}
                type="button"
              >
                <span>●</span>{" "}
                {capturing
                  ? "Capturing…"
                  : profileApplied
                    ? "Capture one trace"
                    : "Apply profile to capture"}
              </button>
              <p className="safety-note">
                Simulator data only. Hardware controls remain locked until setup
                and device confirmation pass.
              </p>
              {lastCapture && (
                <div className="capture-result">
                  <div>
                    <strong>Captured ✓</strong>
                    <span>
                      {lastCapture.chipName} · {lastCapture.samples.toLocaleString()}{" "}
                      samples · {new Date(lastCapture.capturedAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="capture-result-actions">
                    <button
                      className="quiet-button"
                      disabled={experiments.some((item) => item.id === lastCapture.id)}
                      onClick={saveExperiment}
                      type="button"
                    >
                      {experiments.some((item) => item.id === lastCapture.id)
                        ? "Saved ✓"
                        : "Save as experiment"}
                    </button>
                    <button
                      className="quiet-button"
                      onClick={() => loadExperiment(lastCapture)}
                      type="button"
                    >
                      Load into Analysis →
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}

          {active === "experiments" && (
            <section className="card control-card">
              <div className="card-heading">
                <div>
                  <p className="kicker">EXPERIMENTS</p>
                  <h3>Saved captures</h3>
                </div>
                <span className={experiments.length ? "unsaved applied" : "unsaved"}>
                  {experiments.length} SAVED
                </span>
              </div>
              {experiments.length ? (
                <div className="experiment-list">
                  {experiments.map((item) => (
                    <div className="experiment-row" key={item.id}>
                      <div>
                        <strong>{item.chipName}</strong>
                        <span>
                          {item.protocol} · {item.samples.toLocaleString()} samples ·{" "}
                          {new Date(item.capturedAt).toLocaleTimeString()}
                          {loadedExperiment?.id === item.id ? " · loaded" : ""}
                        </span>
                      </div>
                      <button
                        className="quiet-button"
                        onClick={() => loadExperiment(item)}
                        type="button"
                      >
                        {loadedExperiment?.id === item.id
                          ? "Loaded in Analysis ✓"
                          : "Load into Analysis →"}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="safety-note">
                  No experiments saved yet. Capture a trace from the Capture tab
                  and save it to build a comparable experiment history here.
                </p>
              )}
            </section>
          )}
        </div>
      </section>
      </main>
    </>
  );
}
