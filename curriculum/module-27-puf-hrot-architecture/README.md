# Module 27: PUF-based Hardware Root of Trust Architecture (基於 PUF 的硬體信任根架構)

## Learning Objectives
- Describe the hardware components of a PUF-based HRoT (PUF macro, helper-data/ECC controller, crypto accelerators, secure key bus)
- Walk through the PUF-driven secure boot sequence and chain-of-trust handover
- Explain silicon lifecycle management: enrollment, secure OTA, end-of-life key revocation
- Identify side-channel and fault-injection countermeasures used inside an HRoT
- Explain HRoT-to-TEE key derivation and isolation

## Estimated Time
1.5–2 hours

## Prerequisites
- Module 04 (PUF & TRNG)
- Module 05 (Secure Boot & Authentication)

## Module Structure
| File | Description |
|------|--------------|
| `theory.md` | HRoT architecture, secure boot sequence, lifecycle management, attack resistance, TEE integration |
| `whui-page.tsx` | Interactive secure-boot stepper with tamper/fault-injection toggles |

## Key Topics
1. PUF macro, helper-data/ECC controller, crypto accelerators, secure key routing
2. PUF-driven secure boot & chain-of-trust handover
3. Hardware security boundary vs. Rich OS
4. Silicon lifecycle management (enrollment, OTA, revocation)
5. Side-channel/fault-injection resistance (masking, hiding, glitch detectors, zeroization)
6. HRoT-to-TEE integration

## References
- NIST SP 800-193 — *Platform Firmware Resiliency Guidelines*.
- Arm PSA — *PSA Certified Root of Trust Security Requirements*.
- TCG — *DICE Specification*.
- FIPS 140-3 — *Security Requirements for Cryptographic Modules*.

**Further Reading (Beginner):** [Beginner Hardware Security Resources / 晶片安全入門教材與資源](../resources/hardware-security-beginner-resources.md)
