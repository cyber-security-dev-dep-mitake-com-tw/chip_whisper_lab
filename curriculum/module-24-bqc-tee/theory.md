# Blind Quantum Computing (BQC) + TEE

## Blind Quantum Computing (BQC)

BQC allows a client to delegate quantum computation to a quantum server such that the server learns nothing about the client's input, algorithm, or output. The client only needs to prepare single-qubit states and measure results.

### Universal Blind Quantum Computation
Based on measurement-based quantum computing (MBQC):
1. **Client** prepares single-qubit states (secretly prepared)
2. **Client** sends qubits to **server** (entanglement performed on server side)
3. **Server** performs measurements as directed by client's classical instructions
4. **Client** receives results and decrypts/classically post-processes

### BQC + Classical TEE (Intel TDX / ARM TrustZone)
To protect the quantum instruction generation in a quantum cloud service:
1. **Classical TEE (Normal World)**: Run the classical part of BQC protocol (qubit state preparation, measurement instruction generation)
2. **TEE enclave (Secure World)**: The BQC protocol client runs inside a TEE enclave, ensuring that even a compromised OS cannot observe the quantum computation inputs
3. **Quantum server**: Receives encrypted/qubit states from TEE, performs MBQC, returns results
4. **TEE verifies**: Result correctness can be verified via interactive protocols or blind computation verification

### Measurement-Based Quantum Computation (MBQC)
MBQC is the standard model for BQC:
1. Prepare a highly entangled cluster state (resource state)
2. Perform individual qubit measurements in specific bases (dictated by previous measurement outcomes)
3. Flow of information: Each measurement outcome affects future measurement bases (adaptive measurements)
4. Computation proceeds by the pattern of measurements, not by unitary gates

### Delegated Quantum Computation Security
Protocols for verifying that the quantum server performed the correct computation:
1. **Trap qubits**: Insert "trap" qubits that the client knows the expected result of; if server cheats, traps reveal this
2. **Verification via entanglement**: Use entanglement-based verification of the resource state
3. **Blind computation verification**: Client randomly inserts verification rounds that test server's honesty

## Practical BQC + TEE with Qiskit & OP-TEE QEMU

### Setup with OP-TEE QEMU
1. Build and run OP-TEE QEMU (for ARM TrustZone simulation): https://github.com/OP-TEE/optee_os
2. Build the Trusted Application (TA) for BQC client protocol
3. OP-TEE QEMU simulates the Secure World (TA) and Normal World (rich OS)
4. Test that the TA can generate BQC instructions without being observed by the Normal World

### Quantum BQC Protocol Steps
1. **Client** (inside TEE secure world) creates BQC instructions: prepares qubit states with random rotations
2. **Client** sends qubits to quantum server (via quantum network or simulated channel)
3. **Server** builds cluster state, performs measurements per client's protocol
4. **Server** returns measurement results
5. **Client** post-processes results inside TEE secure world
6. **TEE** provides attestation that the client ran correctly

## References
- Fitzsimons, A. K., et al. (2017). Unconditionally Verifiable Blind Quantum Computing. npj Quantum Information.
- Morimae, T., & Fujii, K. (2013). Blind Quantum Computing Protocol Based on Universal Quantum Computation. Scientific Reports.
- Confidential Computing Consortium (CCC) whitepaper: https://confidentialcomputingconsortium.org/
- OP-TEE QEMU: https://github.com/OP-TEE/optee_os
- Qiskit BQC tutorials
