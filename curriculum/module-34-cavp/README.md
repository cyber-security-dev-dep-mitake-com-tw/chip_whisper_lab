# Module 34: CAVP and Security Objectives

## Learning Objectives
- Explain the relationship between CAVP (algorithm validation) and CMVP (module/FIPS 140 certification)
- Understand Known Answer Tests (KAT), Monte Carlo tests, and the ACVP automation protocol
- Map the four core security objectives (Confidentiality, Integrity, Authentication, Availability) to hardware mechanisms
- Analyze three landmark hardware security attack case studies (Fusée Gelée, ROCA, Xbox 360 Reset Glitch)

## Estimated Time
1.5 hours

## Prerequisites
- Module 32 (FIPS 140-2 Overview)
- Module 33 (FIPS 140-3 Modern Framework)

## Module Structure
| File | Description |
|------|--------------|
| `theory.md` | CAVP mechanisms, security objectives, IC design relevance, three attack case studies |
| `whui-page.tsx` | Interactive KAT/Monte Carlo simulation with an injectable implementation-defect toggle |

## Key Topics
1. CAVP vs. CMVP dependency
2. Known Answer Tests and Monte Carlo Tests
3. ACVP automated validation protocol
4. Security objectives: Confidentiality, Integrity, Authentication, Availability
5. Case studies: Fusée Gelée, ROCA (CVE-2017-15361), Xbox 360 Reset Glitch Hack

## References
- NIST SP 800-140C — *CMVP Approved Security Functions*.
- IETF RFC 8959 — *Automated Cryptographic Validation Protocol (ACVP)*.
- Nemec, M., et al. (2017). *The Return of Coppersmith's Attack*. ACM CCS.

**Further Reading (Beginner):** [Beginner Hardware Security Resources / 晶片安全入門教材與資源](../resources/hardware-security-beginner-resources.md)
