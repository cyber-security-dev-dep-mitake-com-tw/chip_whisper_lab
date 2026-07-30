# Module 29: Hardware Security Platform (硬體安全平台架構與整合) — Theory

## 1. Integration: From Isolated Primitives to a Unified Security Platform

Earlier modules covered the individual pieces: hardware root of trust construction, anti-tamper OTP storage (eFuse/Anti-Fuse), PUF key generation, and cryptographic accelerators. In a modern complex SoC these security IPs are not scattered independently across the die.

A **Hardware Security Platform** deeply integrates all of these low-level security primitives with management firmware into an independent, closed, self-governing **secure subsystem**. It not only protects the underlying keys but exposes standardized APIs upward to the Rich OS, becoming the whole device's "chief trust officer."

## 2. Platform Architecture & Security Boundary

A representative hardware security platform (e.g. an integrated Hardware Security Module, iHSM, or Secure Enclave) typically has these independent hardware characteristics forming an impenetrable physical isolation boundary:

- **Dedicated secure CPU**: the platform has its own CPU (physically separate from the main system CPU), dedicated to running the Secure OS and access-control logic.
- **Private secure memory**: a dedicated Boot ROM, secure SRAM (for plaintext key material in use), and protected non-volatile memory (state + helper data). None of this shares an address space with the main system.
- **RoT & crypto cluster**: tightly integrates the PUF (as the hardware-unique-key source), a TRNG, and side-channel-resistant crypto engines.
- **Secure interconnect**: internal data transfer runs over a private bus, ensuring the main CPU's probes or DMA controllers cannot snoop across the boundary.

## 3. Software-Hardware Communication: The Mailbox Mechanism

Since the main OS (Linux, Android, or an automotive QNX) cannot directly read the security platform's memory, how does it invoke cryptographic services? Through a strictly controlled **hardware mailbox** or inter-processor communication (IPC) interface.

1. **Send request**: the main system places data to be processed (e.g. a firmware hash to be signed) plus a command code into the mailbox and triggers an interrupt.
2. **Internal processing**: the security platform's CPU wakes, reads the command, first checks the requester's permission (does this application have rights to use this key?), and if authorized, invokes the internal crypto hardware.
3. **Return result**: the platform places the result (e.g. a digital signature or ciphertext) back into the mailbox for the main system to retrieve.

**Core security benefit**: throughout this whole process, the main system only ever obtains a *computation result* — never the plaintext key. This fully defends against key theft even when the main system's software is compromised (e.g. root-level exploit).

$$
\text{MainOS} \xrightarrow{\text{cmd + data}} \text{Mailbox} \xrightarrow{\text{IRQ}} \text{Secure CPU} \xrightarrow{\text{ACL check + crypto op}} \text{Mailbox} \xrightarrow{\text{result only}} \text{MainOS}
$$

## 4. Industry-Standard & Open-Source Architectures

To standardize hardware security platform development and reduce ecosystem fragmentation:

| Framework | Description |
|---|---|
| **ARM PSA (Platform Security Architecture)** | Complete framework from threat modeling through hardware architecture requirements to software APIs for IoT/edge devices; promotes isolating the security platform from the main processing environment; provides the PSA Certified scheme. |
| **OpenTitan** | Google-led **open-source silicon root of trust** project. Breaks with "security by obscurity": the platform's RTL, firmware, and verification environment are fully open for global security-community review — a milestone for hardware security platforms. |
| **TPM 2.0** | TCG international standard. Though traditionally a discrete chip, modern SoCs commonly implement it as fTPM (firmware TPM) or iTPM (integrated TPM) inside the hardware security platform, providing measured-boot RoT and remote attestation. |

## 5. Ecosystem Value: Chapter Summary

The maturity of the "hardware security ecosystem" means security is no longer any single engineer's or single IP's responsibility. From the base-layer PUF physical entropy source, tamper-resistant Anti-Fuse storage, attack-resistant crypto engines, all converge into the overarching "hardware security platform." Through standardized hardware architecture and isolation mechanisms, the IC design industry can provide the rich software layer above with an absolute, hard-to-shake trust anchor.

## 6. References

1. ARM Ltd. — *Platform Security Architecture (PSA) Security Model*.
2. OpenTitan Project — *OpenTitan Hardware Architecture Specification*.
3. Trusted Computing Group (TCG) — *TPM 2.0 Library Specification*.
