# Module 01: Chip Security Landscape

## Learning Objectives
- Understand the FIPS 140-3 evaluation framework and CMVP certification process
- Distinguish between Common Criteria assurance levels (EAL1–EAL7)
- Classify attacks as passive (side-channel) vs. active (fault injection, probing)
- Analyze real-world hardware security incidents (Spectre, Meltdown, Rowhammer, Heartbleed)
- Navigate NIST publications relevant to hardware security

## Estimated Time
2–3 hours

## Prerequisites
- Module 00 (Environment Setup)
- Basic understanding of computer architecture (CPU, memory, bus)
- Familiarity with symmetric and asymmetric cryptography (helpful but not required)

## Module Structure
| File | Description |
|------|-------------|
| `theory.md` | Comprehensive coverage of chip security standards and attack taxonomy |
| `lab-simulated.ipynb` | Interactive analysis of vulnerability databases and attack classification |

## Key Topics
1. **Standards & Certification**: FIPS 140-3, CMVP, Common Criteria, GlobalPlatform
2. **Attack Taxonomy**: Passive vs. active, invasive vs. non-invasive, logical vs. physical
3. **Case Studies**: Spectre/Meltdown (speculative execution), Rowhammer (DRAM), Heartbleed (software)
4. **Regulatory Landscape**: NIST SP 800-57, NIST SP 800-175B

## References
- [NIST FIPS 140-3](https://csrc.nist.gov/publications/detail/fips/140/3/final)
- [Common Criteria Portal](https://www.commoncriteriaportal.org/)
- [ChipWhisperer Threat Model](https://chipwhisperer.readthedocs.io/en/latest/)
