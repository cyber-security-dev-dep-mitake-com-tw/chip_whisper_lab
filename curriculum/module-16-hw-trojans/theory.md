# Hardware Trojans (Supply Chain Security)

## What Are Hardware Trojans?

A **Hardware Trojan** is malicious, intentionally inserted logic into an IC design that activates under specific conditions to cause unintended behavior. Unlike software malware, hardware Trojans persist in the silicon itself, making them extremely difficult to detect after manufacturing.

## Attack Chain

### Where Trojans Are Inserted
1. **Design Phase**: Third-party IP cores with embedded Trojans
2. **Synthesis**: Compromised EDA toolchain inserts malicious logic
3. **Place & Route**: Layout modifications in untrusted foundry
4. **Mask Fabrication**: Trojan masks in foundry photomasks
5. **Post-Fabrication**: FIB modification after manufacturing

### Trojan Trigger Mechanisms
- **Key-based**: Activates when specific register values appear
- **Counter-based**: Fires after N specific CPU cycles
- **Temperature-based**: Activates at specific temperature ranges
- **Time-based**: Activates after a specific time period (time bomb)
- **State-based**: Fires when CPU reaches specific internal state

### Trojan Payloads
- **Information leakage**: Exfiltrate keys via side channels
- **Logic modification**: Bypass security checks, install backdoors
- **Denial of Service (DoS)**: Corrupt computation, crash system
- **Degradation**: Reduce performance, shorten lifespan

## Trojan Detection Techniques

### 1. Logic Testing
- Apply test vectors to detect Trojan-induced logic differences
- Limitation: Trojan must be activated by test input; dormant Trojans evade detection

### 2. Side-Channel Analysis
- Measure power consumption, EM radiation, timing
- Trojan circuits create detectable signatures during activation
- Requires Golden reference IC for comparison (ideal but often unavailable)

### 3. Optical Inspection
- High-resolution microscopy of die surface
- Layer-by-layer de-capsulation and imaging
- Detection of added logic (larger die area, unusual routing)

### 4. Destructive Analysis
- Delayering with FIB/SEM for cross-sectional imaging
- Identify unexpected transistors or connections
- Expensive and destroys the chip

## Trust-Hub.org Benchmarks

Trust-Hub (https://trust-hub.org) provides the industry-standard Hardware Trojan benchmark suite:
- **RS232 Trojan**: Simple serial data exfiltration Trojan
- **AES Trojan**: Key exfiltration during AES encryption
- **Trojan models**: Verilog/VHDL source with trigger and payload
- **Detection testbenches**: Framework for evaluating detection techniques
- **Benchmark metrics**: Detection rate, false positive rate

## Counterfeit IC Inspection

### Counterfeit IC Attack
1. Source genuine ICs (end-of-life parts, military-grade)
2. Strip original markings (chemical, mechanical, or laser ablation)
3. Reprint with fake part numbers (higher grade, higher price)
4. Sell as genuine parts in supply chain

### Detection Methods
1. **Marking Verification**: Compare markings to manufacturer database
2. **Decapsulation + Die Photography**: Verify die matches genuine part
3. **Trace Matching**: Compare wire bonding pattern to reference
4. **Electrical Testing**: Verify datasheet parameters match

## Supply Chain Security

### Secure Provisioning
1. **Secure fab access**: Trusted fabrication partners with verified process
2. **Die-level authentication**: Unique die identifiers (ID) verified at packaging
3. **Key injection**: Cryptographic keys injected in secure environment
4. **Certificate chain**: Document provenance from foundry to OEM

### Intermediate Person (IP) Attack Mitigation
1. **Tamper-evident packaging**
2. **Chain of custody documentation**
3. **Die-level authentication markers**
4. **Supply chain security standards (TIA-4906)**

## References
- Tehranipoor, M., & Koushanfar, F. (2010). "A Survey of Hardware Trojan Taxonomy and Detection." IEEE Design & Test of Computers.
- Tehranipoor, M., et al. (2011). Introduction to Hardware Security and Trust. Springer.
- Trust-Hub: https://trust-hub.org/
- NSF HW-SBD Program reports
