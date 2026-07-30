# Module 35: NIST SP 800-131A — Algorithm and Key Transitions — Theory

*(Source: compiled from `docs/references/ch-1/NIST 800-131A - Algorithm and key.md`, 單元 1.5.)*

## 1. What Is NIST SP 800-131A? (什麼是 NIST SP 800-131A？)

Cryptographic strength is not eternal — GPU/ASIC-accelerated brute force and advances in cryptanalysis erode algorithms once considered safe. **NIST SP 800-131A** (*Transitioning the Use of Cryptographic Algorithms and Key Lengths*) is a binding technical guideline specifying **when** and **how** federal agencies and FIPS 140-compliant vendors must retire aging algorithms, and the minimum key strength allowed per use case.

## 2. Core Metric: Security Strength (核心評估指標：安全強度)

Security strength, measured in bits, is the number of operations an attacker needs to break the system (e.g. 112-bit strength ≈ $2^{112}$ operations):

$$
\text{Work factor} \approx 2^{S} \quad \text{where } S = \text{security strength (bits)}
$$

| Strength | Status |
|---|---|
| 80-bit | Disallowed since end of 2010 |
| 112-bit | Minimum floor — legacy decryption only, not for new systems |
| 128-bit+ | Mandatory standard for all new deployments |

## 3. Algorithm/Key-Length Retirement Schedule (演算法與金鑰長度的退場與過渡規範)

- **Symmetric**: 2-Key TDEA (80-bit) fully disallowed; 3TDEA (112-bit) disallowed end of 2023. Modern hardware must use **AES-128/192/256** (128/192/256-bit strength respectively).
- **Asymmetric/public-key**: 1024-bit RSA (80-bit) disallowed for signatures. New designs require **RSA ≥ 2048-bit** (112-bit strength), with 3072/4096-bit recommended (128-bit+). **ECC/ECDSA** requires curves ≥ 256-bit (e.g. NIST P-256, 128-bit strength).
- **Hash functions**: **SHA-1** (80-bit collision resistance) is banned for signatures/certificates. Hardware must migrate to **SHA-2** (SHA-224/256/384/512) or **SHA-3**.

## 4. Direct Impact on IC Chip Design (規範對 IC 晶片設計的直接衝擊)

- **IP trimming and compliance**: remove hardware support for retired algorithms (DES, SHA-1) — saves area/power and avoids FIPS 140-3 certification failure risk.
- **Hardware resource scaling**: RSA 1024→2048→4096-bit means modular-multiplier register width, secure SRAM capacity, and bus bandwidth must scale accordingly.
- **Future-proofing**: automotive/IIoT chips have 10-15 year service lives. Designing to the 112-bit floor risks regulatory obsolescence mid-service; forward-looking HRoT designs target 128-bit (or 256-bit, anticipating post-quantum needs) from tape-out.

## 5. References

1. NIST SP 800-131A Revision 2 — *Transitioning the Use of Cryptographic Algorithms and Key Lengths*.
2. NIST SP 800-57 Part 1 Revision 5 — *Recommendation for Key Management: Part 1 – General*.
