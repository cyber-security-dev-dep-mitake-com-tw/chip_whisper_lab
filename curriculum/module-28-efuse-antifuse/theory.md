# Module 28: eFuse vs. Anti-Fuse Storage — Theory

*(Source note: the reference document `docs/references/ch-3/eFuse vs. Anti-Fuse Storage.md` was empty in this course's source materials. This theory is compiled from standard semiconductor one-time-programmable (OTP) memory literature to fill that gap, in the same bilingual style as the other Ch3 modules — 本節內容為 eFuse 與 Anti-Fuse 之標準技術補充教材.)

## 1. Why One-Time-Programmable Storage Matters (為何需要 OTP 儲存)

Hardware roots of trust need somewhere to permanently anchor secrets — device keys, calibration trim values, chip IDs, revocation counters — that cannot be erased or rewritten by software after manufacturing. **One-Time-Programmable (OTP)** non-volatile memory answers this need with a *physical, irreversible* state change, unlike EEPROM/Flash which can be rewritten (and therefore rolled back or wiped by an attacker). The two dominant OTP primitives in modern SoCs are **eFuse** and **Anti-Fuse**.

## 2. eFuse: Programming by Destroying a Conductor

**Structure**: an eFuse is normally a narrow polysilicon or metal link with low resistance ($R_{unprogrammed}$, typically tens to a few hundred $\Omega$).

**Programming mechanism — electromigration**: a large programming current ($I_{prog}$, often tens of mA) is forced through the narrow link for a short pulse. Joule heating plus **electromigration** (current-induced migration of metal atoms) physically breaks/thins the conductor, driving its resistance up by orders of magnitude:

$$
R_{blown} \gg R_{unprogrammed} \quad (\text{often } k\Omega \text{ to } M\Omega \text{ vs. tens of } \Omega)
$$

$$
P = I_{prog}^2 \cdot R_{unprogrammed} \cdot t_{pulse}
$$

Reading the fuse compares its resistance (or the resulting voltage divider / current) against a reference to output logic `0` or `1`.

**Properties**:
- Programmable in-system, post-packaging, even in the field (given access to a programming voltage rail) — good for late-stage customization, revocation counters, or secure OTA-driven fuse blows.
- Vulnerable to **de-layering + optical/SEM inspection**: a blown eFuse link is visibly different (thinned, voided) under a microscope after removing package and metal layers, making bit-by-bit key extraction feasible with sufficient lab equipment and effort.
- Moderate cell area; well-characterized in mainstream CMOS logic processes (no special mask layers required in some cases).

## 3. Anti-Fuse: Programming by Creating a Conductor

**Structure**: an Anti-Fuse starts in the *opposite* electrical state from an eFuse — a normally **high-resistance/insulating** dielectric (a thin oxide, similar in spirit to a MOSFET gate oxide) between two conductive terminals.

**Programming mechanism — dielectric breakdown**: applying a high voltage across the dielectric causes **oxide breakdown** (the same physical phenomenon exploited by the quantum tunneling PUF in Module 25), punching a permanent low-resistance conductive filament through the insulator:

$$
R_{unprogrammed} \gg R_{programmed} \quad (\text{typically } G\Omega \text{ vs. hundreds of } \Omega \text{ to a few } k\Omega)
$$

**Properties**:
- **Higher physical security**: the programmed state is a microscopic conductive filament *inside* a dielectric layer, not an externally visible geometric change in a metal trace — making optical reverse-engineering of the programmed bit pattern significantly harder than for eFuse.
- Smaller cell size in advanced nodes (a simple two-terminal capacitor-like structure), enabling denser OTP arrays.
- Typically only programmable pre-packaging or with careful control of the high programming voltage — less commonly used for in-field, repeated, low-effort blows compared to some eFuse designs.
- Once blown, essentially irreversible and highly stable (similar aging/reliability advantages to the oxide-breakdown PUF of Module 25).

## 4. Comparison Table

| Property | eFuse | Anti-Fuse |
|---|---|---|
| Native state | Low resistance (conductive) | High resistance (insulating) |
| Programmed state | High resistance (link blown) | Low resistance (dielectric punctured) |
| Physical mechanism | Electromigration / Joule heating destroys a conductor | Dielectric (oxide) breakdown creates a conductive filament |
| Programming voltage | Moderate, current-driven | Higher voltage, field-driven |
| Reverse-engineering resistance | Lower — blown link is visible after delayering | Higher — breakdown filament is buried in the dielectric, harder to see optically |
| Cell density | Moderate | Higher (simple 2-terminal structure) |
| Typical use | Trim values, revocation counters, in-field configuration bits | Root keys, chip ID, high-value secrets requiring maximum tamper resistance |
| Process requirement | Often usable in standard logic CMOS | Sometimes needs a dedicated thin-oxide/high-voltage option |

## 5. Security Implications for Root-of-Trust Design

- **Key storage choice**: designers commonly reserve Anti-Fuse OTP for the highest-value secrets (root keys, HUK backup, device certificates) precisely because of its superior resistance to optical/SEM reverse engineering, while using eFuse for less sensitive configuration and revocation bits that may need field programmability.
- **Side-channel leakage during programming**: the programming pulse for either technology draws a distinctive, high current spike that can itself leak information (timing/power side-channel) about which bits are being blown if not masked — designs should randomize programming order or add current-shaping circuitry.
- **Read-disturb & aging**: as with SRAM PUF cells (Module 04) and TRNG designs, repeated reads or temperature extremes can, in poorly designed eFuse/anti-fuse arrays, gradually degrade the margin between programmed/unprogrammed resistance; robust designs include sense-margin monitoring.
- **Complementary to PUF**: unlike a PUF (Module 04/25), eFuse and anti-fuse store an *externally injected* secret rather than deriving one from process variation — so they remain vulnerable to key-injection supply-chain attacks that a PUF's "keyless storage" model (Module 26 §2) avoids. Many real HRoT designs use anti-fuse OTP to store PUF helper data or a backup key, combining both primitives.

## 6. References

1. Kothandaraman, C., et al. "Electrically programmable fuse (eFUSE) using electromigration in silicides." IEEE Electron Device Letters, 2002.
2. Kalter, H. L., et al. "A 50-ns 16-Mb DRAM with a 10-ns data rate and on-chip ECC." IEEE JSSC (background on antifuse OTP arrays in memory/OTP macros).
3. Sasaki, Y., et al. "Antifuse-based field-programmable structures for secure applications." IEEE Trans. VLSI, various.
4. Same physical oxide-breakdown mechanism as Module 25 (Quantum Tunneling PUF) §2–3 — F-N tunneling and hard breakdown.
5. NIST SP 800-193 — *Platform Firmware Resiliency Guidelines* (OTP as an immutable root-of-trust anchor).
