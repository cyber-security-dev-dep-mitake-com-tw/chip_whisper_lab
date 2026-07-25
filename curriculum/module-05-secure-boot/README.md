# Module 05: Secure Boot & Hardware Root of Trust

## Learning Objectives
- Understand the chain of trust concept from silicon to application layer
- Distinguish between measured boot and verified boot architectures
- Explain UEFI Secure Boot and ARM TrustZone secure boot flows
- Analyze real-world secure boot attack cases: bypass, downgrade, cold boot attacks
- Design a hardware root of trust using PUF or OTP storage

## Estimated Time
2–3 hours

## Prerequisites
- Module 01 (Chip Security Landscape)
- Module 04 (PUF & TRNG)
- Basic understanding of boot processes and firmware

## Module Structure
| File | Description |
|------|-------------|
| `theory.md` | Chain of trust, measured boot, UEFI, ARM TrustZone, attack cases |
| `lab-simulated.ipynb` | Interactive chain-of-trust simulation and boot verification |

## Key Topics
1. **Chain of Trust**: Hardware root, immutable ROM, verified boot stages
2. **Measured Boot vs Verified Boot**: TPM-based vs cryptographic verification
3. **UEFI Secure Boot**: Platform key, key exchange key, signature databases
4. **ARM TrustZone**: Secure world boot, TrustZone-aware peripherals
5. **Attack Cases**: BootROM bypass, firmware downgrade, cold boot attacks

## References
- [UEFI Specification](https://uefi.org/specifications)
- [ARM TrustZone Technology](https://developer.arm.com/documentation/102467/latest/)
- [NIST SP 800-193: Platform Firmware Resiliency](https://csrc.nist.gov/publications/detail/sp/800-193/final)
