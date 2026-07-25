# Module 05: Secure Boot & Hardware Root of Trust — Theory

## 1. Introduction

Secure boot ensures that only authenticated, unmodified firmware executes on a device. It establishes a "chain of trust" from immutable hardware to the application layer, preventing unauthorized code execution even if an attacker has physical access.

## 2. Chain of Trust

### 2.1 Concept

The chain of trust is a hierarchical verification process:

$$
\text{Hardware Root} \xrightarrow{\text{verify}} \text{Bootloader} \xrightarrow{\text{verify}} \text{OS Kernel} \xrightarrow{\text{verify}} \text{Application}
$$

Each stage cryptographically verifies the next before executing it. If any link is broken, the chain fails and the device should halt.

### 2.2 Hardware Root of Trust

The root of trust must be:
- **Immutable**: Cannot be modified after manufacturing
- **Trusted**: Its behavior is guaranteed by design
- **Minimal**: Small attack surface (ideally mask ROM)

**Implementation options:**

| Method | Description | Pros | Cons |
|--------|-------------|------|------|
| **BootROM** | Code burned into mask ROM at fabrication | Immutable, fast | Expensive to fix bugs |
| **OTP (One-Time Programmable)** | Fuse-based storage for keys/hash | Flexible key storage | Limited capacity |
| **PUF-based** | Keys derived from physical variations | Cloned resistant | Reliability concerns |
| **TPM/SE** | Dedicated security hardware | Standardized, audited | Added cost, slower |

### 2.3 Boot Stages

```
┌─────────────────────────────────────────────────────┐
│ Stage 0: BootROM (immutable)                       │
│   - Initialize minimal hardware                     │
│   - Load and verify Stage 1                         │
├─────────────────────────────────────────────────────┤
│ Stage 1: First-Stage Bootloader (FSBL)             │
│   - Initialize DRAM, clocks                         │
│   - Load and verify Stage 2                         │
├─────────────────────────────────────────────────────┤
│ Stage 2: Second-Stage Bootloader (SSBL)            │
│   - Load OS kernel                                  │
│   - Kernel verified before execution                │
├─────────────────────────────────────────────────────┤
│ Stage 3: OS Kernel                                  │
│   - Load userspace applications                     │
│   - Application signature verification              │
└─────────────────────────────────────────────────────┘
```

## 3. Measured Boot vs. Verified Boot

### 3.1 Measured Boot (TPM-based)

**Principle:** Record (measure) each boot stage's hash in a tamper-evident log (PCR - Platform Configuration Register).

$$
\text{PCR}_{new} = \text{Extend}(\text{PCR}_{old}, \text{hash}(\text{stage})) = \text{SHA-256}(\text{PCR}_{old} \| \text{hash}(\text{stage}))
$$

**Properties:**
- Does not prevent execution of unauthorized code
- Provides **detection** (tamper evidence) not **prevention**
- Remote attestation: Prove to a third party which firmware is running
- PCR values can only be reset to initial values (not set arbitrarily)

**PCR Extend Operation:**
$$
\text{PCR}_0 = H(\text{0x0000...0000} \| H(\text{bootloader})) \\
\text{PCR}_1 = H(\text{PCR}_0 \| H(\text{OS kernel})) \\
\text{PCR}_2 = H(\text{PCR}_1 \| H(\text{application}))
$$

**Remote Attestation Protocol:**
1. Challenger sends nonce
2. Prover signs (PCR values, nonce) with TPM's private key
3. Challenger verifies signature and checks PCR values against known-good state

### 3.2 Verified Boot (Cryptographic Verification)

**Principle:** Cryptographically verify each boot stage before executing it.

$$
\text{Verify}(\text{sig}_{stage}, \text{pk}_{authority}, \text{hash}(\text{stage})) \to \text{accept/reject}
$$

**Properties:**
- **Prevents** execution of unauthorized code
- Halts boot if verification fails
- Requires a trusted verification key (stored in hardware)
- Used by: UEFI Secure Boot, Android Verified Boot, ARM Trusted Firmware

