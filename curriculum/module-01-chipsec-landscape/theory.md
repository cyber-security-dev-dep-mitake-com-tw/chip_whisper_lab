# Module 01: Chip Security Landscape — Theory

## 1. Introduction

Modern integrated circuits (ICs) underpin everything from banking to military communications. Ensuring their security requires a multi-layered approach spanning certification frameworks, threat modeling, and attack resistance. This module surveys the standards landscape and classifies known attack vectors.

## 2. Certification and Evaluation Frameworks

### 2.1 FIPS 140-3

The **Federal Information Processing Standard (FIPS) 140-3** is the U.S. government standard for cryptographic modules, published by NIST. It superseded FIPS 140-2 and aligns with ISO/IEC 19790:2012.

**Four Security Levels:**

| Level | Requirements | Example |
|-------|-------------|---------|
| Level 1 | Basic security; production-grade cryptographic module | Software-only encryption |
| Level 2 | tamper-evident coatings, role-based authentication | Smart cards with tamper seals |
| Level 3 | tamper-resistant encapsulation, identity-based authentication | Hardware security modules (HSMs) |
| Level 4 | complete envelope of physical security, environmental failure protection | High-security HSMs (e.g., Thales Luna) |

**Key Changes from FIPS 140-2:**
- Mandatory lab testing by accredited labs (formerly optional at Level 1)
- New requirements for software/firmware integrity (SHA-256 or stronger)
- Alignment with ISO/IEC 19790 internationally
- Removed "approved alternative" algorithms; only NIST-approved algorithms accepted

**FIPS 140-3 Publication References:**
- NIST FIPS 140-3 (March 2019): https://csrc.nist.gov/publications/detail/fips/140/3/final
- NIST SP 800-140 series (maintenance guidelines)
- NIST CMVP (Cryptographic Module Validation Program): https://csrc.nist.gov/groups/cmvp/

### 2.2 Common Criteria (CC)

**Common Criteria for Information Technology Security Evaluation** (ISO/IEC 15408) is an international framework for evaluating security products. It defines:

- **Protection Profile (PP):** A set of security requirements for a specific class of products
- **Security Target (ST):** A document describing the security properties of a specific product
- **Evaluation Assurance Level (EAL):** A scale from EAL1 (functionally tested) to EAL7 (formally verified)

**EAL Levels Summary:**

| EAL | Name | Description |
|-----|------|-------------|
| EAL1 | Functionally Tested | Appropriate where some confidence is warranted |
| EAL2 | Structurally Tested | Requires analysis of design information |
| EAL3 | Methodically Tested and Checked | Preparing for rigorous development |
| EAL4 | Methodically Designed, Tested, and Reviewed | Highest level economically justifiable |
| EAL5 | Semi-formally Designed and Tested | Reserved for specialized security |
| EAL6 | Semi-formally Verified Design and Tested | High-assurance security |
| EAL7 | Formally Verified Design and Tested | Maximum assurance; extremely rare |

**CC Evaluation Process:**
1. Developer performs design and implementation
2. Independent evaluation lab tests against ST/PP
3. Certification body (e.g., NIAP, BSI, ANSSI) issues certificate
4. Certificate appears on CC Portal: https://www.commoncriteriaportal.org/

### 2.3 Additional Frameworks

| Framework | Scope | Region |
|-----------|-------|--------|
| **GlobalPlatform** | Secure element, trusted execution environment | International |
| **EMVCo** | Payment card security | International |
| **NIST SP 800-171** | CUI (Controlled Unclassified Information) | U.S. |
| **ISO/IEC 27001** | Information security management | International |
| **SOC 2** | Service organization controls | U.S./International |

## 3. Attack Taxonomy

### 3.1 Classification by Intrusiveness

**Non-Invasive Attacks:**
- No physical alteration of the target device
- Examples: Power analysis, electromagnetic emanation, timing analysis, cold boot attacks
- Low cost, high scalability
- Primary focus of ChipWhisperer labs

**Semi-Invasive Attacks:**
- Minimal physical interaction without deprocessing
- Examples: UV laser glitching, electromagnetic fault injection (EMFI), clock glitching
- Moderate cost, requires specialized equipment

**Invasive Attacks:**
- Physical alteration or destruction of the device
- Examples: Focused Ion Beam (FIB) probing, decapping, microprobing
- High cost, low scalability, destructive

### 3.2 Classification by Side

