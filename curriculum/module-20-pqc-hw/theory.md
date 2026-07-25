# PQC Hardware Acceleration & SCA/FIA on PQC

## NIST PQC Standards Overview

NIST selected four PQC algorithms in 2024:
- **FIPS 203 (ML-KEM, Kyber)**: Key Encapsulation Mechanism (KEM), lattice-based
- **FIPS 204 (ML-DSA, Dilithium)**: Digital Signature, lattice-based
- **FIPS 205 (SLH-DSA, SPHINCS+)**: Digital Signature, hash-based (stateless)
- **FIPS 206 (FN-DSA, FN-DSA)**: Future additional signatures

## PQC vs Classical Crypto Operations

| Component | Classical (RSA/AES) | PQC (Kyber/Dilithium) |
|-----------|---------------------|-----------------------|
| Core operation | Modular exponentiation | Polynomial multiplication (NTT/NTT⁻¹) |
| Key size | 256-4096 bits | 800-1600 bytes (Kyber) |
| Ciphertext size | Fixed | Variable (2x key size typically) |
| Hardware complexity | Simple (big int math) | Complex (polynomial NTT, FFT-like) |
| Leakage profile | Simple power profile | Complex multi-round leakage |

## PQC Hardware Acceleration on IoT

### pqm4 (PQC on ARM Cortex-M4)
https://github.com/PQClean/pqm4

Open-source implementation reference for running PQC algorithms on low-power microcontrollers:
- ARM Cortex-M4 as target architecture
- Optimized for flash/RAM-constrained MCUs
- Assembly-level optimization for Cortex-M4 DSP extensions
- Benchmarks for Kyber, Dilithium, SPHINCS+

### Hardware Acceleration Approaches
1. **ASIC**: Dedicated silicon for NTT/INV-NTT butterfly operations
2. **FPGA**: Reconfigurable polynomial multiplier (DSP slice based)
3. **Microcontroller**: Software-optimized with CMSIS-DSP NEON-like macros

### Kyber on Cortex-M4 (Hardware Acceleration Ideas)
- NTT butterfly: multiply-accummulate using CMSIS-DSP `arm_mult_q31`
- NTT in-place: reduces RAM usage from O(n) to O(1) extra
- Number-theoretic transform (NTT) over Z_q with q = 3329 (Kyber-512)
- Root of unity: ζ = 17 (primitive 256th root in Z_3329)

## PQC Side-Channel and Fault Attack Analysis

### SCA on PQC Operations
PQC algorithms are vulnerable to classic SCA techniques:

1. **NTT leakage**: Polynomial multiplication involves many multiply-accumulate operations. Each butterfly operation has a data-dependent power profile.

2. **SHA-3/SHAKE leakage**: Both ML-KEM and ML-DSA use SHA-3 (Keccak) as the hash function. Keccak has a complex permutation with data-dependent XOR/AND operations that create distinguishable leakage peaks.

3. **Number of power traces**: Due to larger key and ciphertext sizes (compared to AES), more traces are needed to recover PQC key material. Kyber-512 key is ~800 bytes vs AES-128 key of 16 bytes.

### FIA on PQC
Fault injection attacks on PQC:
1. **Fault during NTT**: Inject glitch during polynomial multiplication to corrupt one coefficient
2. **Result analysis**: Compare faulty ciphertext to expected to recover private key via DFA
3. **Dilithium signature fault**: Inject fault during signing to extract private key from fault signature

### Practical PQC SCA with ChipWhisperer

Lab exercise approach:
1. Compile pqm4 Kyber-512 for ARM Cortex-M4
2. Flash to target, power ChipWhisperer-Lite
3. Capture ~100K power traces during kyber_decaps (most leakage)
4. Run CPA with HW leakage model targeting polynomial coefficients
5. Observe partial key recovery (few bytes at a time)
6. Compare to classical AES CPA for trace efficiency

## References
- pqm4: https://github.com/PQClean/pqm4
- NIST FIPS 203 (ML-KEM), FIPS 204 (ML-DSA), FIPS 205 (SLH-DSA)
- PQCrypto conference proceedings
- ZPrize competitions (zprize.org) for PQC FPGA/ASIC acceleration
