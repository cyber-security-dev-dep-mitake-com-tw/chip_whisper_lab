# Module 06: Side-Channel Analysis Theory

## Learning Objectives
- Understand Simple Power Analysis (SPA) and how instruction execution patterns leak secrets
- Explain Differential Power Analysis (DPA) and how statistical methods recover keys
- Apply Correlation Power Analysis (CPA) using the Pearson correlation coefficient
- Understand the Hamming Weight and Hamming Distance leakage models
- Perform leakage assessment using Test Vector Leakage Assessment (TVLA)

## Estimated Time
3–4 hours

## Prerequisites
- Module 02 (Symmetric Cryptography & Hash Functions)
- Basic statistics (correlation, standard deviation, mean)
- Python/NumPy familiarity

## Module Structure
| File | Description |
|------|-------------|
| `theory.md` | Mathematical foundations of SPA, DPA, CPA, and leakage models |
| `lab-simulated.ipynb` | Interactive power trace analysis and CPA attack simulation |

## Key Topics
1. **SPA**: Visual pattern recognition in power traces
2. **DPA**: Differential analysis with selection functions
3. **CPA**: Pearson correlation-based key recovery
4. **Leakage Models**: HW, HD, and their mathematical formulations
5. **TVLA**: Statistical leakage assessment methodology

## References
- [Kocher, P. et al., "Power Analysis of Implementations of DES"](https://doi.org/10.1007/3-540-48285-7_1)
- [Mangard, S. et al., Power Analysis Attacks (Springer, 2007)](https://doi.org/10.1007/978-0-387-68901-2)
- [NIST SP 800-90B](https://csrc.nist.gov/publications/detail/sp/800-90b/final)
