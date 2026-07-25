# Module 02: Symmetric Cryptography & Hash Functions

## Learning Objectives
- Understand AES key schedule and operations (SubBytes, ShiftRows, MixColumns, AddRoundKey)
- Compare block cipher modes of operation (ECB, CBC, CTR, GCM) and their security properties
- Analyze the SHA-2 family (SHA-256, SHA-512) and SHA-3/Keccak sponge construction
- Implement HMAC using hash functions and understand its security proof
- Work with AES S-box and MixColumns operations mathematically

## Estimated Time
3–4 hours

## Prerequisites
- Module 00 (Environment Setup)
- Module 01 (Chip Security Landscape)
- Basic modular arithmetic and finite field math

## Module Structure
| File | Description |
|------|-------------|
| `theory.md` | Detailed theory of AES, modes, SHA-2/SHA-3, HMAC |
| `lab-simulated.ipynb` | Interactive AES/S-box computation, SHA verification, HMAC implementation |

## Key Topics
1. **AES Algorithm**: 128/192/256-bit keys, 10/12/14 rounds, S-box, MixColumns GF(2⁸) math
2. **Modes of Operation**: ECB (insecure), CBC (IV-dependent), CTR (parallelizable), GCM (authenticated)
3. **SHA-2 Family**: Merkle-Damgård construction, compression functions
4. **SHA-3/Keccak**: Sponge construction, permutation-based design
5. **HMAC**: Keyed-hash message authentication, security proof

## References
- [NIST FIPS 197: AES](https://csrc.nist.gov/publications/detail/fips/197/final)
- [NIST FIPS 180-4: SHA-2](https://csrc.nist.gov/publications/detail/fips/180/4/final)
- [NIST FIPS 202: SHA-3](https://csrc.nist.gov/publications/detail/fips/202/final)
- [RFC 2104: HMAC](https://datatracker.ietf.org/doc/html/rfc2104)
