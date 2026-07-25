# Module 10: Countermeasures Against Side-Channel Attacks

## Learning Objectives
- Understand first-order and higher-order masking techniques
- Explain hiding countermeasures: random delays, shuffling, and random pipeline stage insertion
- Describe Threshold Implementations (TI) and their security guarantees
- Analyze dual-rail logic and its effect on power leakage
- Understand the difference between glitches and leakage in masked implementations
- Evaluate countermeasure effectiveness using TVLA and CPA resistance metrics

## Estimated Time
3–4 hours

## Prerequisites
- Module 06 (Side-Channel Analysis Theory)
- Module 08 (AES S-box Leakage & DPA/CPA)
- Basic probability and Boolean algebra

## Module Structure
| File | Description |
|------|-------------|
| `theory.md` | Masking, hiding, TI, dual-rail logic, countermeasure evaluation |
| `lab-simulated.ipynb` | Interactive masking simulation, CPA resistance analysis |

## Key Topics
1. **Masking**: Boolean masking, first-order, higher-order, recombination
2. **Hiding**: Random delays, shuffling, random pipeline insertion
3. **Threshold Implementations**: Multi-party computation in hardware
4. **Dual-Rail Logic**: WDDL, TDPL, constant power consumption
5. **Evaluation Methodology**: TVLA, CPA resistance, number of traces required

## References
- [Mangard, S. et al., Power Analysis Attacks (Springer, 2007)](https://doi.org/10.1007/978-0-387-68901-2)
- [Prouff and Rivain, "A Generic Security Proof for Masking" (2009)](https://eprint.iacr.org/2009/123)
- [NIST SP 800-90B](https://csrc.nist.gov/publications/detail/sp/800-90b/final)
