# QKD Device Security (SPAD Blinding, Timing SC)

## Quantum Key Distribution (QKD) Overview

QKD uses quantum mechanics (Heisenberg uncertainty, no-cloning theorem) to establish a shared secret key between two parties (Alice and Bob). The protocol guarantees that any eavesdropping attempt (Eve) introduces detectable errors.

Popular QKD protocols:
- **BB84** (Bennett & Brassard, 1984): 4 quantum states (2 bases, 2 states each)
- **E91** (Ekert, 1991): Entanglement-based, Bell inequality verification
- **Continuous-Variable (CV)** QKD: Uses coherent states, homodyne detection

## QKD Hardware Attack Surface

The theoretical security of QKD assumes perfect devices. Real devices have imperfections that can be exploited.

### SPAD (Single Photon Avalanche Diode) Blinding Attack

**Principle**: SPADs are designed to detect single photons (avalanche breakdown triggered by single photon). An attacker can "blind" the SPAD by sending bright light, forcing it into linear mode (classical photodiode behavior) instead of Geiger mode.

**Attack Steps (Makarov 2009)**:
1. Eve sends bright light pulse → SPAD becomes linear (non-Geiger)
2. Eve sends bright pulse with her own state → SPAD detects her state (not Alice's)
3. Eve monitors SPAD output (linear mode: current proportional to light intensity)
4. Bob's detection timing reveals Eve's basis choice
5. Alice and Bob establish a key where Eve has full knowledge

**Countermeasure**: Monitor SPAD current continuously and compare expected vs. observed current; implement detector gating with precise timing windows.

### Timing Side-Channels in QKD
- **Basis choice timing**: QKD source uses random basis selection; if basis selection timing reveals the choice (e.g., due to timing jitter in detector electronics), Eve can determine which measurements to trust
- **Detector efficiency mismatch**: Alice and Bob's detectors have different efficiency vs. wavelength/time characteristics; Eve can exploit this by sending light at the most efficiently detected wavelength/basis

### Photonic IC Security
Photonic integrated circuits (PICs) for QKD miniaturization introduce physical security concerns:
- On-chip waveguide routing enables side-channel access
- Optical port access enables injection of light without detection
- Anti-counterfeiting markings needed for chip authenticity verification

## Reference Papers
- Makarov, V. (2009). "Blinding attack on quantum cryptography." Physical Review A 80.
- Lydersen, L., et al. (2010). "Hacking commercial quantum cryptography systems by tailored bright illumination." Nature Photonics 4.
- Quantum Hacking: https://quantumhack.wordpress.com/
- Makarov's quantum hacking lecture slides
