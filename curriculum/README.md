# ChipWhisper Security Curriculum

## Overview

This curriculum covers 25 modules on hardware security, side-channel analysis, fault injection, and post-quantum cryptography. Each module includes theoretical background, simulated labs, and practical exercises using the ChipWhisper platform.

## Module List

| Module | Title | Topics | Time Estimate | Prerequisites |
|--------|-------|--------|---------------|---------------|
| 00 | Environment Setup | ChipWhisperer installation, Python environment, toolchain setup | 2 hours | None |
| 01 | Chip Security Landscape | FIPS 140-3, CMVP, attack taxonomy, security certification | 3 hours | Module 00 |
| 02 | Symmetric Crypto & Hash | AES, SHA-2/3, symmetric primitives, hash functions | 4 hours | Module 00 |
| 03 | Asymmetric & PQC | RSA, ECC, Kyber, Dilithium, post-quantum cryptography | 4 hours | Module 02 |
| 04 | PUF & TRNG | RO-PUF, Arbiter PUF, Ring Oscillator TRNG, entropy sources | 3 hours | Module 00 |
| 05 | Secure Boot | Measured boot, secure boot chains, attack cases | 3 hours | Module 02 |
| 06 | SCA Theory | SPA, DPA, CPA math, side-channel analysis fundamentals | 5 hours | Module 02 |
| 07 | CW-Lite Platform Lab | Scope setup, target configuration, signal capture | 4 hours | Module 06 |
| 08 | AES DPA/CPA Deep Dive | Key recovery, trace alignment, advanced attacks | 5 hours | Module 07 |
| 09 | CPA on AES Lab | Full CPA attack execution, result interpretation | 5 hours | Module 08 |
| 10 | SCA Countermeasures | Masking, hiding, shuffling, threshold implementations | 4 hours | Module 09 |
| 11 | Fault Injection - V/C | Voltage glitching, clock glitching, parameter manipulation | 4 hours | Module 06 |
| 12 | Fault Injection - EM/LFI | EM fault injection, laser fault injection theory | 3 hours | Module 11 |
| 13 | Fault Analysis | DFA models, lockstep defenses, fault attack countermeasures | 4 hours | Module 12 |
| 14 | JTAG/SWD Attacks | JTAG/SWD interfaces, RDP bypass, debug port exploitation | 4 hours | Module 00 |
| 15 | Hardware Reverse Eng | Decapsulation, FIB, active shield bypass, chip analysis | 5 hours | Module 00 |
| 16 | Hardware Trojans | Trust-Hub, detection methods, counterfeit ICs | 3 hours | Module 15 |
| 17 | TEE & Microarch | TrustZone, SGX, PMP, microarchitectural security | 4 hours | Module 02 |
| 18 | Cache Side-Channel | Flush+Reload, Prime+Probe, cache timing attacks | 5 hours | Module 06 |
| 19 | Transient Execution | Spectre, Meltdown, Rowhammer, transient attacks | 5 hours | Module 18 |
| 20 | PQC Hardware | PQC acceleration, SCA/FIA on PQC implementations | 5 hours | Module 03, Module 09 |
| 21 | QKD Device Security | SPAD blinding, timing side-channels, quantum key distribution | 4 hours | Module 03 |
| 22 | Quantum PUF | IBM Quantum integration, Qiskit, quantum PUF implementations | 4 hours | Module 04, Module 21 |
| 23 | Cryo-CMOS & QPU | Cryogenic electronics, QPU security, quantum computing hardware | 3 hours | Module 22 |
| 24 | BQC + TEE | Blind quantum computing, TEE integration, quantum-resistant systems | 4 hours | Module 17, Module 22 |

## Getting Started

1. Start with Module 00 to set up your environment
2. Follow the module sequence for optimal learning
3. Complete both theory and lab sections for each module
4. Use the simulated notebooks for practice before hands-on labs

## Requirements

- Python 3.8+
- ChipWhisperer hardware (for hands-on labs)
- Jupyter Notebook/Lab
- Node.js 18+ (for UI components)

## License

This curriculum is part of the ChipWhisper Security project.