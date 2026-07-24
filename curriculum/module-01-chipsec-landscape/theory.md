# Module 01: Theory - Chip Security Landscape

## FIPS 140-3 Overview

FIPS 140-3 is the current standard for cryptographic module validation, replacing FIPS 140-2. Key aspects include:

### Security Requirements

1. **Cryptographic Module Specification**
   - Module definition and boundaries
   - Cryptographic module interfaces
   - Roles, services, and authentication

2. **Finite State Model**
   - Module states and state transitions
   - State entry/exit conditions
   - Error conditions and handling

3. **Hardware Security**
   - Physical security requirements
   - Tamper resistance mechanisms
   - Environmental failure protection

4. **Software Security**
   - Operational software characteristics
   - Software/firmware security
   - Upgrade mechanisms

5. **Cryptographic Module Security**
   - Key management
   - Self-tests
   - Design assurance

## CMVP Validation Process

The Cryptographic Module Validation Program (CMVP) involves:

### Testing Phases

1. **Pre-validation**
   - Module preparation
   - Documentation review
   - Test planning

2. **Laboratory Testing**
   - Security testing
   - Functional testing
   - Integration testing

3. **Validation**
   - CMVP review
   - Certificate issuance
   - Module listing

### Documentation Requirements

- Security Policy Document
- Interface specification
- Design documentation
- Operational guidance

## Attack Taxonomy

### Physical Attacks

1. **Side-Channel Attacks**
   - Power analysis (SPA, DPA, CPA)
   - Electromagnetic analysis
   - Timing attacks

2. **Fault Injection Attacks**
   - Voltage glitching
   - Clock glitching
   - EM fault injection
   - Laser fault injection

3. **Invasive Attacks**
   - Decapsulation
   - Micro-probing
   - Focused Ion Beam (FIB)

### Non-Physical Attacks

1. **Software Attacks**
   - Buffer overflows
   - Format string vulnerabilities
   - Race conditions

2. **Cryptographic Attacks**
   - Mathematical attacks
   - Implementation flaws
   - Protocol weaknesses

## Security Evaluation Methodologies

### Common Criteria

- Evaluation Assurance Levels (EAL 1-7)
- Protection Profiles
- Security Targets

### ISO/IEC Standards

- ISO/IEC 19790 (FIPS 140-3 equivalent)
- ISO/IEC 24759 (test methodology)
- ISO/IEC 24745 (biometric security)

## Real-World Case Studies

### Notable Security Failures

1. **ROCA Vulnerability** (2017)
   - RSA key generation flaw
   - Infineon chips affected
   - Remote attack capability

2. **Spectre/Meltdown** (2018)
   - Speculative execution attacks
   - Hardware-level vulnerabilities
   - Industry-wide impact

3. **TPM Vulnerabilities**
   - Timing side-channels
   - Fault injection attacks
   - Firmware flaws

## References

1. NIST FIPS 140-3 Standard
2. CMVP Documentation
3. Academic papers on chip security
4. Industry security bulletins