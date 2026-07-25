# Module 22: Quantum PUF via IBM Quantum (Qiskit)

## Learning Objectives
- Understand how a Quantum PUF (QPUF) extends classical PUFs using decoherence, gate error, and readout noise as device-unique entropy sources
- Explain Von Neumann entropy $S(\rho) = -\mathrm{Tr}(\rho \ln \rho)$ and why quantum measurement is a fundamentally (not just practically) unpredictable entropy source
- Trace the entropy formalism from qubits to quantum gravity: Bekenstein-Hawking black hole entropy, Strominger-Vafa string-theory microstate counting, and the Ryu-Takayanagi holographic entanglement entropy formula
- Run and interpret a real (or simulator-fallback) IBM Quantum circuit as a QRNG, and statistically compare it against a classical PRNG
- Evaluate QPUF fingerprinting and modeling-attack resistance

## Estimated Time
3–4 hours

## Prerequisites
- Module 04 (PUF & TRNG) — especially §3.8 (Shannon, min-entropy, Boltzmann entropy)
- Module 21 (QKD Device Security)
- Basic linear algebra (density matrices, traces) and comfort with the entropy formulas from Module 04

## Module Structure
| File | Description |
|------|-------------|
| `theory.md` | QPUF design approaches, IBM Quantum/Qiskit integration, and the entropy formalism from Von Neumann entropy through black hole thermodynamics and holography |
| `lab-simulated.ipynb` | Local Qiskit/Aer-simulated QRNG, a guarded real-hardware IBM Quantum attempt with simulator fallback, and NIST-style statistical comparison against Python's `random` |

## Key Topics
1. **QPUF Entropy Sources**: Decoherence (T1/T2), gate error rates, crosstalk, readout noise
2. **QPUF Design**: Measurement-based, entanglement-based, NISQ-era fingerprinting
3. **Von Neumann Entropy**: Pure vs. mixed states, decoherence as entropy generation
4. **Quantum Gravity Entropy**: Bekenstein-Hawking entropy, Strominger-Vafa D-brane microstate counting, Ryu-Takayanagi holographic entanglement entropy (AdS/CFT)
5. **Modeling Attack Resistance**: Why quantum noise resists ML-based prediction attacks that succeed against some classical PUFs

## References
- NIST SP 800-90B: *Recommendation for the Entropy Sources Used for Random Bit Generation.* NIST, August 2012.
- Hawking, S. W. (1975). "Particle creation by black holes." *Communications in Mathematical Physics*, 43(3), 199–220.
- Strominger, A., & Vafa, C. (1996). "Microscopic origin of the Bekenstein-Hawking entropy." *Physics Letters B*, 379(1–4), 99–104.
- Ryu, S., & Takayanagi, T. (2006). "Holographic derivation of entanglement entropy from AdS/CFT." *Physical Review Letters*, 96(18), 181602.
- IBM Quantum Experience (quantum.ibm.com / qiskit.org)

**Further Reading (Beginner):** [Beginner Hardware Security Resources / 晶片安全入門教材與資源](../resources/hardware-security-beginner-resources.md)
