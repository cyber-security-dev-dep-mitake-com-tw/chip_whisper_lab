# Module 25: Quantum Tunneling PUF (量子穿隧 PUF) — Theory

## 1. Introduction

### 1.1 From Macroscopic Variation to Quantum-Level Entropy

Earlier PUF primitives — SRAM PUF, arbiter PUF — rely on tiny differences in **macroscopic electrical characteristics**: transistor threshold voltage ($V_{th}$) or signal propagation delay. As semiconductor process nodes shrink, environmental noise increasingly disturbs these macroscopic characteristics, forcing traditional PUFs to spend significant computation on error-correcting codes (ECC) just to stabilize a key.

A **Quantum Tunneling PUF** pushes the entropy source down to the deepest layer of physics available in silicon: **quantum-mechanical, atomic-scale randomness**. It exploits the extremely thin gate oxide layer in modern CMOS processes, using either the probabilistic nature of electron tunneling through the insulator, or the random physical phenomenon of oxide breakdown, to generate a chip fingerprint that cannot be replicated even by the foundry that made the chip.

## 2. Physical Mechanism: Oxide Thickness and Quantum Tunneling

In quantum mechanics, when an electron encounters an energy barrier (such as the SiO₂ gate insulator of a MOSFET), it has a nonzero probability of "tunneling" through even though its energy is lower than the barrier — producing a small leakage current. This is **Fowler-Nordheim tunneling (F-N tunneling)**.

The tunneling current follows the Fowler-Nordheim relation:

$$
J_{FN} = A E_{ox}^2 \exp\left(-\frac{B}{E_{ox}}\right)
$$

where $E_{ox} = V_{ox}/T_{ox}$ is the electric field across the oxide, $T_{ox}$ is the physical oxide thickness, and $A$, $B$ are material-dependent constants. The tunneling current is **exponentially sensitive** to $T_{ox}$:

$$
I_{tunneling} \propto \exp\left(-\frac{B \cdot T_{ox}}{V_{ox}}\right)
$$

- **Atomic-scale variation**: in advanced process nodes the gate oxide may be only a few nanometers thick. During manufacturing, unavoidable roughness at the oxide surface produces random fluctuations on the order of a **single atomic layer** (~0.3 nm).
- **Exponentially amplified randomness**: even a one-atom-thick difference in $T_{ox}$ causes an order-of-magnitude swing in tunneling current. This atomic-arrangement randomness cannot be controlled or replicated even by the foundry, making it an excellent unpredictable entropy source.

## 3. Architecture: Oxide Breakdown (Hard Breakdown) Implementation

The most commercially successful quantum tunneling PUF technology exploits **hard breakdown** of the gate oxide (e.g. the NeoPUF technology from Taiwan's eMemory).

1. **Enrollment (challenge/stress phase)**: The system applies a high voltage simultaneously to two adjacent, nominally identical transistors in the PUF cell. Under the strong electric field, electrons accumulate randomly as **traps** in the oxide via quantum tunneling.
2. **Random percolation path**: Because of atomic-scale variation in oxide thickness and the quantum-random distribution of traps, one of the two transistors' oxide forms a conductive path first (breaks down) — a permanent, microscopic structural change — while the other remains insulating. This is a "winner-take-all" race.
3. **Response readout**: The broken-down transistor and the intact transistor differ in read current by more than $10^4\times$. The circuit simply compares the two currents to output a stable logic `0` or `1`.

$$
\text{Response bit} = \begin{cases} 1 & I_{read}(\text{cell A}) \gg I_{read}(\text{cell B}) \\ 0 & \text{otherwise} \end{cases}
$$

## 4. Key Advantages

| Property | Traditional (delay / memory-state) PUF | Quantum Tunneling PUF |
|---|---|---|
| Reliability | 90–99%, needs ECC / helper data | Near 100%, often **zero-ECC** |
| Aging | Degrades (e.g. NBTI in SRAM PUF) | Immune — breakdown is a permanent physical change |
| Environmental sensitivity | Sensitive to temperature/voltage | Very low sensitivity — an already-ruptured dielectric doesn't "un-rupture" |
| ML-modeling resistance | Arbiter PUF vulnerable to modeling attacks | High — underlying randomness has no linear/mathematical structure to learn |

1. **Near-100% reliability (Zero-ECC)**: oxide breakdown is irreversible physical damage (a permanent change in covalent bond structure at the microscopic level), so the resulting 0/1 state is extremely stable and largely immune to temperature extremes, voltage fluctuation, or EMI. Many implementations skip ECC entirely.
2. **Aging immunity**: SRAM PUF degrades over the chip's lifetime (e.g. NBTI effects raise the bit error rate). A quantum tunneling PUF's state, once established, is unaffected by standard aging mechanisms.
3. **Resistance to ML attacks**: because the underlying logic derives from quantum probability and atomic-scale defect distribution rather than macroscopic linear delay relationships, an attacker cannot practically build a predictive mathematical model of the output (unlike arbiter PUFs).

## 5. References

1. Pang, Y. D., et al. (2017). *A 16K-bit 100% reliable physical unclonable function based on gate-oxide breakdown with 0 bit-error-rate and zero-ECC requirement.* IEEE ISSCC. — First industry demonstration of a 100%-stable, zero-ECC quantum-tunneling-type PUF via oxide breakdown.
2. Chen, H. C., et al. (2019). *Quantum Tunneling PUF: A review of a stable, secure, and compact physical unclonable function.* IEEE Transactions on Electron Devices.
3. NIST — discussion of next-generation hardware security roots of trust, emphasizing high-reliability PUFs with reduced helper-data dependence for IoT security.
