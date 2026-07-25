# TEE & Microarchitecture Security

## Trusted Execution Environments

### Overview
A Trusted Execution Environment (TEE) provides an isolated execution environment within the main processor. The TEE enforces hardware-level isolation between "Normal World" (rich OS) and "Secure World" (trusted OS). Applications in Normal World can request secure operations from the TEE, with the hardware ensuring isolation.

### ARM TrustZone
- **Single secure interrupt controller**
- **Secure/non-secure peripheral access**
- **Secure/non-secure memory regions**
- **NS (Non-Secure) bit in MPU/control registers**
- **Secure monitor mode** for world switching

TrustZone creates two worlds:
- **Secure World**: Runs trusted OS (teeOS), accesses secure peripherals, keys
- **Normal World**: Runs rich OS (Android, Linux), accesses non-secure peripherals

### RISC-V PMP/ePMP
The RISC-V Physical Memory Protection (PMP) allows fine-grained access control:
- **PMP regions**: 16 configurable regions (PMP0-PMP15)
- **Access permissions**: Execute, Read, Write per region
- **ePMP**: Scalable PMP supporting 16+ regions, shared physical memory

### Intel SGX (Software Guard Extensions)
- **Enclave page cache (EPC)**: Isolated memory region
- **EACCEPT/ERE PORT**: Hardware-attested memory encryption
- **EEXTEND**: Memory encryption key derived from EPC page contents
- **EGETKEY**: Derive sealing key for persisting encrypted data
- **Remote attestation**: Prove enclave identity to remote verifier

## Cache Side-Channel Attacks

### Flush+Reload
1. **Attacker** flushes specific cache line (using `clflush`)
2. **Victim** accesses the address (loads into cache)
3. **Attacker** measures reload time of the address
4. Short reload time = victim accessed the address (cache hit)

**Application**: Monitoring which cryptographic lookup table entries the victim accesses during AES encryption to recover the key.

### Prime+Probe
1. **Attacker** fills entire cache set with dummy addresses
2. **Victim** executes (evicts some entries from attacker's set)
3. **Attacker** re-accesses its dummy addresses and measures timing
4. Long access time = victim evicted an entry (cache conflict)

### Spectre (CVE-2017-5753)
Exploits speculative execution to leak data from processes the attacker should not be able to access:
1. **Training**: Train branch predictor to take wrong branch
2. **Execution**: Processor speculatively executes on wrong path
3. **Side channel**: Speculative instructions access secret data and leave cache traces
4. **Leakage**: Attacker measures timing to recover secret

### Meltdown (CVE-2017-5754)
Exploits out-of-order execution to read kernel memory from user space:
1. Access memory address that causes a page fault
2. Processor executes the load speculatively (before page fault is raised)
3. Secret data loaded into cache
4. After page fault, side-channel attack recovers data from cache timing

## Rowhammer (Memory Hardware Vulnerability)

### Principle
Rapidly activating (rowhammering) specific DRAM rows causes electrical interference that flips bits in adjacent rows. This allows an unprivileged process to escalate privileges by bit-flipping page table entries.

### Mitigations
1. **Target Row Refresh (TRR)**: Hardware refresh mechanism for vulnerable rows
2. **Memory isolation**: Larger page sizes (2MB/1GB) reduce victim row density
3. **PATROL scrub**: Background DDR memory scrubbing
4. **Intel MKTME**: Memory encryption with independent keys per process
5. **AMD SME/SEV**: Secure Memory Encryption for VMs and processes

## References
- GlobalPlatform TEE System Architecture Specification
- Kocher, P., et al. (2014). "Spectre Attacks: Exploiting Speculative Execution." IEEE S&P 2019.
- Yarom, Y., & Falkner, K. (2014). "FLUSH+RELOAD: A High Resolution Hidden Cache Side-Channel Attack." USENIX Security 2014.
- VUSec (Vrije Universiteit Amsterdam): https://www.vusec.net/
- Lipp, M., et al. (2018). "Meltdown: Reading Kernel Memory from User Space." USENIX Security 2018.
- NIST SP 800-193 (Platform Firmware Resiliency Guidelines)
- AMD SEV / Intel TDX / Intel MKTME Architecture Technical Reference Manuals
