# Module 38: IoT Security Regulation — California SB-327 & UK DCMS Code of Practice — Theory

*(Source: compiled from `docs/references/ch-1/California Senate Bill No. 327 (加州物聯網安全法案 SB-327).md` and `docs/references/ch-1/DCMS Code of Practice.md`.)*

## 1. From Best Practice to Legal Liability (從「建議指引」到「法律強制力」)

Standards like FIPS 140-3, CAVP, and NIST SP 800-131A (Modules 32-35) primarily govern cryptographic algorithms and high-end hardware security modules. As cheap, poorly protected connected devices (IP cameras, smart-home gadgets) proliferated, they became prime hijacking targets for DDoS botnets (e.g. Mirai). Two landmark regulations responded to this gap: California's **SB-327** and the UK's **DCMS Code of Practice** — both elevating IoT security from voluntary best practice to legal/regulatory obligation.

---

## Part A: California Senate Bill No. 327 (加州物聯網安全法案 SB-327)

### A.1 Background

Passed in 2018, effective January 1, 2020, **SB-327** is **the first U.S. state-level law targeting IoT device security**. It marks the historic shift from industry best practice to legal liability for connected-device manufacturers.

### A.2 Core Requirement: "Reasonable Security Feature(s)"

SB-327 requires all connected devices manufactured or sold in California to have "reasonable security feature or features," defined along three dimensions:

1. **Appropriateness** — the security feature must match the nature and function of the device.
2. **Proportionality** — must be proportionate to the nature and sensitivity of the information the device collects, contains, or transmits.
3. **Protective capability** — must be designed to protect the device and its information from unauthorized access, destruction, use, modification, or disclosure.

### A.3 The Specific Mandate: No Universal Default Passwords

The law's most concrete, engineering-impacting clause: for any device capable of authentication outside a local area network, the device must satisfy **one** of:

- **Option A (unique preprogrammed credential)**: the device ships with a **unique password per device**.
- **Option B (forced first-use change)**: the device requires the user to **generate a new means of authentication** before first use.

This directly outlaws the historical practice of hard-coding a global default like `admin`/`admin` or `123456` into firmware.

### A.4 Deep Impact on IC Design and Manufacturing Supply Chain

- **Unique Device Identity**: chips must integrate an immutable hardware-unique feature — driving adoption of OTP (eFuse, Module 32) or PUF (Module 04/25) in low-cost IoT silicon so every chip ships with a unique silicon fingerprint.
- **Secure Provisioning**: fabs/OSATs can no longer flash the same firmware image to a million chips; production lines must dynamically generate and inject a unique credential/key per device during provisioning, tied to its hardware unique ID.
- **Protection against extraction**: a unique password stored in plaintext SPI flash is still trivially readable — chips need hardware crypto to bind the factory credential to the hardware root of trust (key wrapping).

### A.5 Global Domino Effect

SB-327 triggered a global regulatory wave: ETSI published **EN 303 645** (Cyber Security for Consumer IoT), and the UK followed with the DCMS Code of Practice (Part B below) — all converging on banning universal default passwords.

---

## Part B: UK DCMS Code of Practice (英國消費性物聯網安全實務守則)

### B.1 Background and Global Influence

The UK's **Department for Digital, Culture, Media & Sport (DCMS)** published the *Code of Practice for Consumer IoT Security* in 2018. Rather than a lengthy technical manual, it distills **13 core guidelines**, which became the direct blueprint for **ETSI EN 303 645** (the world's first consumer-IoT international security standard) and ultimately the UK's binding **Product Security and Telecommunications Infrastructure (PSTI) Act**.

### B.2 The Three Core Pillars

Of the 13 guidelines, three are treated as the absolute baseline for market entry into Europe:

1. **No default passwords** — every password must be unique per device; no global factory reset value (e.g. `admin`/`admin`) is permitted — consistent with SB-327.
2. **Implement a vulnerability disclosure policy** — manufacturers must provide a public contact channel for researchers to report vulnerabilities, with a clear commitment to remediation timelines.
3. **Keep software updated** — devices must support secure OTA updates, and manufacturers must disclose the minimum guaranteed support period on packaging or at point of sale.

### B.3 Additional Requirements With Direct Silicon/SoC Impact

- **Securely store credentials and security-sensitive data**: any on-chip credential, key, or personal data must be hardware-protected — requiring protected non-volatile memory blocks (Anti-Fuse OTP, Module 32, or TrustZone-protected storage) to prevent flash-dumper extraction of plaintext keys.
- **Ensure software integrity**: devices must verify software integrity at boot, requiring a **Hardware Root of Trust (HRoT)** with an immutable Boot ROM (Module 05) and hardware SHA/RSA/ECC engines for signature verification.
- **Minimise exposed attack surfaces**: unnecessary physical ports and logical services must be disabled — requiring **lifecycle-state management** hardware that permanently locks or gates debug ports (JTAG, Module 14) once a chip transitions from manufacturing/test to field deployment.

### B.4 From Voluntary Code to Binding Law: UK PSTI Act

The Code of Practice began as voluntary guidance. Insufficient market uptake led the UK government to escalate its top-three requirements into binding law — the **Product Security and Telecommunications Infrastructure (PSTI) Act 2022**, effective April 29, 2024. Connected devices sold in the UK lacking unique credentials or secure update support now face substantial fines and potential market withdrawal.

---

## 2. Comparative Summary

| Dimension | California SB-327 | UK DCMS Code of Practice / PSTI Act |
|---|---|---|
| Jurisdiction | U.S. state law (California) | UK government guidance → binding law (PSTI Act 2022) |
| Effective | Jan 1, 2020 | Code: 2018 (voluntary); PSTI Act: Apr 29, 2024 (binding) |
| Core password rule | Unique preprogrammed password OR forced first-use change | No default passwords (unique per device) |
| Scope | Any connected device sold/manufactured in California | Consumer IoT devices sold in the UK |
| Additional obligations | None beyond password rule (concise statute) | + Vulnerability disclosure policy + guaranteed update period (13 guidelines total) |
| Downstream influence | ETSI EN 303 645 | Direct blueprint for ETSI EN 303 645 |

## 3. Why This Matters for IC Design

Both regulations push compliance pressure upstream from the end device to the SoC: unique device identity (OTP/PUF), secure provisioning, protected key storage, HRoT-based secure boot, and lifecycle-managed debug-port gating are no longer optional premium features — they are the baseline for **legal market access** in the U.S. and Europe.

## 4. References

1. California Legislative Information — *SB-327 Information privacy: connected devices*.
2. ETSI EN 303 645 — *Cyber Security for Consumer Internet of Things: Baseline Requirements*.
3. UK Department for Digital, Culture, Media & Sport (DCMS) — *Code of Practice for Consumer IoT Security*.
4. UK Parliament — *Product Security and Telecommunications Infrastructure (PSTI) Act 2022*.
