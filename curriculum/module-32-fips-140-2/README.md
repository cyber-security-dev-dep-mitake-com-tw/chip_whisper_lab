# Module 32: FIPS 140-2 Overview

## Learning Objectives
- Explain the purpose and scope of FIPS 140-2 as a cryptographic-module security standard
- Define the Cryptographic Boundary and Critical Security Parameters (CSPs)
- Compare the four FIPS 140-2 security levels and their hardware requirements
- Understand how FIPS 140-2 requirements translate into hardware architecture decisions (Secure MCU, TRNG, SCA resistance)

## Estimated Time
1 hour

## Prerequisites
- Module 01 (Chip Security Landscape)

## Module Structure
| File | Description |
|------|--------------|
| `theory.md` | FIPS 140-2 overview, cryptographic boundary, the four security levels, IC design impact |
| `whui-page.tsx` | Interactive simulation: pick a security level and test it against simulated physical-probe / voltage-glitch attacks |

## Key Topics
1. Cryptographic modules and the cryptographic boundary
2. Security Levels 1-4 and their physical security requirements
3. Zeroization and tamper-resistance/tamper-evidence
4. Environmental Failure Protection (EFP) at Level 4

## References
- NIST FIPS PUB 140-2 — *Security Requirements for Cryptographic Modules*.
- NIST Cryptographic Module Validation Program (CMVP) — *Implementation Guidance for FIPS PUB 140-2 and the Cryptographic Algorithm Validation Program*.

**Further Reading (Beginner):** [Beginner Hardware Security Resources / 晶片安全入門教材與資源](../resources/hardware-security-beginner-resources.md)
