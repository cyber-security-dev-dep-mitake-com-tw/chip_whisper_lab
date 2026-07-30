# Module 25: Quantum Tunneling PUF (量子穿隧 PUF)

## Learning Objectives
- Explain how Fowler-Nordheim tunneling through a gate oxide creates a quantum-level entropy source
- Understand why tunneling current is exponentially sensitive to atomic-scale oxide thickness variation
- Describe the oxide-breakdown ("hard breakdown") PUF architecture (enrollment, percolation path, response readout)
- Compare quantum tunneling PUFs against delay-based and memory-state PUFs on reliability, aging, and ML-attack resistance

## Estimated Time
1–1.5 hours

## Prerequisites
- Module 04 (PUF & TRNG)
- Basic semiconductor device physics (MOSFET, gate oxide)

## Module Structure
| File | Description |
|------|--------------|
| `theory.md` | Physics of F-N tunneling, oxide breakdown PUF architecture, comparison table |
| `whui-page.tsx` | Interactive simulation: adjust oxide thickness/voltage, race two cells, observe the resulting response bit |

## Key Topics
1. Quantum-level entropy vs. macroscopic process-variation entropy
2. Fowler-Nordheim tunneling and its exponential sensitivity to $T_{ox}$
3. Oxide hard-breakdown PUF architecture (e.g. NeoPUF)
4. Zero-ECC reliability, aging immunity, and ML-attack resistance

## References
- Pang, Y. D., et al. (2017). *A 16K-bit 100% reliable physical unclonable function based on gate-oxide breakdown with 0 bit-error-rate and zero-ECC requirement.* IEEE ISSCC.
- Chen, H. C., et al. (2019). *Quantum Tunneling PUF: A review of a stable, secure, and compact physical unclonable function.* IEEE Transactions on Electron Devices.

**Further Reading (Beginner):** [Beginner Hardware Security Resources / 晶片安全入門教材與資源](../resources/hardware-security-beginner-resources.md)