### 3.3 Comparison

| Property | Measured Boot | Verified Boot |
|----------|--------------|---------------|
| Prevention | No | Yes |
| Detection | Yes | No (halts instead) |
| Key storage | TPM PCR | OTP/fuse |
| Flexibility | High (new measurements) | Moderate (key rotation) |
| Use case | Enterprise, cloud | IoT, mobile, embedded |

## 4. UEFI Secure Boot

### 4.1 Architecture

UEFI Secure Boot uses a hierarchy of keys:

```
PK (Platform Key)
 └── KEK (Key Exchange Key)
      ├── db (Signature Database - allowed signers)
      └── dbx (Forbidden Signatures Database - revocation list)
```

**Key hierarchy:**
- **PK**: Owner identity (typically OEM or user)
- **KEK**: OS vendor trust (e.g., Microsoft, Red Hat)
- **db**: Trusted firmware/signature database
- **dbx**: Revoked signatures

### 4.2 Secure Boot Flow

1. **PEI (Pre-EFI Initialization):** Hardware init, load DXE
2. **DXE (Driver Execution Environment):** Load UEFI drivers
3. **BDS (Boot Device Selection):** Select boot device
4. **Secure Boot Verification:**
   - Check if Secure Boot is enabled
   - Verify boot loader signature against `db`
   - Check `dbx` for revocation
   - If verification fails: halt or fall back to setup mode

### 4.3 Key Management

**Platform Owner Keys:**
- PK is typically an X.509 certificate
- Can be rotated by platform owner
- Factory reset clears all keys (enters "Setup Mode")

**OS Vendor Keys:**
- KEK is typically Microsoft's UEFI CA certificate
- Allows OS to add its own keys to `db`
- Enables self-signed bootloaders

## 5. ARM TrustZone Secure Boot

### 5.1 TrustZone Architecture

ARM TrustZone divides the processor into two "worlds":
- **Normal World**: Runs OS, applications
- **Secure World**: Runs Secure Monitor, Trusted OS, Trusted Applications

### 5.2 TrustZone Boot Flow

```
┌─────────────────────────────────────────────────────┐
│ Secure ROM (TrustZone ROM)                          │
│   - Authenticates Secure Bootloader                 │
│   - Loads TrustZone OS                               │
├─────────────────────────────────────────────────────┤
│ Secure Bootloader                                    │
│   - Verifies Normal World Bootloader                 │
│   - Initializes Secure World resources               │
├─────────────────────────────────────────────────────┤
│ Normal World Bootloader (e.g., U-Boot)              │
│   - Verifies Linux kernel                           │
│   - Loads OS                                         │
├─────────────────────────────────────────────────────┤
│ Normal World OS (Linux)                              │
│   - Can call Secure Monitor via SMC (Secure Monitor  │
│     Call) for trusted services                       │
└─────────────────────────────────────────────────────┘
```

### 5.3 Secure Monitor

The Secure Monitor acts as a trusted broker:
- Handles context switching between Normal and Secure worlds
- Manages TrustZone address space controller (TZASC)
- Enforces memory access permissions

**SMC (Secure Monitor Call):**
$$
\text{Normal World} \xrightarrow{\text{SMC}} \text{Secure Monitor} \xrightarrow{\text{dispatch}} \text{Trusted Application}
$$

## 6. Attack Cases

### 6.1 BootROM Bypass

**Attack:** Exploit vulnerabilities in the BootROM to bypass signature verification.

**Famous Cases:**
- **checkm8 (2019):** Exploits a use-after-free in Apple's BootROM (A5-A11 chips). Allows unsigned code execution on iOS devices. **Unpatchable** because BootROM is mask ROM.
- **Qualcomm EDL (2017):** Qualcomm's Emergency Download Mode (EDL) can be accessed via USB without authentication, allowing arbitrary firmware flashing.

**Mitigation:**
- Minimize BootROM code size
- Formal verification of BootROM
- Disable debug interfaces in production

### 6.2 Firmware Downgrade Attack

