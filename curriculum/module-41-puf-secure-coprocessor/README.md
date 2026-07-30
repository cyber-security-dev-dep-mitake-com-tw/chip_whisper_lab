# Module 41: PUF-based Secure Co-processor (基於 PUF 的安全協同處理器架構與整合)

## Learning Objectives
- Explain the evolution from crypto accelerator to autonomous secure co-processor
- Describe the co-processor's architecture: PUF/fuzzy-extractor key-gen region, Key Management Unit (KMU), Crypto Cluster, Mailbox/IPC
- Walk through the host-to-co-processor request/response flow: mailbox write, PUF read, key derivation, crypto operation, mailbox result
- Explain keyless storage-at-rest, PUF-gated secure boot, and zero-touch cloud provisioning
- Identify active anti-tamper countermeasures: environmental sensing/zeroization, SCA-resistant PUF readout

## Estimated Time
1.5-2 hours

## Prerequisites
- Module 04 (PUF & TRNG)
- Module 27 (PUF-based HRoT Architecture)
- Module 30 (Key Generation with PUF Solutions)

## Module Structure
| File | Description |
|------|--------------|
| `theory.md` | Secure co-processor architecture, keyless storage, boot control, provisioning, request/response flow, anti-tamper defenses |
| `whui-page.tsx` | Interactive host ↔ secure co-processor request/response flow showing key derivation and attestation steps |

## Key Topics
1. Crypto accelerator vs. autonomous secure co-processor
2. PUF macro + fuzzy extractor, Key Management Unit, Crypto Cluster, Mailbox/IPC
3. Keyless storage at rest and runtime KDF-based key derivation (NIST SP 800-108)
4. PUF-gated absolute control of secure boot
5. Zero-touch cloud provisioning (PUF-derived key pair + X.509)
6. Host/co-processor mailbox request-response flow and attestation token generation
7. Environmental sensing/zeroization and SCA-resistant PUF readout

## References
- Fletcher, C. W., et al. (2012). *A PUF-based Secure Processor Architecture*. Proceedings of the IEEE.
- FIPS 140-3 — *Security Requirements for Cryptographic Modules*. NIST.
- GlobalPlatform — *TEE Hardware Security Root Specification*.
- NIST SP 800-108 — *Recommendation for Key Derivation Using Pseudorandom Functions*.

**Further Reading (Beginner):** [Beginner Hardware Security Resources / 晶片安全入門教材與資源](../resources/hardware-security-beginner-resources.md)
