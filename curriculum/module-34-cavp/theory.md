# Module 34: CAVP and Security Objectives — Theory

*(Source: compiled from `docs/references/ch-1/CAVP and Security Objectives (CAVP 演算法驗證與安全目標).md`, 單元 1.3 and 1.4.)*

## 1. What Is CAVP? (什麼是 CAVP？)

Module security (FIPS 140-3) rests on the assumption that the **underlying algorithm is correctly implemented**. NIST and Canada's CSE jointly run the **Cryptographic Algorithm Validation Program (CAVP)** for exactly this: it validates, via strict test vectors, that a software or hardware IP's implementation of AES, SHA-3, RSA, ECC, DRBG, etc. is mathematically and logically conformant with the relevant FIPS/NIST SP.

**CAVP vs. CMVP**: CAVP validates the *algorithm*; CMVP (FIPS 140 certification) validates the *whole module's* security architecture and physical protection. Every algorithm used inside a module **must** hold a CAVP certificate before CMVP certification can even be attempted.

## 2. Test Mechanisms: From CAVS to ACVP (CAVP 測試機制與自動化)

- **Known Answer Tests (KAT)**: CAVP supplies test sets of plaintext/key/IV. The hardware engine must reproduce the exact known-correct ciphertext/hash — a single bit of difference fails validation.
- **Monte Carlo Tests**: verify state stability across millions of iterations (e.g. an AES engine's internal counters/buffers during streaming operation).
- **ACVP (Automated Cryptographic Validation Protocol)**: the modern replacement for manual CAVS file exchange — vendors connect directly to NIST servers over an API to fetch vectors and submit results, sharply shortening validation cycles.

## 3. Security Objectives (硬體密碼模組的安全目標)

| Objective | Hardware Realization |
|---|---|
| **Confidentiality** | Memory isolation, secure bus, tamper-resistant anti-probing circuits |
| **Integrity** | SHA hash engines + ECDSA/RSA signature verification (e.g. Secure Boot) |
| **Authentication & Non-repudiation** | HRoT-resident device private key signs attestation data to a cloud server |
| **Availability & Resiliency** | Watchdog timers, lockstep dual-core error detection, instant zeroization under fault-injection attack |

## 4. Practical Significance for IC Design (CAVP 對 IC 設計的實務意義)

CAVP certification is the "entry ticket" to government procurement, EMVCo payment, automotive, and high-end IoT markets — proof that a chip's crypto accelerator has the highest tier of computational correctness and compliance.

## 5. Case Studies: Attacks on Hardware Security (硬體安全攻擊實例分析)

Standards exist because "security is written in blood." Three landmark cases:

- **Fusée Gelée (Nvidia Tegra X1 Boot ROM)**: a USB control-transfer buffer overflow in the immutable Boot ROM hijacked control flow to execute unsigned code at the highest privilege — because Boot ROM is masked in silicon, tens of millions of affected chips could not be patched by software; only a re-spin fixed it.
- **ROCA / CVE-2017-15361 (Infineon TPM)**: Infineon's "Fast Prime" RSA key-generation algorithm produced primes with a detectable mathematical structure (insufficient entropy), letting attackers factor RSA public keys via a Coppersmith attack within hours using only cloud compute — despite the chip holding Common Criteria and FIPS certification. This is precisely why CAVP validates the *implementation*, not just the algorithm name.
- **Xbox 360 Reset Glitch Hack**: a nanosecond-scale voltage glitch on the CPU reset pin during signature verification (`memcmp`) corrupted logic state just long enough to skip the failed-signature branch, loading unsigned code — a textbook fault-injection (FI) attack defeated only by FIPS 140-3 Level 3/4-class environmental sensors and logic redundancy.

$$
\text{CMVP certification} \iff \forall\, \text{algorithm} \in \text{module}: \text{CAVP-certified}(\text{algorithm}) = \text{true}
$$

## 6. References

1. NIST SP 800-140C — *CMVP Approved Security Functions*.
2. NIST Cryptographic Algorithm Validation Program (CAVP) Official Guidelines.
3. IETF RFC 8959 — *Automated Cryptographic Validation Protocol (ACVP)*.
4. Temkin, K. (2018). *Vulnerability Disclosure: Fusée Gelée*.
5. Nemec, M., et al. (2017). *The Return of Coppersmith's Attack: Practical Factorization of Widely Used RSA Moduli*. ACM CCS.
6. Bulygin, Y., & Samyde, D. (2012). *Fault injection attacks on secure systems*. Black Hat Briefings.
