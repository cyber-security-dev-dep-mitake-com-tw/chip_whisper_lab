# Module 32: FIPS 140-2 Overview — Theory

*(Source: compiled from `docs/references/ch-1/FIPS 140-2 overview (FIPS 140-2 標準概述).md`, 單元 1.1.)*

## 1. What Is FIPS 140-2? (什麼是 FIPS 140-2？)

**FIPS 140-2** — *Federal Information Processing Standard Publication 140-2* — is a jointly maintained security standard from the U.S. **NIST** and Canada's **CSE**. Its core purpose is to regulate the security requirements of **Cryptographic Modules**: any hardware/software product procured by U.S. or Canadian federal agencies to protect **Sensitive but Unclassified (SBU)** information must have its crypto engine FIPS 140-2 certified. The standard has since become a de facto hardware-security benchmark across global finance, healthcare, and high-tech industries — well beyond its original government-procurement scope.

## 2. Cryptographic Module and Boundary (密碼模組與安全邊界)

The single most important concept for an IC design engineer is the **Cryptographic Boundary**. FIPS 140-2 requires developers to explicitly define which hardware components, software code, and data paths fall *inside* the crypto module. In chip design this means the AES/RSA hardware accelerator, key-storage memory (SRAM, eFuse), and their control logic must be physically and logically isolated from the general-purpose CPU and system bus. No plaintext key or **Critical Security Parameter (CSP)** may cross the boundary unauthenticated or unencrypted.

## 3. The Four Security Levels (四個安全等級)

FIPS 140-2 defines four increasing security levels; Levels 3 and 4 are where hardware security is truly tested:

| Level | Requirement | Typical Realization |
|---|---|---|
| **Level 1** | NIST-approved algorithms only (e.g. AES, SHA-256); no physical security requirement | Pure software crypto libraries (e.g. stock OpenSSL) |
| **Level 2** | Adds **tamper-evidence** (tamper-evident seals/coatings) and role-based authentication | Enclosures with tamper-evident labels |
| **Level 3** | Adds **tamper-resistance**: active intrusion-detection circuitry that triggers **zeroization** within milliseconds of a probing/de-packaging attempt; identity-based authentication; physically isolated key I/O ports | Smart cards, HSMs |
| **Level 4** | Adds **Environmental Failure Protection (EFP)**: on-die sensors detect out-of-range voltage/temperature (used by attackers for voltage glitching) and trigger lockdown/zeroization | High-assurance secure MCUs |

$$
\text{Zeroization triggers} \iff \text{tamper sensor detects intrusion} \lor \text{env. parameter} \notin [\,V_{min}, V_{max}\,] \times [\,T_{min}, T_{max}\,]
$$

## 4. Deep Impact on IC Design (FIPS 140-2 對 IC 設計的深遠影響)

Achieving Level 3/4 certification means translating "regulatory requirement" into "hardware specification": designers must architect in a dedicated Secure MCU, a hardware TRNG, and side-channel-resistant circuit design from the earliest floorplanning stage — the very foundations of a Hardware Root of Trust (HRoT).

## 5. References

1. NIST FIPS PUB 140-2 — *Security Requirements for Cryptographic Modules*.
2. NIST Cryptographic Module Validation Program (CMVP) — *Implementation Guidance for FIPS PUB 140-2 and the Cryptographic Algorithm Validation Program*.
