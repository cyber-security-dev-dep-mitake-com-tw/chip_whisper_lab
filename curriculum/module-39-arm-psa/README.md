# Module 39: Chip Security Considerations — ARM PSA as an Example (晶片安全考量與 ARM PSA 架構實例)

## Learning Objectives
- Explain the core chip-level security design principles: isolation, immutable trust anchor, secure lifecycle states, standardized trust services
- Describe ARM PSA's four-stage framework: Analyze, Architect, Implement, Certify
- Explain the PSA Firmware Framework (PSA-FF): SPE/NSPE split, Secure Partitions, and the Secure Partition Manager (SPM)
- Compare PSA Certified assurance levels (1, 2, 3+) and what each certifies against

## Estimated Time
1-1.5 hours

## Prerequisites
- Module 05 (Secure Boot & Authentication)
- Module 27 (PUF-based HRoT Architecture)

## Module Structure
| File | Description |
|------|--------------|
| `theory.md` | PSA framework stages, PSA-FF (SPE/NSPE, Secure Partitions, SPM), certification levels |
| `whui-page.tsx` | Interactive PSA certification-level / Root-of-Trust component explorer |

## Key Topics
1. Chip-level security design principles (isolation, trust anchor, lifecycle, standardized APIs)
2. ARM PSA's Analyze/Architect/Implement/Certify framework
3. PSA-FF: SPE vs. NSPE, Secure Partitions, SPM-mediated Secure IPC
4. PSA Certified assurance levels and their evaluation depth

## References
- ARM Ltd. — *Platform Security Architecture (PSA) Overview*.
- PSA Certified — *PSA Firmware Framework (PSA-FF) Architecture Specification*.
- TrustedFirmware.org — *Trusted Firmware-M (TF-M) Documentation*.

**Further Reading (Beginner):** [Beginner Hardware Security Resources / 晶片安全入門教材與資源](../resources/hardware-security-beginner-resources.md)
