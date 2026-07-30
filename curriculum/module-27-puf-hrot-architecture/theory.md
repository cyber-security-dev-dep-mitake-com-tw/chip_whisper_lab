# Module 27: PUF-based Hardware Root of Trust Architecture (基於 PUF 的硬體信任根架構) — Theory

## 1. Concept Evolution: From Security Primitive to System Trust Anchor

Earlier modules treated a PUF as an independent physical entropy source or bit-string generator (a security *primitive*). But a raw PUF alone cannot protect a complex computing system. To become a **Hardware Root of Trust (HRoT)**, a PUF must be deeply integrated with a cryptographic engine, a secure state machine, and a hardware isolation boundary. In this architecture, the PUF acts as an **immutable trust anchor**, providing the lowest-level security guarantee for everything built on top of it.

## 2. HRoT Hardware Architecture Components

A complete PUF-based HRoT subsystem is typically packaged as an independent hardware module inside an SoC:

- **PUF macro**: captures hardware physical variation, provides raw challenge-response characteristics.
- **Helper Data Controller & ECC**: performs fuzzy extraction, converting the noisy PUF output into a $100\%$-stable, high-entropy **Hardware Unique Key (HUK)**.
- **Cryptographic accelerators**: built-in AES (symmetric), SHA (hash), RSA/ECC (asymmetric signature) engines, ensuring all key-using computation happens inside the HRoT without relying on the main CPU.
- **Secure key routing/bus**: a dedicated internal channel physically isolated from the system's main bus (e.g. AXI/AHB). The HUK or derived root keys travel only over this dedicated path directly to the crypto engines — software can never read the plaintext key.

## 3. Core Mechanism: PUF-driven Secure Boot

Power-on is the most vulnerable moment for security. A PUF-based HRoT must complete **Root of Trust for Measurement (RoTM)** before the main processor executes any code from external flash.

Standard secure boot sequence:

1. **Hardware init & key generation**: on reset, the HRoT starts first. The PUF captures its physical characteristics and, via ECC, dynamically generates the HUK in internal volatile registers.
2. **Boot ROM verification**: HRoT loads the immutable first-stage boot code from ROM.
3. **Bootloader measurement & decryption**: HRoT reads the second-stage bootloader from external flash; uses the PUF-derived key (or a sub-key) with the on-chip SHA/RSA engine to verify the bootloader's digital signature and integrity, and decrypts it if encrypted.
4. **Chain-of-trust handover**: only after verification passes does the HRoT release the main CPU's reset signal and hand off control (and next-stage keys) to the main system. On failure, the system is locked or enters secure recovery.

$$
\text{Boot proceeds} \iff \text{Verify}_{K_{HUK}}(\text{Signature}, \text{Digest}(\text{Bootloader})) = \text{true}
$$

## 4. Hardware Security Boundary & Tamper Resistance

The HRoT establishes a strict physical isolation region within the SoC. Its memory map is entirely hidden from the Rich OS (Linux, Android). Even an attacker who gains root via a kernel exploit can only send the HRoT high-level cryptographic *requests* (e.g. "sign this") — never read its internal state machine, PUF control registers, or any plaintext key over software instructions.

## 5. Silicon Lifecycle Management

A PUF-based HRoT spans the chip's entire lifecycle:

- **Enrollment & provisioning**: instead of physical key injection in a trusted cleanroom (a supply-chain weak point), the manufacturer performs one secure "read" — extracting the PUF's helper data and generating a public key; the private key is regenerated on-chip whenever needed.
- **Secure OTA updates**: HRoT verifies new firmware's signature using a PUF-derived update key and decrypts in secure internal memory, preventing downgrade attacks or malicious firmware.
- **End-of-life & key revocation**: since the PUF's physical characteristic can't be erased, the system instead erases the stored helper data or changes the KDF context, so the original PUF output can no longer reconstruct the previous root key — an effective revocation/decommissioning mechanism.

## 6. Advanced Physical Attack Resistance

High-assurance HRoT designs must pass certifications like FIPS 140-3 Level 3/4 or CC EAL 4+:

| Attack | Description | Countermeasure |
|---|---|---|
| Side-channel (SCA) | Power (DPA) / EM (EMA) analysis to infer the key | Masking + hiding: inject randomness to decorrelate power/timing from key data |
| Fault injection (FI) | Laser, voltage glitching, clock glitching to flip a verification branch (e.g. `if (signature_valid)`) | Redundant logic in the state machine + on-chip glitch detectors |
| Active tamper | Physical intrusion detected by sensors | Immediately cut PUF power / reset helper-data registers — key vanishes instantly (zeroization) since it was never resident in static memory |

## 7. Integration with a Trusted Execution Environment (TEE)

The HRoT is the foundational bedrock; a TEE (ARM TrustZone, RISC-V PMP) is built on top. After completing the lowest-level hardware and bootloader verification, the HRoT hands execution to the Secure OS (e.g. OP-TEE) inside the TEE. The HRoT derives dedicated per-TA (Trusted Application) keys via the PUF, so even if the Rich OS is fully compromised, TEE secrets remain unreadable.

## 8. Toward Zero Trust: Chapter Summary

Modern IC security cannot rely on software patching alone. The PUF supplies an unclonable physical entropy source; the HRoT converts that entropy source into the system's trust anchor. This "silicon-to-cloud trust" architecture is the indispensable hardware foundation for a modern Zero Trust Architecture.

## 9. References

1. NIST SP 800-193 — *Platform Firmware Resiliency Guidelines*.
2. Arm Platform Security Architecture (PSA) — *PSA Certified Root of Trust Security Requirements*.
3. Trusted Computing Group (TCG) — *DICE (Device Identifier Composition Engine) Specification*.
4. FIPS 140-3 — *Security Requirements for Cryptographic Modules*. NIST.
5. GlobalPlatform — *TEE System Architecture*.
6. Rostami, M., Koushanfar, F., & Karri, R. (2014). *A Primer on Hardware Security: Models, Methods, and Metrics*. Proceedings of the IEEE.
