"use client";

import Link from "next/link";

const MODULES = [
  { id: "module-00-setup", title: "Environment Setup", category: "Setup", difficulty: "Beginner", duration: "1 hour" },
  { id: "module-01-chipsec-landscape", title: "Chip Security Landscape", category: "Theory", difficulty: "Beginner", duration: "2 hours" },
  { id: "module-02-symmetric-hash", title: "Symmetric Crypto & Hash Functions", category: "Cryptography", difficulty: "Beginner", duration: "3 hours" },
  { id: "module-03-asymmetric-pqc", title: "Asymmetric & PQC", category: "Cryptography", difficulty: "Intermediate", duration: "3 hours" },
  { id: "module-04-puf-trng", title: "PUF & TRNG", category: "Hardware Trust", difficulty: "Intermediate", duration: "3 hours" },
  { id: "module-05-secure-boot", title: "Secure Boot & Authentication", category: "Boot Security", difficulty: "Intermediate", duration: "3 hours" },
  { id: "module-06-sca-theory", title: "SCA Theory (SPA/DPA/CPA)", category: "Side-Channel", difficulty: "Intermediate", duration: "4 hours" },
  { id: "module-07-cw-lite-lab01", title: "CW-Lite Platform & Lab 01", category: "Lab", difficulty: "Intermediate", duration: "4 hours" },
  { id: "module-08-aes-dpa-cpa", title: "AES DPA/CPA Deep Dive", category: "Lab", difficulty: "Advanced", duration: "4 hours" },
  { id: "module-09-cpa-aes-lab02", title: "CPA on AES Lab 02", category: "Lab", difficulty: "Advanced", duration: "4 hours" },
  { id: "module-10-countermeasures", title: "SCA Countermeasures", category: "Defense", difficulty: "Advanced", duration: "3 hours" },
  { id: "module-11-fault-glitching", title: "Voltage & Clock Glitching", category: "Fault Injection", difficulty: "Intermediate", duration: "4 hours" },
  { id: "module-12-emfi-lfi", title: "EMFI & Laser Fault Injection", category: "Fault Injection", difficulty: "Advanced", duration: "3 hours" },
  { id: "module-13-fault-analysis", title: "Fault Analysis & Defenses (DFA)", category: "Fault Injection", difficulty: "Advanced", duration: "4 hours" },
  { id: "module-14-jtag-swd", title: "JTAG/SWD Attacks & RDP Bypass", category: "Hardware RE", difficulty: "Intermediate", duration: "4 hours" },
  { id: "module-15-hw-reverse", title: "Hardware RE (Decap, FIB, Active Shield)", category: "Hardware RE", difficulty: "Advanced", duration: "3 hours" },
  { id: "module-16-hw-trojans", title: "Hardware Trojans & Supply Chain", category: "Supply Chain", difficulty: "Advanced", duration: "3 hours" },
  { id: "module-17-tee-microarch", title: "TEE & Microarchitecture Security", category: "TEE", difficulty: "Advanced", duration: "4 hours" },
  { id: "module-18-cache-sc", title: "Cache Side-Channel Attacks", category: "Microarch", difficulty: "Advanced", duration: "4 hours" },
  { id: "module-19-transient-exec", title: "Transient Execution (Spectre, Meltdown)", category: "Microarch", difficulty: "Advanced", duration: "3 hours" },
  { id: "module-20-pqc-hw", title: "PQC Hardware Acceleration + SCA/FIA", category: "PQC", difficulty: "Advanced", duration: "4 hours" },
  { id: "module-21-qkd", title: "QKD Device Security", category: "Quantum", difficulty: "Advanced", duration: "2 hours" },
  { id: "module-22-qpuf", title: "Quantum PUF (IBM Quantum)", category: "Quantum", difficulty: "Advanced", duration: "3 hours" },
  { id: "module-23-cryo-cmos", title: "Cryo-CMOS & QPU Security", category: "Quantum", difficulty: "Advanced", duration: "2 hours" },
  { id: "module-24-bqc-tee", title: "Blind Quantum Computing + TEE", category: "Quantum", difficulty: "Advanced", duration: "2 hours" },
];

export default function LearnPage() {
  return (
    <main className="p-6">
      <div className="flex items-start justify-between mb-2">
        <h1 className="text-3xl font-bold text-white">Curriculum</h1>
        <Link
          href="/learn/resources"
          className="text-xs border border-gray-600 rounded px-3 py-1.5 text-gray-300 hover:border-gray-400 hover:text-white transition-colors"
        >
          📚 Beginner Resources (EN/中文)
        </Link>
      </div>
      <p className="text-gray-400 mb-6">25 modules covering all aspects of hardware security</p>

      <div className="mb-6 flex gap-4">
        <select className="bg-gray-800 text-gray-200 border border-gray-600 rounded p-2">
          <option value="">All Categories</option>
          <option value="Theory">Theory</option>
          <option value="Lab">Lab</option>
          <option value="Fault Injection">Fault Injection</option>
          <option value="Hardware RE">Hardware RE</option>
          <option value="Supply Chain">Supply Chain</option>
          <option value="TEE">TEE</option>
          <option value="Microarch">Microarchitecture</option>
          <option value="PQC">PQC</option>
          <option value="Quantum">Quantum</option>
          <option value="Cryptography">Cryptography</option>
          <option value="Defense">Defense</option>
          <option value="Boot Security">Boot Security</option>
          <option value="Hardware Trust">Hardware Trust</option>
          <option value="Setup">Setup</option>
        </select>
        <select className="bg-gray-800 text-gray-200 border border-gray-600 rounded p-2">
          <option value="">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MODULES.map(mod => (
          <Link key={mod.id} href={`/learn/${mod.id}`} className="block border border-gray-700 rounded-lg p-4 bg-gray-900 hover:border-gray-500 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">{mod.category}</span>
              <span className="text-xs text-gray-400">{mod.difficulty}</span>
            </div>
            <h3 className="font-semibold text-white mb-1">{mod.title}</h3>
            <p className="text-xs text-gray-500">{mod.duration}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}