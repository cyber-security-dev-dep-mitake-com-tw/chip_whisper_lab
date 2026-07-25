# Fault Analysis Models & Defenses (DFA)

## Differential Fault Analysis (DFA)

### Principle
DFA compares correct and faulty cryptographic outputs to recover the secret key. Unlike CPA (which uses power traces, a passive technique), DFA uses the actual difference between correct and faulty outputs as the primary signal.

### Attack Steps for AES-128

1. **Obtain a correct ciphertext pair**
   Encrypt plaintext P with key K to get correct ciphertext C = AES(P, K).

2. **Inject a fault during encryption**
   Fault at round N causes incorrect ciphertext C* = AES_faulty(P, K).

3. **Compute output difference**
   ΔC = C ⊕ C* (XOR of correct and faulty ciphertext).

4. **Analyze differential characteristics**
   The expected differential ΔC depends on the fault location and the key byte(s) involved.

5. **Recover key candidates**
   For each key byte hypothesis, check if the expected differential matches the observed ΔC.
   Filter candidates using additional (correct, faulty) pairs.

6. **Repeat for remaining key bytes**
   A single well-placed fault can recover 16+ key bytes of AES-128.

### AES DFA Concrete Example

A single fault at the final round input of AES-128:
- The fault propagates through InvShiftRows and InvSubBytes
- Each byte of the state can be analyzed independently for key byte recovery
- Complexity drops from 2^128 brute force to ~2^15 operations per recovered byte

## Countermeasures

### Lockstep (Duplicate Logic)
- Run duplicate logic paths with comparison at each step
- Detects Single Event Upsets (SEUs) from radiation or voltage glitches
- Adds ~100% area overhead

### Redundancy (Multiple Sensors)
- Multiple sensors for the same security-critical value
- Majority voting to detect tampering
- Can detect faults that survive clock/voltage glitching

### Time Redundancy
- Duplicate computation and compare results
- Adds computational overhead but provides fault detection
- Used in high-security TPM and smartcard implementations

### Countermeasure Limitations
- DFA is resistant to many standard countermeasures
- Active shields and tamper detection provide strongest defense
- Combining defenses (layered approach) is recommended

## References
- O'Flynn, C. & Chen, Z.D. (2021). The Hardware Hacking Handbook. Chapters 8-9.
- Riscure Fault Injection Testing Guidelines.
- Barenghi, A., et al. "Fault Attacks against AES: A Unified View." Journal of Cryptographic Engineering.
