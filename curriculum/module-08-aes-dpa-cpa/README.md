# Module 08: AES S-box Leakage & DPA/CPA Attacks

## Learning Objectives
- Understand the AES S-box leakage model for power analysis attacks
- Select appropriate intermediate values for CPA key recovery
- Explain key recovery by byte using the divide-and-conquer approach
- Compute Pearson correlation coefficient for each key guess
- Interpret correlation traces to identify correct key bytes

## Estimated Time
3–4 hours

## Prerequisites
- Module 06 (Side-Channel Analysis Theory)
- Module 07 (ChipWhisperer-Lite Hardware)
- AES algorithm internals (Module 02)

## Module Structure
| File | Description |
|------|-------------|
| `theory.md` | Detailed CPA attack methodology on AES, S-box leakage, key recovery |
| `lab-simulated.ipynb` | Interactive CPA attack on simulated AES implementation |

## Key Topics
1. **AES S-box Leakage**: Why SubBytes is the primary attack target
2. **Intermediate Value Selection**: Choosing the right leakage point
3. **Divide and Conquer**: Recovering key bytes independently
4. **Correlation Analysis**: Pearson coefficient per key guess
5. **Key Ranking**: Evaluating attack success with correlation heatmaps

## References
- [Mangard, S. et al., Power Analysis Attacks (Springer, 2007)](https://doi.org/10.1007/978-0-387-68901-2)
- [Coron and Goli, "Correlation Power Analysis with a Leakage Model" (CHES 2004)](https://doi.org/10.1007/978-3-540-28637-0_2)
- [NewAE sca101 Lab 3_3: CPA on AES](https://github.com/newaetech/chipwhisperer-jupyter)
