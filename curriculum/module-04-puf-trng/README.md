# Module 04: Physical Unclonable Functions & True Random Number Generators

## Learning Objectives
- Understand the operating principles of PUF types (RO-PUF, arbiter PUF, SRAM PUF, buskeeper PUF)
- Analyze PUF challenges: reliability, uniqueness, tamper resistance
- Explain TRNG architectures: ring oscillator jitter, thermal noise, metastability
- Describe entropy sources and NIST SP 800-90B requirements for true randomness
- Evaluate PUF/TRNG performance metrics

## Estimated Time
2–3 hours

## Prerequisites
- Module 01 (Chip Security Landscape)
- Basic digital logic (flip-flops, oscillators, counters)
- Familiarity with statistics (mean, standard deviation, correlation)

## Module Structure
| File | Description |
|------|-------------|
| `theory.md` | Detailed theory of PUF types, TRNG architectures, and entropy assessment |
| `lab-simulated.ipynb` | Interactive PUF simulation, TRNG statistical testing |

## Key Topics
1. **PUF Types**: Ring oscillator, arbiter, SRAM, buskeeper, butterfly
2. **PUF Metrics**: Reliability, uniqueness, uniformity, bit aliasing
3. **TRNG Sources**: Ring oscillator jitter, thermal noise, shot noise, metastability
4. **Entropy Assessment**: NIST SP 800-90B, min-entropy, collision entropy
5. **Applications**: Key generation, device authentication, secure boot
6. **Entropy Theory**: Shannon vs. min-entropy, Boltzmann entropy and the physical origin of thermal noise (§3.8) — continues in Module 22 with Von Neumann entropy and quantum-gravity entropy (Bekenstein-Hawking, holography)

## References
- [NIST SP 800-90B: Recommendation for the Entropy Sources](https://csrc.nist.gov/publications/detail/sp/800-90b/final)
- [PUF Survey: Physics and Applications](https://doi.org/10.1145/3365001)
- [Gassend et al., "Silicon Physical Unclonable Functions"](https://doi.org/10.1145/774819.774845)

**Further Reading (Beginner):** [Beginner Hardware Security Resources / 晶片安全入門教材與資源](../resources/hardware-security-beginner-resources.md) — free intro-level PDFs, papers, and a Chinese-language (中文) TRNG/entropy-source video course.
