# Module 42: Advanced Side-Channel Hiding Countermeasures — Shuffling, Clock Jitter & Dual-Rail Logic (旁路攻擊隱藏防禦技術：亂序、時脈抖動與雙軌邏輯)

## Learning Objectives
- Explain operation shuffling (random permutation of independent crypto sub-operations) and why it defeats trace time-alignment
- Distinguish time-domain hiding (random clock jitter, dummy operations) from amplitude/power-domain hiding (dual-rail pre-charge logic, power equalizers)
- Explain why Dual-Rail Pre-charge Logic (WDDL/SABL) forces constant power consumption regardless of processed data
- Articulate the conceptual difference between hiding countermeasures and masking, and why high-assurance chips combine both

## Estimated Time
1-1.5 hours

## Prerequisites
- Module 06 (SCA Theory: SPA/DPA/CPA)
- Module 10 (SCA Countermeasures)

## Module Structure
| File | Description |
|------|--------------|
| `theory.md` | Shuffling mechanics, time-domain hiding, amplitude/power-domain hiding (dual-rail logic, power equalizers), hiding vs. masking |
| `whui-page.tsx` | Interactive power-trace simulator: toggle shuffling/clock-jitter/dual-rail and see the effect on trace alignment and DPA correlation |

## Key Topics
1. Operation shuffling (Fisher-Yates-style random permutation) and temporal misalignment
2. Random clock jitter / frequency hopping
3. Dummy operations / random delay insertion
4. Dual-rail pre-charge logic (WDDL/SABL): pre-charge + evaluation phases forcing constant power
5. Power equalizers and on-chip decoupling capacitors
6. Hiding vs. masking as complementary defense classes

## References
- Mangard, S., Oswald, E., & Popp, T. (2008). *Power Analysis Attacks: Revealing the Secrets of Smart Cards*. Springer.
- A Hardware-Friendly Shuffling Countermeasure Against Side-Channel Attacks for Kyber.
- Kris Chapman, et al. *Designing DPA-Resistant CMOS Circuits*.

**Further Reading (Beginner):** [Beginner Hardware Security Resources / 晶片安全入門教材與資源](../resources/hardware-security-beginner-resources.md)
