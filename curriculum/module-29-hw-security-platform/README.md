# Module 29: Hardware Security Platform (硬體安全平台架構與整合)

## Learning Objectives
- Describe the hardware architecture of an integrated security platform (secure CPU, private memory, RoT/crypto cluster, secure interconnect)
- Explain the hardware mailbox mechanism and why the main OS never sees plaintext keys
- Compare ARM PSA, OpenTitan, and TPM 2.0 as industry frameworks for hardware security platforms

## Estimated Time
1 hour

## Prerequisites
- Module 27 (PUF HRoT Architecture)
- Module 28 (eFuse vs. Anti-Fuse Storage)

## Module Structure
| File | Description |
|------|--------------|
| `theory.md` | Platform architecture, mailbox mechanism, industry standards |
| `whui-page.tsx` | Interactive mailbox request/response simulation with a "compromised OS" toggle |

## Key Topics
1. Secure subsystem architecture and physical isolation boundary
2. Hardware mailbox / IPC request-response flow
3. ARM PSA, OpenTitan, TPM 2.0

## References
- ARM Ltd. — *Platform Security Architecture (PSA) Security Model*.
- OpenTitan Project — *OpenTitan Hardware Architecture Specification*.
- Trusted Computing Group (TCG) — *TPM 2.0 Library Specification*.

**Further Reading (Beginner):** [Beginner Hardware Security Resources / 晶片安全入門教材與資源](../resources/hardware-security-beginner-resources.md)
