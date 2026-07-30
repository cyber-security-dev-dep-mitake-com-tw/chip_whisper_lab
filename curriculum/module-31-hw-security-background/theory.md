# Module 31: Background of Hardware Security (硬體安全的背景與演進) — Theory

## 1. Paradigm Shift: From Software Protection to Hardware Trust

Traditional information security architecture concentrated heavily on the software layer: antivirus, firewalls, OS permission control, and software cryptographic protocols (e.g. TLS). All of these protections rest on an unproven assumption: **the underlying hardware will faithfully and securely execute software instructions.**

But hardware is the entire computing system's "Layer 0." Once the underlying hardware is tampered with or has a physical vulnerability, the cryptographic protection, memory isolation, and access control built by software above it collapse instantly. As attack techniques evolved, attackers increasingly found it more effective to attack the physical layer or microarchitecture directly than to confront mature software defenses head-on.

## 2. Driving Force: The Globalized, Fragmented IC Supply Chain

The main force turning hardware security into its own ecosystem is the structural change in the modern semiconductor supply chain.

Early Integrated Device Manufacturers (IDMs) held complete internal control from design through manufacturing to packaging — security risk was relatively contained. Modern IC production, however, relies heavily on the **fabless model** and global division of labor:

1. **Third-party IP**: an SoC integrates IP cores (CPU, DSP, crypto engines) from suppliers worldwide; a design house can't line-by-line verify every external IP for hidden backdoors.
2. **Outsourced foundry**: design files (GDSII) are sent to overseas foundries. In a manufacturing environment without full trust, a design can be stolen or maliciously altered with extra logic gates.
3. **Outsourced assembly and test (OSAT)**: packaging/test stages face risks of chip substitution, overproduction, or unauthorized reading of test keys.

This long, multi-stakeholder supply chain means "hardware trust" is no longer a given — it must be secured through rigorous technical specifications and security standards.

## 3. Taxonomy of Hardware Threats

The industry faces four core categories of physical threat:

- **Hardware Trojans (HT)**: maliciously inserted covert circuitry during IC design or mask fabrication. A Trojan typically has a **trigger** and a **payload**. It stays dormant (to evade factory test) until a specific condition is met (a counter value, an external signal), then alters logic, leaks a key, or crashes the system.
- **Side-Channel Attacks (SCA)**: instead of attacking the cryptographic algorithm's math, the attacker monitors physical "leakage" during a chip's cryptographic operation — power consumption (power analysis), electromagnetic radiation (EM analysis), or timing differences — and uses statistical methods to recover the internal private key.
- **Reverse Engineering & IP Piracy**: attackers use chemical etchants to delayer a chip's package, then image every metal layer via SEM to reconstruct the netlist. Beyond IP loss, this also helps attackers find physical vulnerabilities.
- **Counterfeiting & Overproduction**: a malicious foundry produces extra chips from a customer's mask without authorization ("ghost ICs") into the gray market, or recycles e-waste chips, re-marking them as new higher-spec parts — a fatal reliability risk for defense, aerospace, or medical equipment.

## 4. Characteristic of Hardware Vulnerabilities: Extremely High Repair Cost

Software vulnerabilities are usually fixed quickly via a patch or OTA update. Hardware, however, is physically **immutable**. If a physical-layer security flaw or hardware Trojan is discovered after tape-out, it is nearly impossible to patch perfectly in software — even a software workaround often comes with severe performance penalties. The only thorough fix is a costly, months-long **re-spin** (redesign and re-tapeout). This is why the hardware security ecosystem's core demand is **"Security by Design"** — introducing security verification and protection from the earliest architecture-planning stage.

## 5. The Hardware Security Ecosystem's Stakeholders

Facing threats that software alone cannot patch, the global semiconductor industry recognized that no single player can secure the end product alone. This drove the emergence of a multi-stakeholder **hardware security ecosystem**:

- **Security IP providers**: develop and provide validated HRoT, PUF, and tamper-resistant crypto engine modules.
- **EDA vendors**: integrate security-verification tools (information-flow tracking, hardware Trojan detection, side-channel leakage simulation) into the standard chip design flow.
- **Foundries & OSATs**: establish secure manufacturing environments and zero-touch provisioning flows, ensuring key injection and feature extraction stages aren't eavesdropped on.
- **Independent test labs & certification bodies**: provide third-party security assessment (Common Criteria, FIPS 140-3 labs), certifying an IC's attack resistance.

## 6. Security-by-Design & the Secure Hardware Development Lifecycle

To eliminate vulnerabilities at the source, the IC design industry embedded security engineering into the traditional ASIC/SoC development flow, forming a **Secure Hardware Development Lifecycle (Secure HDLC)**.

The traditional PPA (Performance, Power, Area) design metric expands to **PPAS** (Performance, Power, Area, **Security**):

- **Specification**: requires threat modeling — enumerating attack vectors for the IC's intended use case and defining corresponding security requirements (e.g. must it resist laser fault injection?).
- **RTL design**: developers follow secure hardware coding guidelines, avoiding common hardware flaws (e.g. sensitive registers not cleared on reset, conditional branches causing timing leakage).
- **Pre-silicon verification**: before tape-out, formal verification confirms security isolation boundaries hold, and simulation evaluates side-channel leakage risk.

## 7. Regulation & Standards: A Strong Driver of Ecosystem Growth

The rapid growth of the hardware security ecosystem owes much to the enforcement power of international regulation and standards. As IoT, V2X, and critical infrastructure proliferate, governments and industry alliances no longer tolerate network-connected devices lacking a hardware trust foundation.

| Standard/Program | Focus |
|---|---|
| MITRE Hardware CWE | Extends the CWE list to catalog hardware design weaknesses (e.g. CWE-1189: improper isolation) — a shared vocabulary for the ecosystem |
| ISO/SAE 21434 | Mandates rigorous cybersecurity risk assessment (TARA) for automotive chip design, driving universal HSM integration into automotive MCUs |
| NIST IR 8259 / ETSI EN 303 645 | Requires connected consumer/industrial IoT devices to have hardware-level secure boot and encrypted storage |

## 8. Forward-Looking Defense Programs: From Reactive Patching to Active Defense

Beyond commercial standards, national defense and academia invest heavily in next-generation hardware architecture security. For example, DARPA's **SSITH program** (System Security Integration Through Hardware and Firmware) aims to defend, at the microarchitecture level (e.g. via the RISC-V ISA), against all seven common classes of software vulnerability (buffer overflow, privilege escalation, etc.) — marking hardware security's ultimate goal: hardware should not merely protect its own keys, but actively provide an unshakeable execution environment for all software above it.

## 9. References

1. Tehranipoor, M., & Koushanfar, F. (2010). *A Survey of Hardware Trojan Taxonomy and Detection*. IEEE Design & Test of Computers.
2. Defense Science Board (DSB), US DoD. *High Performance Microchip Supply*.
3. Bhasin, S., et al. (2021). *Hardware Security: A Primer*. Springer.
4. MITRE Hardware CWE — *Common Weakness Enumeration, Hardware Design Weaknesses*.
5. ISO/SAE 21434:2021 — *Road vehicles — Cybersecurity engineering*.
6. DARPA SSITH Program — *System Security Integration Through Hardware and Firmware*.
