# Module 36: NIST SP 800-22 Randomness Tests

## Learning Objectives
- Enumerate the 15 statistical tests in the NIST SP 800-22 suite and what each detects
- Understand the P-value hypothesis-testing framework and the 0.01 significance threshold
- Compute the Frequency (Monobit) Test and Runs Test statistics by hand and in code
- Distinguish SP 800-22 statistical randomness testing from SP 800-90B min-entropy estimation

## Estimated Time
1.5 hours

## Prerequisites
- Module 04 (PUF & TRNG)
- Module 37 (Entropy Source)

## Module Structure
| File | Description |
|------|--------------|
| `theory.md` | The 15-test SP 800-22 suite, worked Monobit and Runs Test derivations, practical interpretation |
| `whui-page.tsx` | Interactive bit-sequence tester with live Monobit and Runs test statistics/P-values (plain JS, no libraries) |

## Key Topics
1. P-value hypothesis testing and the α = 0.01 pass/fail threshold
2. Frequency (Monobit) Test and Frequency Test within a Block
3. Runs Test and Longest Run of Ones
4. Spectral (DFT), template matching, Maurer's Universal, linear complexity, serial, approximate entropy, cumulative sums, and random excursions tests
5. Relationship to NIST SP 800-90B min-entropy estimation

## Note
The corresponding source reference document (`docs/references/ch-1/NIST 800-22 Randomness Tests (NIST 800-22 隨機性統計檢測標準).md`) was empty in this course's materials; this module's theory was compiled from NIST SP 800-22's public standard documentation to fill the gap (see `theory.md` header note).

## References
- NIST Special Publication 800-22 Revision 1a — *A Statistical Test Suite for Random and Pseudorandom Number Generators for Cryptographic Applications*.
- NIST SP 800-90B — *Recommendation for the Entropy Sources Used for Random Bit Generation*.

**Further Reading (Beginner):** [Beginner Hardware Security Resources / 晶片安全入門教材與資源](../resources/hardware-security-beginner-resources.md)
