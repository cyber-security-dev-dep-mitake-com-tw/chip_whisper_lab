"use client";

// Module 40: Chip Software Attacks & Malicious Hardware Attacks
// Interactive client component: click a component in the attack-surface
// diagram to reveal its attack technique and mitigation.

import { useState } from "react";

interface ModuleProps {
  moduleId: string;
  title: string;
}

interface Component {
  id: string;
  label: string;
  x: number;
  y: number;
  category: "software" | "microarch" | "physical";
  attack: string;
  mitigation: string;
}

const COMPONENTS: Component[] = [
  {
    id: "stack",
    label: "Stack / Heap",
    x: 40,
    y: 40,
    category: "software",
    attack: "Buffer overflow overwrites the return address / adjacent variables to redirect execution into shellcode.",
    mitigation: "NX/XN bit marks writable memory non-executable; stack canaries detect overwritten return addresses.",
  },
  {
    id: "gadgets",
    label: "Code Gadgets",
    x: 260,
    y: 40,
    category: "software",
    attack: "ROP/JOP chains existing legitimate code fragments via crafted return addresses to execute malicious logic without injecting code.",
    mitigation: "ARM Pointer Authentication (PAC): a hardware MAC over the return address, keyed and context-bound, is verified on every return.",
  },
  {
    id: "cache",
    label: "Cache / Speculative Exec",
    x: 480,
    y: 40,
    category: "microarch",
    attack: "Spectre/Meltdown lure the CPU into speculatively reading secret memory; a cache-timing side channel (Flush+Reload) recovers the value.",
    mitigation: "Speculative-load fencing, cache partitioning, and microcode/hardware mitigations that block cross-privilege speculative reads.",
  },
  {
    id: "memtag",
    label: "Heap Allocation",
    x: 40,
    y: 180,
    category: "software",
    attack: "Use-after-free / heap corruption from dangling or mismatched pointers.",
    mitigation: "Memory Tagging Extension (MTE): random physical tag per allocation, matching logical tag required on every pointer access.",
  },
  {
    id: "glitch",
    label: "Power / Clock Rail",
    x: 260,
    y: 180,
    category: "physical",
    attack: "Voltage or clock glitching flips a flip-flop's latched value at the exact cycle of a signature check, forcing `if (signature_valid)` to true.",
    mitigation: "Environmental sensors detect out-of-tolerance voltage/frequency and trigger reset + zeroization within microseconds.",
  },
  {
    id: "die",
    label: "Die Surface",
    x: 480,
    y: 180,
    category: "physical",
    attack: "Laser fault injection or micro-probing after decapsulation directly flips register state or sniffs the data bus.",
    mitigation: "Active shield mesh: a top-metal grid carrying random signals; any milling/probing changes electrical characteristics and locks the chip.",
  },
  {
    id: "crypto",
    label: "Crypto Engine",
    x: 260,
    y: 320,
    category: "physical",
    attack: "Differential Fault Analysis (DFA): inject a fault mid-AES/RSA computation, compare faulty vs. correct ciphertext to recover the key.",
    mitigation: "Dual-core lockstep execution / repeated computation with mismatch detection; parity + ECC inside the crypto datapath.",
  },
  {
    id: "supplychain",
    label: "RTL / Foundry Stage",
    x: 480,
    y: 320,
    category: "physical",
    attack: "Hardware Trojan inserted at RTL, synthesis, or mask stage, triggered by a rare condition; payload leaks keys or degrades RNG quality.",
    mitigation: "Golden-model equivalence checking, side-channel Trojan detection, trusted foundry / split-manufacturing supply-chain controls.",
  },
];

const CATEGORY_COLOR: Record<Component["category"], string> = {
  software: "#3f7547",
  microarch: "#7ec8ff",
  physical: "#e0a03f",
};

export default function ModulePage({
  moduleId = "module-40-chip-software-attacks",
  title = "Chip Software Attacks & Malicious Hardware Attacks",
}: ModuleProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const active = COMPONENTS.find((c) => c.id === selected);

  return (
    <div className="module-container" style={{ fontFamily: "monospace", maxWidth: 820 }}>
      <header className="module-header">
        <h1>{moduleId}: {title}</h1>
        <p style={{ opacity: 0.7 }}>
          Click a component in the attack surface below to reveal its attack technique and the
          hardware mitigation that defends against it. Green = pure software attack surface, blue =
          microarchitectural, orange = physical/malicious hardware attack surface.
        </p>
      </header>

      <svg viewBox="0 0 620 380" style={{ width: "100%", maxWidth: 620, border: "1px solid #2a3a30", borderRadius: 8 }}>
        {COMPONENTS.map((c) => (
          <g
            key={c.id}
            onClick={() => setSelected(c.id)}
            style={{ cursor: "pointer" }}
          >
            <rect
              x={c.x}
              y={c.y}
              width={140}
              height={60}
              rx={8}
              fill={selected === c.id ? CATEGORY_COLOR[c.category] : "transparent"}
              stroke={CATEGORY_COLOR[c.category]}
              strokeWidth={2}
            />
            <text
              x={c.x + 70}
              y={c.y + 34}
              textAnchor="middle"
              fontSize={12}
              fill={selected === c.id ? "#fff" : "currentColor"}
            >
              {c.label}
            </text>
          </g>
        ))}
      </svg>

      <div style={{ marginTop: 12, fontSize: 12, opacity: 0.7 }}>
        Legend: <span style={{ color: CATEGORY_COLOR.software }}>■ software</span>{" "}
        <span style={{ color: CATEGORY_COLOR.microarch }}>■ microarchitectural</span>{" "}
        <span style={{ color: CATEGORY_COLOR.physical }}>■ physical/malicious</span>
      </div>

      {active ? (
        <div style={{ marginTop: 16, padding: 12, border: `1px solid ${CATEGORY_COLOR[active.category]}`, borderRadius: 6 }}>
          <strong>{active.label}</strong>
          <p style={{ margin: "8px 0 4px" }}><em>Attack:</em> {active.attack}</p>
          <p style={{ margin: "4px 0 0" }}><em>Mitigation:</em> {active.mitigation}</p>
        </div>
      ) : (
        <div style={{ marginTop: 16, opacity: 0.6, fontSize: 13 }}>
          Click any component above to see its attack technique and mitigation.
        </div>
      )}
    </div>
  );
}
