# Module 28: eFuse vs. Anti-Fuse Storage

## Learning Objectives
- Compare eFuse (electromigration-based) and Anti-Fuse (dielectric-breakdown-based) OTP programming mechanisms
- Explain why Anti-Fuse offers stronger resistance to optical/SEM reverse engineering than eFuse
- Understand the resistance-state comparison and typical use cases for each technology
- Relate anti-fuse dielectric breakdown to the oxide-breakdown mechanism used by quantum tunneling PUFs (Module 25)

## Estimated Time
1 hour

## Prerequisites
- Module 04 (PUF & TRNG)
- Basic semiconductor device physics

## Module Structure
| File | Description |
|------|--------------|
| `theory.md` | eFuse and Anti-Fuse physical mechanisms, comparison table, security implications |
| `whui-page.tsx` | Interactive cross-section simulation: program an eFuse or Anti-Fuse and observe the resistance/state change |

## Key Topics
1. eFuse: electromigration-driven conductor destruction
2. Anti-Fuse: dielectric-breakdown-driven conductor creation
3. Reverse-engineering resistance comparison
4. Security implications for root-of-trust key storage

## References
- Kothandaraman, C., et al. "Electrically programmable fuse (eFUSE) using electromigration in silicides." IEEE Electron Device Letters, 2002.
- NIST SP 800-193 — *Platform Firmware Resiliency Guidelines*.

**Note:** the corresponding source reference document was empty in this course's materials; this module's theory was compiled from standard OTP-memory literature to fill the gap (see `theory.md` header note).

**Further Reading (Beginner):** [Beginner Hardware Security Resources / 晶片安全入門教材與資源](../resources/hardware-security-beginner-resources.md)
