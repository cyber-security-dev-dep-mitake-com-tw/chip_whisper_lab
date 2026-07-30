# Module 30: Key Generation with PUF Solutions

## Learning Objectives
- Explain why raw PUF output cannot be used directly as a cryptographic key (BER, imperfect entropy)
- Walk through the fuzzy extractor's Gen (enrollment) and Rep (reproduction) phases
- Understand multi-layer ECC (repetition code + BCH/Reed-Muller) for information reconciliation
- Explain privacy amplification and the zero-leakage requirement on helper data

## Estimated Time
1–1.5 hours

## Prerequisites
- Module 04 (PUF & TRNG)
- Module 26 (PUF-based Applications)

## Module Structure
| File | Description |
|------|--------------|
| `theory.md` | Fuzzy extractor Gen/Rep flow, ECC layering, privacy amplification, helper-data security |
| `whui-page.tsx` | Interactive majority-vote ECC demo: inject bit-flip noise and watch key recovery succeed or fail |

## Key Topics
1. Bit error rate vs. cryptographic avalanche effect
2. Fuzzy extractor Gen/Rep phases
3. Repetition code + BCH/Reed-Muller error correction
4. Privacy amplification (universal hashing, SHA-256 compression)
5. Helper data zero-leakage and tamper-evidence requirements

## References
- Dodis, Y., Reyzin, L., & Smith, A. (2004). *Fuzzy extractors*. EUROCRYPT.
- Maes, R., Tuyls, P., & Verbauwhede, I. (2012). *Low-overhead implementation of a soft decision helper data algorithm for SRAM PUFs*. CHES.
- NIST SP 800-90B.

**Further Reading (Beginner):** [Beginner Hardware Security Resources / 晶片安全入門教材與資源](../resources/hardware-security-beginner-resources.md)
