# Module 39: Chip Security Considerations — ARM PSA as an Example (晶片安全考量與 ARM PSA 架構實例) — Theory

## 1. Chip-Level Security Design Considerations

Earlier chapters explored the broad hardware-security ecosystem; this module narrows the focus to the security architecture *inside a single System-on-Chip (SoC)*. Modern IoT and edge-computing devices face a dual threat of remote software attacks and physical proximity attacks. At the earliest stage of chip design, four core security principles must be considered:

- **Physical & logical isolation**: untrusted third-party applications (or the main OS) must never be able to cross a boundary to directly access cryptographic keys or secure peripherals.
- **Immutable trust anchor**: the chip must have a Hardware Root of Trust (HRoT) able to perform tamper-proof secure boot.
- **Secure lifecycle states**: the chip must be aware of whether it is in manufacturing, provisioning, in-field operation, or decommissioning, and strictly restrict debug-interface (e.g. JTAG) hardware access accordingly.
- **Standardized trust services**: a unified security API must be exposed so upper-layer software can request encryption/decryption or device attestation services without touching key material directly.

## 2. Introducing ARM's Platform Security Architecture (PSA)

To address the fragmentation of IoT chip security design, ARM proposed the **Platform Security Architecture (PSA)**. PSA is not a single silicon IP block or a piece of software — it is a **complete framework and methodology** spanning threat modeling through certification, giving IC design houses and software developers a standardized "security blueprint."

PSA consists of four stages:

1. **Analyze**: for a given application scenario (smart meter, drone, etc.), provide a standardized Threat Model and Security Analysis (TMSA) defining which specific attack vectors the device must defend against.
2. **Architect**: define hardware/firmware architecture specifications. The central idea is a strict split of the execution space into a **Secure Processing Environment (SPE)** and a **Non-Secure Processing Environment (NSPE)**.
3. **Implement**: ARM provides open-source reference implementations, notably **Trusted Firmware-M (TF-M)**, to help developers realize the PSA spec quickly on a hardware MCU.
4. **Certify**: independent third-party labs perform **PSA Certified** security-level assessments, giving an objective endorsement of a chip's or device's attack resistance.

## 3. Core Architecture: the PSA Firmware Framework (PSA-FF)

To enforce hardware-level isolation, PSA defines the **PSA Firmware Framework (PSA-FF)**, built on a strict boundary model:

- **Dichotomy of execution environments**: a general-purpose OS (FreeRTOS, Linux) and applications run in the **NSPE**. All confidential cryptographic computation, root-of-trust services, and hardware keys are encapsulated inside the **SPE**.
- **Secure Partitions (SP)**: inside the SPE, distinct security services (crypto service, storage service, attestation service, ...) are each isolated into their own "secure partition." This guarantees that a vulnerability in one minor security service cannot laterally compromise other confidential services.
- **Secure Partition Manager (SPM)**: the SPM is the SPE's core privileged software (analogous to a microkernel). It manages the hardware isolation mechanism between secure partitions and handles **Secure IPC** between the NSPE and the SPE. When an external application needs encryption, it can only pass request parameters through the SPM's standard API — it can never directly access SPE memory. This fundamentally cuts off the path by which an attacker could exploit a software bug (e.g. buffer overflow) to steal a key.

## 4. The Architectural Value of PSA as a Worked Example

PSA demonstrates that modern IC design has evolved from "simply stacking cryptographic hardware" to "establishing a system-level isolation and communication specification." Through standardized hardware isolation (e.g. ARM TrustZone combined with a Memory Protection Unit, MPU) and SPM-managed software privilege arbitration, a chip can achieve the best balance between performance, hardware cost, and the highest level of security.

## 5. PSA Certification Levels

PSA Certified defines multiple assurance levels (Level 1 through 3+), each raising the bar on the depth of laboratory evaluation:

| Level | Assurance Approach | Typical Threats Covered |
|---|---|---|
| Level 1 | Self-assessment questionnaire against PSA's base security requirements | Baseline software hygiene, secure boot presence, debug-port lockdown |
| Level 2 | Independent lab evaluation of the PSA Root of Trust components (PSA-RoT), functional + basic non-invasive testing | Software attacks, basic side-channel leakage |
| Level 3 (and PSA Certified 3+) | In-depth vulnerability analysis and penetration testing, including invasive/semi-invasive physical attacks | Fault injection, advanced side-channel analysis, hardware tampering |

Higher levels compose with root-of-trust concepts from earlier modules (Module 27's HRoT, Module 29's hardware security platform) — PSA gives a certifiable, standardized way to *evaluate* whether such an architecture was implemented correctly.

## 6. References

1. ARM Ltd. — *Platform Security Architecture (PSA) Overview*.
2. PSA Certified — *PSA Firmware Framework (PSA-FF) Architecture Specification*.
3. TrustedFirmware.org — *Trusted Firmware-M (TF-M) Documentation*.
4. PSA Certified — *Certification Levels and Assurance Methodology*.