**Passive Attacks:**
- Observe information leakage without modifying device behavior
- Categories:
  - **Timing attacks**: Measure computation time to infer secrets
  - **Power analysis**: Measure power consumption during operations
  - **Electromagnetic analysis**: Capture EM emanations from chip
  - **Acoustic analysis**: Measure sound emitted during computation
  - **Cache attacks**: Exploit shared cache state to infer access patterns

**Active Attacks:**
- Deliberately manipulate device behavior
- Categories:
  - **Fault injection**: Induce computational errors via voltage, clock, EM, laser
  - **Probing**: Insert physical probes into circuit to read internal signals
  - **Replay attacks**: Capture and retransmit valid inputs
  - **Supply chain attacks**: Modify hardware or firmware before deployment

### 3.3 Classification by Target

**Cryptographic Attacks:**
- Target the mathematical implementation of cryptographic algorithms
- Examples: Padding oracle, timing side-channel, power analysis for key recovery

**Protocol Attacks:**
- Exploit weaknesses in communication protocols
- Examples: Replay, man-in-the-middle, downgrade

**Implementation Attacks:**
- Exploit gaps between specification and implementation
- Examples: Buffer overflow, race conditions, cache timing

## 4. Real-World Attack Case Studies

### 4.1 Spectre (CVE-2017-5753, CVE-2017-5715)

**Discovered:** January 2018 by Google Project Zero (Jann Horn, Paul Kocher, et al.)

**Mechanism:** Exploits speculative execution in modern CPUs. When a branch prediction is wrong, the speculatively executed instructions leave observable traces in the cache.

**Impact:**
- Affected Intel, AMD, ARM processors
- Allows reading of kernel memory, user credentials, encryption keys
- Cannot be fully patched in hardware; requires microcode updates and compiler mitigations

**Relevance to Hardware Security:**
- Demonstrates that microarchitectural side channels can leak secrets across privilege boundaries
- Led to redesigns of CPU cache architectures and branch prediction units
- Highlights the importance of formal verification at the microarchitectural level

**Key References:**
- Kocher, P. et al. "Spectre Attacks: Exploiting Speculative Execution." IEEE S&P 2019
- Intel Security Advisory: https://www.intel.com/content/www/us/en/security-center/advisory/intel-sa-00088.html

### 4.2 Meltdown (CVE-2017-5754)

**Discovered:** January 2018 by Jann Horn (Google Project Zero) and independently by Werner Haas, Thomas Presber, etc.

**Mechanism:** Exploits out-of-order execution to read kernel memory from user space. The processor speculatively reads data before checking permissions, and the cache side channel reveals the data.

**Impact:**
- Primarily affected Intel processors (ARM and AMD largely immune)
- Required hardware-level fixes (new CPU revisions)
- OS-level KPTI (Kernel Page Table Isolation) mitigations impose performance overhead

**Key Distinction from Spectre:**
- Meltdown breaks the fundamental hardware isolation between user and kernel space
- Spectre breaks isolation between different processes/threads

**Key Reference:**
- Lipp, M. et al. "Meltdown: Reading Kernel Memory from User Space." USENIX Security 2018

### 4.3 Rowhammer (CVE-2015-0565 and related)

**Discovered:** 2014 (Kim et al.), widely publicized 2015

**Mechanism:** Repeatedly accessing (hammering) specific DRAM rows causes charge leakage in adjacent rows, flipping bits without software bugs.

**Impact:**
- Enables privilege escalation: flip bits in page table entries to gain kernel access
- Affects DDR3 and DDR4 memory
- Led to new DRAM technologies (e.g., Target Row Refresh, ECC memory requirements)

**Relevance to Hardware Security:**
- Demonstrates that physical properties of hardware (charge coupling, capacitive coupling) can be exploited
- Requires hardware-level countermeasures (TRR, ECC, row isolation)
- Shows that even "correct" software can be vulnerable due to hardware behavior

**Key Reference:**
- Kim, Y. et al. "Flipping Bits in Memory Without Accessing Them: An Experimental Study of DRAM Disturbance Errors." ISCA 2014

### 4.4 Heartbleed (CVE-2014-0160)

**Discovered:** April 2014 by Neel Mehta (Google Security)

**Mechanism:** Buffer over-read in OpenSSL's TLS heartbeat extension. A missing bounds check allows reading up to 64 KB of server memory per request.

**Impact:**
- Exposed private keys, session cookies, and user credentials
- Affected approximately 17% of TLS servers worldwide
- Demonstrated the critical importance of bounds checking and memory safety

**Relevance to Hardware Security:**
- While primarily a software vulnerability, it illustrates how memory safety failures can compromise cryptographic secrets
- Hardware-assisted memory safety (e.g., ARM MTE, Intel CET) is now a research focus
- Highlights the need for formal verification of cryptographic implementations

