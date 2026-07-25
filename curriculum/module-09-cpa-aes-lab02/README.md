# Module 09: Full CPA Attack Walkthrough with ChipWhisperer Analyzer

## Learning Objectives
- Configure the ChipWhisperer Analyzer leakage model for AES CPA
- Run a complete CPA attack using the ChipWhisperer Analyzer GUI/API
- Interpret correlation heatmaps and identify the correct key bytes
- Recover the full 128-bit AES key from power traces
- Calculate Probability of Guessing Entropy (PGE) to evaluate attack success

## Estimated Time
3–4 hours

## Prerequisites
- Module 08 (AES S-box Leakage & DPA/CPA)
- ChipWhisperer hardware (or simulated traces from Module 08)

## Module Structure
| File | Description |
|------|-------------|
| `theory.md` | ChipWhisperer Analyzer workflow, PGE calculation, attack evaluation |
| `lab-simulated.ipynb` | Full CPA attack walkthrough with correlation analysis |

## Key Topics
1. **ChipWhisperer Analyzer**: GUI and API workflow for CPA
2. **Leakage Model Configuration**: Setting up S-box leakage model
3. **Attack Execution**: Running the CPA attack on captured traces
4. **Correlation Heatmap**: Visualizing attack results
5. **PGE Calculation**: Evaluating key recovery confidence

## References
- [ChipWhisperer Analyzer Documentation](https://chipwhisperer.readthedocs.io/en/latest/analyzer.html)
- [NewAE sca101 Lab 4_3: CPA Attack](https://github.com/newaetech/chipwhisperer-jupyter)
- [NewAE sca101 Lab 5_1: CPA Results](https://github.com/newaetech/chipwhisperer-jupyter)
