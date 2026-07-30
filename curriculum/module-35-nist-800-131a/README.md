# Module 35: NIST SP 800-131A - Algorithm and Key Transitions

## Learning Objectives
- Understand the "security strength" metric (bits) and its relationship to attacker work factor
- Know the retirement schedule for symmetric, asymmetric, and hash algorithms under NIST SP 800-131A
- Explain why hardware crypto IP must be trimmed of deprecated algorithms (DES, SHA-1, 1024-bit RSA)
- Apply future-proofing reasoning for long-service-life chips (automotive, IIoT)

## Estimated Time
1 hour

## Prerequisites
- Module 02 (Symmetric Crypto & Hash Functions)
- Module 03 (Asymmetric & PQC)

## Module Structure
| File | Description |
|------|--------------|
| `theory.md` | Security strength metric, algorithm/key-length retirement schedule, IC design impact |
| `whui-page.tsx` | Interactive crypto-stack builder computing overall security strength from symmetric/asymmetric/hash choices |

## Key Topics
1. Security strength (bits) and work-factor estimation
2. Symmetric algorithm transitions (2TDEA/3TDEA → AES)
3. Asymmetric transitions (1024-bit RSA → 2048/3072/4096-bit RSA, ECC P-256)
4. Hash function transitions (SHA-1 → SHA-2/SHA-3)
5. Future-proofing hardware for long product life cycles

## References
- NIST SP 800-131A Revision 2 — *Transitioning the Use of Cryptographic Algorithms and Key Lengths*.
- NIST SP 800-57 Part 1 Revision 5 — *Recommendation for Key Management: Part 1 – General*.

**Further Reading (Beginner):** [Beginner Hardware Security Resources / 晶片安全入門教材與資源](../resources/hardware-security-beginner-resources.md)