**Key Reference:**
- Durumeric, Z. et al. "The Matter of Heartbleed." ACM IMC 2014

### 4.5 Additional Notable Cases

| Incident | Year | Type | Key Lesson |
|----------|------|------|------------|
| **BadUSB** | 2014 | Supply chain | Firmware on USB devices can be modified to inject attacks |
| **Rowhammer.js** | 2015 | Software-hardware | JavaScript can trigger DRAM bit flips via cache timing |
| **L1TF (Foreshadow)** | 2018 | Speculative execution | L1 Terminal Fault leaks SGX enclave data |
| **ZombieLoad** | 2019 | Microarchitectural | MDS (Microarchitectural Data Sampling) leaks from CPU internal buffers |
| **Plundervolt** | 2019 | Fault injection | Undervolting Intel CPUs induces computation faults |
| **SMASH** | 2020 | Fault injection | Voltage glitching on Apple Secure Enclave |

## 5. NIST Publications Relevant to Hardware Security

| Publication | Title | Relevance |
|-------------|-------|-----------|
| FIPS 140-3 | Security Requirements for Cryptographic Modules | Primary certification standard |
| SP 800-57 Part 1 Rev. 5 | Recommendation for Key Management | Key lifecycle, strength |
| SP 800-175B | Guideline for Using Cryptographic Standards | Selection of approved algorithms |
| SP 800-175C | Guideline for Using the Cryptographic Standards | Implementation guidance |
| SP 800-90A | Recommendation for Random Number Generation | DRBG specifications |
| SP 800-90B | Recommendation for Entropy Sources | TRNG requirements |
| SP 800-90C | Recommendation for Random Number Generation | RBG construction |
| SP 800-183 | Networks of Things | IoT security framework |
| SP 800-187 | Guide to FPGA Security | FPGA-specific threats |

## 6. Threat Model for ChipWhisperer Labs

Throughout this curriculum, we operate under the following threat model:

**Attacker Capabilities:**
- Physical access to the target device
- Ability to measure power consumption and electromagnetic emanations
- Ability to control input stimuli (plaintext, ciphertext)
- Ability to perform clock/voltage glitching (Modules 05, 10)

**Defender Goals:**
- Protect secret keys (AES, RSA, ECC) from extraction
- Ensure secure boot chain integrity
- Provide tamper evidence and resistance

**Assumptions:**
- The attacker does not have access to the die (no decapping/FIB)
- The attacker does not have insider knowledge of the design
- The device operates in a physically controlled environment (lab)

## 7. The Security Evaluation Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                     SECURITY EVALUATION                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. REQUIREMENTS DEFINITION                                     │
│     ├── Protection Profile (Common Criteria)                    │
│     ├── Security Level (FIPS 140-3)                             │
│     └── Threat Model                                            │
│                                                                 │
│  2. DESIGN & IMPLEMENTATION                                     │
│     ├── Secure-by-design principles                             │
│     ├── Countermeasure integration                              │
│     └── Documentation                                           │
│                                                                 │
│  3. TESTING & EVALUATION                                        │
│     ├── Functional testing                                     │
│     ├── Penetration testing                                    │
│     ├── Side-channel analysis (SPA, DPA, CPA)                  │
│     └── Fault injection testing                                │
│                                                                 │
│  4. CERTIFICATION                                               │
│     ├── Lab submission (CMVP, NIAP, BSI)                       │
│     ├── Review and certificate issuance                        │
│     └── Ongoing maintenance (re-evaluation)                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 8. References

1. NIST. FIPS 140-3: Security Requirements for Cryptographic Modules. March 2019.
2. Common Criteria Recognition Arrangement. Common Criteria Portal. https://www.commoncriteriaportal.org/
3. Kocher, P. et al. "Spectre Attacks: Exploiting Speculative Execution." IEEE S&P 2019.
4. Lipp, M. et al. "Meltdown: Reading Kernel Memory from User Space." USENIX Security 2018.
5. Kim, Y. et al. "Flipping Bits in Memory Without Accessing Them." ISCA 2014.
6. Durumeric, Z. et al. "The Matter of Heartbleed." ACM IMC 2014.
7. Mangard, S. et al. Power Analysis Attacks: Revealing the Secrets of Smart Cards. Springer, 2007.
8. NIST SP 800-175B: Guideline for Using Cryptographic Standards. 2020.
9. GlobalPlatform. Device Security Overview. 2019.
10. Masters, V. "Chip Security: From Silicon to Standards." IEEE Design & Test, 2020.
