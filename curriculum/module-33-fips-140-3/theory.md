# Module 33: FIPS 140-3 — The Modern Framework — Theory

*(Source: compiled from `docs/references/ch-1/FIPS 140-3 modern framework.md`, 單元 1.2.)*

## 1. Why FIPS 140-3? (為什麼需要更新至 FIPS 140-3？)

FIPS 140-2 governed crypto-module certification for nearly two decades after its 2001 release. As process nodes shrank, IoT exploded, and non-invasive physical attacks (side-channel analysis, SCA) matured, FIPS 140-2's framework could no longer cover the threats facing a modern SoC. NIST published **FIPS 140-3** in 2019 — historically significant because it is no longer a US/Canada-only standard: it **fully aligns with ISO/IEC 19790:2012** (security requirements) and **ISO/IEC 24759:2017** (test requirements), sharply reducing duplicate certification cost for multinational vendors.

## 2. Core Changes for IC Design (FIPS 140-3 對 IC 設計的核心影響與改變)

- **Mandatory non-invasive attack mitigation**: FIPS 140-2 did not centrally mandate DPA/EMA countermeasures. FIPS 140-3 (via **NIST SP 800-140F**) requires explicit mitigation evidence and test proof — pushing Boolean masking and gate-level timing/power hiding into the RTL stage.
- **Life-cycle assurance**: chip vendors must now prove secure engineering across the *entire* hardware development life cycle — version control, vulnerability patching, secure delivery, and key revocation at end-of-life — not just the shipped product.
- **Stricter zeroization**: the definition and test methodology for zeroization tighten, ensuring an attacker cannot recover keys from residual charge in SRAM.

## 3. FIPS 140-2 vs. FIPS 140-3 Comparison

| Dimension | FIPS 140-2 | FIPS 140-3 |
|---|---|---|
| International alignment | US/Canada-led, independent | Fully integrates ISO/IEC 19790 & 24759 |
| Annex structure | Bundled into the main document | Split into the fast-updating NIST SP 800-140 series |
| SCA defense | Not centrally mandated | Independent, explicit evaluation item (SP 800-140F) |
| Software/firmware security | Basic | Stronger firmware-integrity and TEE-boundary verification |

## 4. Transition Timeline (模組過渡與日落條款)

CMVP stopped accepting new FIPS 140-2 applications in **2021**. All new HRoT/HSM/crypto co-processor designs must target FIPS 140-3. Remaining valid FIPS 140-2 certificates move to the **Historical List** by end of **2026**, marking the industry's full transition.

$$
t_{\text{cert valid}} \le 2026 \implies \text{new designs} \Rightarrow \text{FIPS 140-3 only}
$$

## 5. References

1. NIST FIPS PUB 140-3 — *Security Requirements for Cryptographic Modules* (2019).
2. ISO/IEC 19790:2012 — *Information technology — Security techniques — Security requirements for cryptographic modules*.
3. NIST SP 800-140F — *CMVP Approved Non-Invasive Attack Mitigation Test Metrics*.