**Attack:** Flash an older, vulnerable firmware version that lacks security patches.

**Mechanism:**
1. Obtain older firmware image (may be publicly available)
2. Flash it to device (bypassing version checks)
3. Exploit known vulnerability in old firmware

**Example:** Samsung Galaxy S3 boot vulnerability (2013) allowed downgrading to an old Bootloader with an exploitable vulnerability.

**Mitigation:**
- Anti-rollback counters (stored in OTP/fuses)
- Minimum version enforcement in BootROM
- Secure firmware update with monotonic counters

### 6.3 Cold Boot Attack

**Attack:** Exploit DRAM data remanence to extract encryption keys after power-off.

**Mechanism (Halderman et al., 2008):**
1. Power off the target device
2. Cool DRAM (e.g., with compressed air) to slow data decay
3. Transfer DRAM module to attacker's machine
4. Read DRAM contents (including encryption keys)

**DRAM Remanence:**
$$
\text{Data retention time} \approx f(\text{temperature}, \text{DRAM type})
$$
- At room temperature: ~seconds to minutes for data decay
- At -50°C: data can persist for hours

**Mitigation:**
- DRAM encryption (hardware memory encryption)
- Memory zeroization on power-off
- Platform Reset Attack Mitigation (NIST SP 800-193)
- TCG Platform Reset Attack Mitigation Specification

### 6.4 Secure Boot Bypass via Side-Channel

**Attack:** Use power analysis or timing analysis to extract verification keys or bypass checks.

**Example:**
- Measure power consumption during signature verification
- Identify the branch taken (verify pass/fail)
- Manipulate input to skip verification

**Mitigation:**
- Constant-time verification
- Side-channel resistant implementations
- Hardware root of trust for verification

### 6.5 evil maid attack

**Attack:** Physical access to modify firmware while device is unattended.

**Example:** Modified bootloader on a laptop to capture BitLocker recovery key.

**Mitigation:**
- Tamper-evident seals (physical)
- Remote attestation (TPM-based)
- Secure boot with measured boot

## 7. NIST SP 800-193: Platform Firmware Resiliency

NIST SP 800-193 provides guidelines for protecting platform firmware:

**Three Principles:**
1. **Protection**: Platform firmware should be protected from unauthorized modification
2. **Detection**: Platform firmware should detect unauthorized modification
3. **Recovery**: Platform firmware should be able to recover from unauthorized modification

**Key Recommendations:**
- Use hardware root of trust
- Implement measured boot for detection
- Provide firmware recovery mechanism
- Use secure firmware update process

## 8. Side-Channel Relevance

### 8.1 Secure Boot as Attack Target
- Verification operations leak timing/power information
- Boot state can be inferred from power consumption patterns
- Anti-rollback counters can be targeted via fault injection

### 8.2 DRAM Encryption as Countermeasure
- Hardware memory encryption prevents cold boot attacks
- Adds performance overhead (typically 1-5%)
- Used in: AMD SME/SEV, Intel TME, ARM TrustZone Memory Encryption

## 9. References

1. NIST SP 800-193: Platform Firmware Resiliency Guidelines. May 2018.
2. Halderman, J. et al. "Lest We Remember: Cold Boot Attacks on Encryption Keys." USENIX Security 2008.
3. UEFI Forum. UEFI Specification. https://uefi.org/specifications
4. ARM. TrustZone Technology for ARMv8-A Architecture. 2017.
5. Xing, L. et al. "Bootstomp: On the Security of Bootloaders in Mobile Devices." USENIX Security 2015.
6. Costin, A. et al. "A Large-Scale Analysis of the Security of Embedded Firmwares." USENIX Security 2014.
7. Beek, B. and Elovici, Y. "Checkmate: Constrained Execution for Mobile Device Security." IEEE Security & Privacy, 2020.
8. TCG. Platform Reset Attack Mitigation Specification. 2015.
9. Checkm8. "checkm8: A permanent exploit for A5-A11." 2019.
10. Qualcomm. "Security Bulletin: January 2017." 2017.
