# Module 37: Entropy Source

## Learning Objectives
- Distinguish physical/hardware entropy sources (thermal noise, RO jitter, quantum tunneling, metastability) from software/OS entropy pools
- Explain entropy conditioning (Von Neumann extractor, hash-based compression) and the hybrid TRNG-seeds-DRBG architecture
- Understand why NIST SP 800-90B mandates min-entropy ($H_\infty = -\log_2 p_{max}$) instead of Shannon entropy
- Compute health-test trigger thresholds (e.g. Repetition Count Test) from a measured min-entropy value

## Estimated Time
1.5 hours

## Prerequisites
- Module 04 (PUF & TRNG)
- Module 36 (NIST SP 800-22 Randomness Tests)

## Module Structure
| File | Description |
|------|--------------|
| `theory.md` | Physical and software entropy sources, conditioning/whitening, hybrid TRNG/DRBG architecture, NIST SP 800-90B min-entropy model |
| `whui-page.tsx` | Interactive noise-source simulator with sample count and environmental-drift sliders computing live min-entropy from simulated byte distribution |

## Key Topics
1. Thermal noise, ring-oscillator jitter, quantum tunneling, metastability
2. Software entropy pools and boot-time/VM entropy starvation
3. Von Neumann extraction and hash-based entropy conditioning
4. Hybrid TRNG-seeds-DRBG architecture and reseeding
5. NIST SP 800-90B min-entropy, IID vs. Non-IID estimation tracks, and RTL health tests

## References
- NIST SP 800-90B — *Recommendation for the Entropy Sources Used for Random Bit Generation*.
- Baando, M., et al. (2015). *A Hardware Ring Oscillator True Random Number Generator*. IEEE.

**Further Reading (Beginner):** [Beginner Hardware Security Resources / 晶片安全入門教材與資源](../resources/hardware-security-beginner-resources.md)
