# Module 40: Chip Software Attacks & Malicious Hardware Attacks (晶片軟體攻擊與惡意硬體攻擊)

## Learning Objectives
- Distinguish remote software attack vectors (buffer overflow, ROP/JOP, speculative execution) from physical malicious attacks (fault injection, invasive probing, hardware Trojans)
- Explain hardware countermeasures for software security: NX bit, Pointer Authentication (PAC/CFI), Memory Tagging Extension (MTE)
- Describe fault-injection techniques (voltage/clock glitching, laser FI, DFA) and invasive tampering (micro-probing, FIB)
- Explain hardware Trojan insertion points and trigger/payload structure
- Identify on-chip countermeasures: environmental sensors/zeroization, active shield mesh, logic redundancy/lockstep

## Estimated Time
2 hours

## Prerequisites
- Module 05 (Secure Boot & Authentication)
- Module 11 (Voltage & Clock Glitching)
- Module 17 (TEE & Microarchitecture Security)

## Module Structure
| File | Description |
|------|--------------|
| `theory.md` | Software attack vectors, microarchitectural attacks, hardware countermeasures, malicious physical attacks, on-chip defenses |
| `whui-page.tsx` | Interactive attack-surface diagram: click a component to reveal its attack technique and mitigation |

## Key Topics
1. Buffer overflow, memory corruption, ROP/JOP control-flow hijacking
2. Speculative execution attacks (Spectre/Meltdown) as software-launched microarchitectural attacks
3. NX bit, Pointer Authentication (PAC), Control Flow Integrity, Memory Tagging Extension (MTE)
4. Fault injection: voltage/clock glitching, laser FI, Differential Fault Analysis (DFA)
5. Invasive tampering: micro-probing, Focused Ion Beam (FIB)
6. Hardware Trojans: insertion points, trigger conditions, payloads
7. On-chip countermeasures: environmental sensors/zeroization, active shield mesh, dual-core lockstep

## References
- Kocher, P., et al. (2019). *Spectre Attacks: Exploiting Speculative Execution*. IEEE S&P.
- ARM Architecture Reference Manual — *Pointer Authentication and Branch Target Identification*.
- Szekeres, L., Payer, M., Wei, T., & Song, D. (2013). *SoK: Eternal War in Memory*. IEEE S&P.
- Biham, E., & Shamir, A. (1997). *Differential Fault Analysis of Secret Key Cryptosystems*. CRYPTO.
- Bhunia, S., et al. (2014). *Hardware Trojan Attacks: Threat Analysis and Countermeasures*. Proceedings of the IEEE.

**Further Reading (Beginner):** [Beginner Hardware Security Resources / 晶片安全入門教材與資源](../resources/hardware-security-beginner-resources.md)
