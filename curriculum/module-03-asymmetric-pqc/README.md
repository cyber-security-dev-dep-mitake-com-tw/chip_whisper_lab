# Module 03: Asymmetric Cryptography & Post-Quantum Cryptography

## Learning Objectives
- Understand RSA key generation, encryption, and digital signatures
- Explain ECC fundamentals including ECDSA, ECDH, and elliptic curve selection
- Describe key exchange protocols (Diffie-Hellman, ECDHE)
- Analyze post-quantum cryptographic schemes: lattice-based (Kyber/ML-KEM, Dilithium/ML-DSA), hash-based (SPHINCS+), code-based (McEliece)
- Navigate NIST PQC standards (FIPS 203, 204, 205)

## Estimated Time
3–4 hours

## Prerequisites
- Module 02 (Symmetric Cryptography & Hash Functions)
- Modular arithmetic (modular exponentiation, modular inverse)
- Basic linear algebra (matrix operations)

## Module Structure
| File | Description |
|------|-------------|
| `theory.md` | Detailed theory of RSA, ECC, and PQC algorithms |
| `lab-simulated.ipynb` | Interactive RSA/ECC computation, PQC parameter exploration |

## Key Topics
1. **RSA**: Key generation (prime selection, modulus), PKCS#1 v1.5 / OAEP, RSA signatures
2. **ECC**: Weierstrass curves, ECDSA, ECDH, NIST P-256/Curve25519
3. **PQC Lattice-Based**: LWE, RLWE, Module-LWE, Kyber/ML-KEM, Dilithium/ML-DSA
4. **PQC Hash-Based**: SPHINCS+, Merkle signatures
5. **PQC Code-Based**: McEliece, Goppa codes

## References
- [NIST FIPS 186-5: Digital Signature Standard](https://csrc.nist.gov/publications/detail/fips/186/5/final)
- [NIST FIPS 203: Module-Lattice-Based Key-Encapsulation Mechanism (ML-KEM)](https://csrc.nist.gov/pubs/fips/203/final)
- [NIST FIPS 204: Module-Lattice-Based Digital Signature Algorithm (ML-DSA)](https://csrc.nist.gov/pubs/fips/204/final)
- [NIST FIPS 205: Stateless Hash-Based Digital Signature Algorithm (SLH-DSA)](https://csrc.nist.gov/pubs/fips/205/final)
- [RFC 7748: Elliptic Curves for Security](https://datatracker.ietf.org/doc/html/rfc7748)
