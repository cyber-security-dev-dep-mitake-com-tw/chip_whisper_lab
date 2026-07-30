# Module 40: Chip Software Attacks & Malicious Hardware Attacks (晶片軟體攻擊與惡意硬體攻擊) — Theory

## 1. Threat Model: Software Attacks from a Chip-Design Perspective

Although physical attacks (probing, laser fault injection) are highly destructive, **software attacks** are the most common and widest-reaching threat in the real world, because they are usually **remotely exploitable** — an attacker never needs physical access to the device.

From a hardware designer's point of view, the upper-layer OS and applications will inevitably contain bugs. The ultimate goal of chip security is to guarantee that even if the Non-Secure Processing Environment (NSPE) software is fully compromised (e.g. root access obtained), the attacker still cannot break the hardware isolation boundary to reach cryptographic keys or corrupt the root of trust inside the Secure Processing Environment (SPE).

## 2. Common Pure-Software Attack Vectors

- **Buffer Overflow & Memory Corruption**: when a program fails to validate input length, an attacker can write past a buffer's bounds, overwriting adjacent memory — most notably the stack's **return address** — to redirect execution into attacker-supplied shellcode.
- **Control-Flow Hijacking (ROP / JOP)**: modern systems widely enable the NX/XN bit blocking code execution from writable memory. To bypass this, attackers use **Return-Oriented Programming (ROP)** and **Jump-Oriented Programming (JOP)**: instead of injecting new code, they chain together existing legitimate code fragments ("gadgets") already in memory via a carefully crafted chain of return addresses, to execute arbitrary malicious logic.

## 3. Microarchitectural Vulnerabilities: Physical Attacks Launched by Software

Software attacks have evolved to target flaws in the chip's **microarchitecture** directly. Even software that is logically and permission-wise entirely correct can be undone by hardware design choices made purely for performance.

- **Speculative Execution Attacks (Spectre, Meltdown)**: high-performance CPUs predict branch outcomes and **speculatively execute** instructions ahead of time to hide memory latency. On a misprediction, the CPU logically discards the results — but during speculation, data is still loaded into the **cache**. An attacker can craft code that lures the CPU into speculatively reading memory it shouldn't have access to, then use a cache-timing side channel (e.g. Flush+Reload) to infer the leaked secret — crossing the OS/hardware security boundary entirely through software.

## 4. Hardware Countermeasures for Software Security

- **eXecute-Never / NX bit**: page-table attribute bits in the MMU/MPU that force writable regions (stack, heap) to be strictly non-executable, directly blocking classic shellcode execution.
- **Control Flow Integrity (CFI) & Pointer Authentication**: e.g. ARM **Pointer Authentication (PAC)** computes a cryptographic MAC over the return address (using a hardware-resident key + context) and appends it to unused pointer bits before the address is pushed to the stack; verification failure on return raises a hardware exception, blocking ROP/JOP hijacking.
- **Memory Tagging Extension (MTE)**: each memory allocation (e.g. every 16 bytes) is assigned a random physical tag, and any pointer to that region must carry the matching logical tag. The hardware compares tags on every access, eliminating buffer overflow and use-after-free bugs at near-zero performance cost.

## 5. Malicious Hardware Attacks: From Software Bugs to Active Physical Sabotage

Beyond software attacks, high-tier attackers with **physical access** or **hardware design intervention** capability pose the most severe threat, especially for smart cards, hardware wallets, and automotive security modules.

### 5.1 Fault Injection Attacks (FI)

At the exact moment the chip performs a critical security computation (password verification, encryption), the attacker deliberately applies physical disturbance beyond tolerance, forcing a bit flip or timing violation:

- **Voltage & Clock Glitching**: momentarily dropping supply voltage or drastically shortening the clock period causes flip-flops to latch incorrect values — commonly used to flip `if (signature_valid)` to `true`.
- **Optical & Laser Fault Injection**: after decapsulation, a high-energy laser pulse targets a specific silicon region, generating electron-hole pairs whose transient photocurrent flips a single register's state.
- **Differential Fault Analysis (DFA)**: combines fault injection with cryptanalysis — inject a random fault during AES/RSA computation, collect the faulty ciphertext, and mathematically compare it to a correct ciphertext to recover the private key from very few samples.

### 5.2 Invasive Tampering: Micro-probing & FIB

- **Micro-probing**: after chemically removing the package, sub-micron probes contact the internal metal data bus under a microscope, sniffing key material in transit.
- **Focused Ion Beam (FIB) tampering**: FIB can cut existing metal traces (gallium ion milling) or deposit platinum to connect previously unconnected nodes — physically shorting out a security check circuit or forcing a protection bit to an "authorized" state.

### 5.3 Malicious Logic Insertion: Hardware Trojans

A hardware Trojan is a covert circuit maliciously inserted at RTL design, synthesis, or foundry (mask) stage. To evade outgoing ATPG logic tests, Trojans are typically triggered by rare conditions (a specific long input sequence, or a multi-million-cycle counter). Once triggered, the payload may cause denial of service, degrade the crypto engine's RNG quality, or exfiltrate secret keys via an external interface (UART, even an RF antenna).

## 6. On-Chip Countermeasures Against Malicious Physical Attacks

1. **Environmental Sensors & Zeroization**: voltage-glitch, frequency-anomaly, light, and temperature sensors trigger an immediate reset and erase volatile key material on detection of a fault-injection signature.
2. **Active Shield Mesh**: a dense top-metal mesh carrying continuous random cryptographic signals; any attempt at FIB milling or probing changes the mesh's resistance/capacitance or breaks the signal's integrity, permanently locking the chip.
3. **Logic Redundancy & Error Detection**: **dual-core lockstep execution** or repeated computation in time/space; any mismatch between redundant results flags an attack. Parity checks and ECC inside crypto engines further guard against DFA.

## 7. References

1. Kocher, P., et al. (2019). *Spectre Attacks: Exploiting Speculative Execution*. IEEE S&P.
2. ARM Architecture Reference Manual — *Pointer Authentication and Branch Target Identification*.
3. Szekeres, L., Payer, M., Wei, T., & Song, D. (2013). *SoK: Eternal War in Memory*. IEEE S&P.
4. Biham, E., & Shamir, A. (1997). *Differential Fault Analysis of Secret Key Cryptosystems*. CRYPTO.
5. Skorobogatov, S., & Anderson, R. (2002). *Optical Fault Induction Attacks*. CHES.
6. Bhunia, S., et al. (2014). *Hardware Trojan Attacks: Threat Analysis and Countermeasures*. Proceedings of the IEEE.
