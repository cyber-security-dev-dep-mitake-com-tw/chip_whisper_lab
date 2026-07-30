# Module 26: PUF-based Applications (基於 PUF 的安全應用)

## Learning Objectives
- Explain keyless storage and why PUF-derived keys resist cold-boot/probing attacks
- Walk through the fuzzy-extractor Gen/Rep flow used for key generation
- Describe PUF-based IC anti-counterfeiting and challenge-response device authentication
- Explain firmware key wrapping, key derivation/isolation (HUK + KDF), and zero-touch cloud onboarding

## Estimated Time
1.5–2 hours

## Prerequisites
- Module 04 (PUF & TRNG)

## Module Structure
| File | Description |
|------|--------------|
| `theory.md` | Seven PUF application areas with diagrams sourced from the reference deck |
| `whui-page.tsx` | Interactive scenario picker: key generation, authentication, anti-counterfeiting, key wrapping |
| `diagram-*.png` | Reference architecture diagrams (key generation, KDF, secure memory, key wrapping, firmware protection, secure boot) |

## Key Topics
1. Keyless storage & fuzzy extractor Gen/Rep
2. IC anti-counterfeiting via factory PUF database
3. Lightweight challenge-response device authentication
4. TRNG entropy from unstable PUF bits
5. Hardware-software binding / firmware key wrapping
6. Key derivation (HUK + KDF) and isolation
7. Zero-touch cloud onboarding (PUF-based PKI)

## References
- Dodis, Y., Reyzin, L., & Smith, A. (2004). *Fuzzy extractors*. EUROCRYPT.
- Ruhrmair, U., et al. (2010). *Modeling attacks on physical unclonable functions*. ACM CCS.
- NIST SP 800-108 — *Recommendation for Key Derivation Using Pseudorandom Functions*.

**Further Reading (Beginner):** [Beginner Hardware Security Resources / 晶片安全入門教材與資源](../resources/hardware-security-beginner-resources.md)
