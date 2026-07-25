# Quantum PUF (QPUF) via IBM Quantum

## Physical Unclonable Functions (PUFs)

A PUF is a hardware primitive that exploits manufacturing variations (process variation) to create a unique, unclonable identifier. Classical PUFs include:
- **SRAM PUF**: SRAM startup power-up values are unique per chip
- **Ring Oscillator PUF (RO-PUF)**: Oscillator frequency depends on process variation
- **Arbiter PUF**: Signal propagation delay through arbiters is unique
- **Buskeeper PUF**: Buskeeper inverter behavior is unique

## Quantum PUF (QPUF) Concept

A QPUF exploits **quantum mechanical phenomena** as the source of unclonable randomness:

### Entropy Sources
1. **Decoherence time (T1/T2)**: The rate at which qubits lose quantum state depends on the specific manufacturing process
2. **Quantum gate error rates**: Gate operation fidelity varies per qubit due to manufacturing imprecision
3. **Crosstalk**: Qubit coupling strengths are unique to each chip layout
4. **Readout noise**: Measurement noise characteristics vary per qubit

### QPUF Design Approaches
1. **Measurement-based QPUF**: Send a fixed set of quantum circuits; measure T1/T2 and gate error rates; hash results to produce the ID
2. **Entanglement-based QPUF**: Entangle two qubits; measure Bell pair correlation is unique per chip
3. **NISQ-era QPUF**: Use near-term noisy quantum hardware (IBM Quantum) to create QPUF fingerprints

## IBM Quantum Experience for QPUF

### Using IBM Quantum (Qiskit)
IBM Quantum allows free access to real quantum processors through Qiskit:

```python
from qiskit import QuantumCircuit, execute, IBMQ

IBMQ.load_account()  # Login to IBM Quantum
provider = IBMQ.get_provider(hub='ibm-q')
backend = provider.get_backend('ibmq_armonk')  # 1-qubit device

# QPUF circuit: measure T1/T2 variability across multiple qubits
qc = QuantumCircuit(1, 1)
qc.h(0)  # Hadamard to create superposition
qc.measure(0, 0)

# Run on real quantum hardware (multiple shots)
job = execute(qc, backend, shots=8192)
result = job.result()
counts = result.get_counts()

# The distribution over 0/1 is noisy due to T1/T2 and gate errors
# This noise is unique to each quantum processor chip
# Hash the noise distribution to create a QPUF ID fingerprint
```

### QPUF Fingerprinting
1. Run identical quantum circuits on a specific quantum processor
2. Collect results (counts distribution)
3. Use the counts to produce a "device fingerprint" hash
4. Compare fingerprint across sessions/runs to detect spoofing

### Modeling Attack Resistance (Anti-Training)
Attackers might try to train a model to predict QPUF outputs:
1. **QPUF design should resist ML modeling**: Use the noise as a source of unpredictability
2. **Challenge-response pairs**: QPUF challenge → quantum circuit → qubit readout as response
3. **Unpredictable noise**: Quantum noise (T1/T2 fluctuations) changes over time, making modeling attacks difficult

## References
- NIST PUF standardization efforts
- IBM Quantum Experience (qiskit.org)
- Quantum random number generation literature
- Recent QPUF research papers (ISCA, MICRO, DAC)
