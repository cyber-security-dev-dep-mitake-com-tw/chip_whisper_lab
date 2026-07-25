# WhisperLab — Hardware Security Research Platform

A comprehensive, local-first hardware security research and learning platform for Apple Silicon (M1/M2/M3). Build, capture, and analyze side-channel attacks and fault injection experiments using ChipWhisperer with a modern web UI.

## Overview

WhisperLab provides:
- **Hardened macOS installer** for ChipWhisperer development on Apple Silicon
- **25-module curriculum** covering chip security, SCA, fault injection, hardware RE, PQC, quantum security, and more
- **Full-stack web application** (Next.js + FastAPI) for experiment orchestration and analysis
- **CI/CD pipeline** with Robot Framework testing and multi-platform releases

## Quick Start

### Prerequisites
- macOS 14+ (Apple Silicon required)
- Homebrew
- ~5 GB free disk space

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/cyber-security-dev-dep-mitake-com-tw/chip_whisper_lab.git
cd chip_whisper_lab

# 2. Run the installer (simulator mode, no hardware needed)
./scripts/install-macos.sh --simulator-only --yes

# 3. Start the full platform
./scripts/start-whisperlab.sh
# → Frontend: http://localhost:3000
# → Backend API: http://localhost:8000/api/docs
# → Jupyter: http://localhost:8888
```

### Docker (Alternative)
```bash
docker-compose up -d
```

## Project Structure

```
chip_whisper/
├── scripts/                  # Installation and utility scripts
│   ├── install-macos.sh      # macOS installer (Homebrew + uv + Conda fallback)
│   ├── doctor-macos.sh       # Environment health check + JSON report
│   ├── start-jupyter.sh      # Launch ChipWhisperer Jupyter Lab
│   └── start-whisperlab.sh   # Launch full WhisperLab platform
├── curriculum/               # 25 learning modules (00-24)
│   ├── module-00-setup/      # Environment setup
│   ├── module-01-chipsec-landscape/  # FIPS 140-3, CMVP, attack taxonomy
│   ├── module-02-symmetric-hash/     # AES, SHA-2/3, modes
│   ├── module-03-asymmetric-pqc/     # RSA, ECC, PQC (Kyber, Dilithium)
│   ├── module-04-puf-trng/           # PUF types, TRNG, entropy
│   ├── module-05-secure-boot/        # Measured boot, attack cases
│   ├── module-06-sca-theory/         # SPA, DPA, CPA math
│   ├── module-07-cw-lite-lab01/      # CW-Lite platform, capture
│   ├── module-08-aes-dpa-cpa/        # AES DPA/CPA deep dive
│   ├── module-09-cpa-aes-lab02/      # CPA on AES full attack
│   ├── module-10-countermeasures/    # Masking, hiding, shuffling
│   ├── module-11-fault-glitching/    # Voltage & clock glitching
│   ├── module-12-emfi-lfi/           # EMFI & laser fault injection
│   ├── module-13-fault-analysis/     # DFA, fault models, defenses
│   ├── module-14-jtag-swd/           # JTAG/SWD attacks, RDP bypass
│   ├── module-15-hw-reverse/         # Decap, FIB, active shields
│   ├── module-16-hw-trojans/         # Trust-Hub, detection, counterfeits
│   ├── module-17-tee-microarch/      # TrustZone, SGX, PMP
│   ├── module-18-cache-sc/           # Flush+Reload, Prime+Probe
│   ├── module-19-transient-exec/     # Spectre, Meltdown, Rowhammer
│   ├── module-20-pqc-hw/             # PQC hardware + SCA/FIA on PQC
│   ├── module-21-qkd/                # QKD security (SPAD blinding)
│   ├── module-22-qpuf/               # Quantum PUF via IBM Quantum
│   ├── module-23-cryo-cmos/          # Cryo-CMOS & QPU security
│   └── module-24-bqc-tee/            # Blind QC + TEE integration
├── backend/                  # FastAPI + Celery backend
│   ├── src/whisperlab/
│   │   ├── api/              # Routers: experiments, traces, attacks, targets, reports
│   │   ├── models/           # SQLAlchemy: Experiment, Trace, Attack, Target, Report
│   │   ├── services/         # CaptureService, TraceService, AttackRunner
│   │   ├── tasks/            # Celery tasks: CPA, DPA, Template, Glitch, DFA
│   │   ├── config.py         # Settings (DATABASE_URL, REDIS_URL, etc.)
│   │   ├── db.py             # Async SQLAlchemy engine + session
│   │   ├── schemas.py        # Pydantic response schemas
│   │   └── main.py           # FastAPI app setup + router includes
│   ├── pyproject.toml        # Python project config + dependencies
│   ├── alembic.ini           # Alembic migration config
│   ├── alembic/              # Alembic migration scripts
│   └── Dockerfile            # Multi-stage Docker build
├── app/                      # Next.js 16 + React 19 frontend
│   ├── app/                  # App Router pages (dashboard, experiments, traces, attacks...)
│   ├── components/           # React components (sidebar, cards, trace viewer...)
│   ├── lib/                  # API client, TanStack Query hooks, types
│   └── globals.css           # Tailwind CSS styles
├── tests/
│   ├── robot/                # Robot Framework suites (installer, doctor, API)
│   ├── backend/              # Backend pytest integration tests
│   └── integration/          # Integration test suites
├── .github/workflows/        # CI/CD (ci.yml, release.yml)
├── docker-compose.yml        # Multi-service development environment
├── Dockerfile.jupyter        # Jupyter kernel with ChipWhisperer
├── Makefile                  # Dev/CI/release commands
├── IMPLEMENTATION_PLAN.md    # Detailed implementation roadmap
└── MASTER_PLAN.md            # Master project plan
```

## Curriculum Modules

| # | Module | Duration | Category |
|---|--------|----------|----------|
| 00 | Environment Setup | 1 hr | Setup |
| 01 | Chip Security Landscape | 2 hrs | Theory |
| 02 | Symmetric Crypto & Hash | 3 hrs | Cryptography |
| 03 | Asymmetric & PQC | 3 hrs | Cryptography |
| 04 | PUF & TRNG | 3 hrs | Hardware Trust |
| 05 | Secure Boot & Auth | 3 hrs | Boot Security |
| 06 | SCA Theory (SPA/DPA/CPA) | 4 hrs | Side-Channel |
| 07 | CW-Lite Lab 01 | 4 hrs | Lab |
| 08 | AES DPA/CPA Deep Dive | 4 hrs | Lab |
| 09 | CPA on AES Lab 02 | 4 hrs | Lab |
| 10 | SCA Countermeasures | 3 hrs | Defense |
| 11 | Voltage & Clock Glitching | 4 hrs | Fault Injection |
| 12 | EMFI & Laser (LFI) | 3 hrs | Fault Injection |
| 13 | DFA & Fault Defenses | 4 hrs | Fault Injection |
| 14 | JTAG/SWD Attacks & RDP Bypass | 4 hrs | HW RE |
| 15 | HW Reverse Engineering | 3 hrs | HW RE |
| 16 | Hardware Trojans & Supply Chain | 3 hrs | Supply Chain |
| 17 | TEE & Microarch Security | 4 hrs | TEE |
| 18 | Cache Side-Channels | 4 hrs | Microarch |
| 19 | Transient Execution | 3 hrs | Microarch |
| 20 | PQC Hardware + SCA/FIA | 4 hrs | PQC |
| 21 | QKD Device Security | 2 hrs | Quantum |
| 22 | Quantum PUF (IBM) | 3 hrs | Quantum |
| 23 | Cryo-CMOS & QPU | 2 hrs | Quantum |
| 24 | Blind QC + TEE | 2 hrs | Quantum |

## API Reference

### Backend (FastAPI)
Base URL: `http://localhost:8000/api/v1`

| Resource | Endpoints |
|----------|-----------|
| Experiments | `GET/POST /experiments`, `GET/PATCH/DELETE /experiments/{id}` |
| Traces | `POST /traces/upload`, `GET /traces`, `GET /traces/{id}`, `GET /traces/{id}/download` |
| Attacks | `POST /attacks`, `GET /attacks`, `GET /attacks/{id}`, `GET /attacks/{id}/results` |
| Targets | `GET/POST /targets`, `POST /targets/{id}/flash`, `POST /targets/{id}/test` |
| Reports | `POST /reports`, `GET /reports`, `GET /reports/{id}`, `GET /reports/{id}/download` |

### Frontend
| Page | Route |
|------|-------|
| Dashboard | `/` |
| Experiments | `/experiments` |
| Traces | `/traces` |
| Attacks | `/attacks` |
| Targets | `/targets` |
| Reports | `/reports` |
| Curriculum | `/learn` |
| Module Detail | `/learn/module-XX-name` |

## CI/CD

### Pull Request Validation
Automatically runs on every PR:
- Shellcheck + shfmt (scripts)
- Ruff (backend Python)
- ESLint (frontend TypeScript)
- MyPy type checking (backend)
- `tsc --noEmit` (frontend)
- pytest (backend unit tests)
- Robot Framework (installer + doctor tests)

### Release Pipeline

Tagged releases automatically build:
- macOS `.pkg` + `.dmg` (installer)
- Windows `.exe` + `.msi`
- Docker images (linux/amd64 + linux/arm64) via GHCR

#### Phase 7: Releases and Documentation

WhisperLab implements a comprehensive release orchestration pipeline (Phase 7) that ensures consistent, validated, and documented releases across all platforms.

**Release Orchestration** (`scripts/release.sh`):
- Final compilation and validation of all components
- Multi-platform package building (macOS, Windows, Linux)
- Automated GitHub Release creation with SBOM
- Artifact signing and verification
- Release summary generation

**Release Pipeline Components**:
| Component | File | Description |
|-----------|------|-------------|
| Release Orchestration | `scripts/release.sh` | Final compilation, packaging, and distribution |
| Package Building | `scripts/package-build.sh` | Cross-platform release packaging (.pkg/.dmg/.exe/.msi/Docker) |
| CI Validation | `.github/workflows/validation.yml` | Comprehensive CI validation enhancement |
| Post-Release Validation | `scripts/post-release-validation.sh` | Comprehensive release validation |

**Release Artifacts**:
- **macOS**: `.pkg` installer + `.dmg` disk image
- **Windows**: `.exe` executable + `.msi` installer
- **Linux**: Docker multi-arch images via GHCR
- **Documentation**: User guide, API reference, changelog
- **Curriculum**: 25-module interactive learning materials

**Release Validation**:
1. Pre-release: Run `./scripts/post-release-validation.sh`
2. CI validation: All tests pass (Robot Framework, pytest, eslint, ruff)
3. Security check: No hardcoded secrets, JWT auth, input validation
4. Performance: Trace upload ≤ 2 minutes for 100MB, attack jobs ≤ 5 minutes
5. Post-release: Automated validation report generation

**Release Checklist**:
- [ ] All Phase 1-6 components validated
- [ ] Documentation complete (README, USER_GUIDE, API_REFERENCE)
- [ ] Curriculum modules (25) with theory, labs, and API contracts
- [ ] Hardware validation scripts tested
- [ ] Advanced physics labs (quantum, TEE, cryogenic) validated
- [ ] Release orchestration script verified
- [ ] GitHub Release created with all artifacts

**Phase 7 Implementation Status**: ✅ Complete

All Phase 7 deliverables are implemented and validated:
- ✅ T7.1: Release Orchestration (`scripts/release.sh`)
- ✅ T7.2: Documentation (README.md, USER_GUIDE.md, API_REFERENCE.md, CHANGELOG.md)
- ✅ T7.3: Release Pipeline (package-build.sh, validation.yml, release.sh)
- ✅ T7.4: Advanced Topics (modules 11-25, advanced physics labs, validation scripts)

### Running Tests Locally
```bash
make test              # Run all tests
make test-backend      # Backend unit + integration tests
make test-frontend     # Frontend tests
make test-robot        # Robot Framework suites
make test-ci           # Full CI-equivalent test suite
```

## Hardware Support

| Board | Status | Notes |
|-------|--------|-------|
| ChipWhisperer-Lite | Simulator-ready | Power analysis + glitch labs (simulated) |
| ESP32-S3 | Supported | UART/JTAG debug, firmware flashing |
| CW-Nano | Simulator-ready | Via simulated traces |
| CW-Pro/Husky | Not yet | Planned for v2 |

## Learning Paths

### Path A: Side-Channel Analysis (8 weeks)
Modules 00 → 01 → 02 → 06 → 07 → 08 → 09 → 10

### Path B: Fault Injection (6 weeks)
Modules 00 → 01 → 05 → 11 → 12 → 13

### Path C: Hardware RE (4 weeks)
Modules 00 → 01 → 14 → 15 → 16

### Path D: TEE & Microarch Security (4 weeks)
Modules 00 → 01 → 17 → 18 → 19

### Path E: Advanced Research (ongoing)
Modules 20 → 21 → 22 → 23 → 24

## Key Tools Used
- **ChipWhisperer v6** — SCA and fault injection framework
- **uv** — Fast Python package/venv manager
- **Homebrew** — macOS package management
- **Miniforge/Conda** — M1 libusb arch-compatible Python
- **FastAPI** — Async Python API framework
- **Next.js 16 + React 19** — Modern frontend
- **Tailwind CSS v4** — Utility-first styling
- **Celery + Redis** — Async task queue for attack computation
- **PostgreSQL + pgvector** — Database with vector support
- **MinIO** — S3-compatible object storage
- **Robot Framework** — Test automation framework
- **GitHub Actions** — CI/CD pipeline

## References & Further Reading

### Hardware Hacking
- O'Flynn, C. & Chen, Z.D. (2021). *The Hardware Hacking Handbook*. No Starch Press.
- Riscure Fault Injection Testing Guidelines (2022).

### Standards
- NIST SP 800-193 (Platform Firmware Resiliency)
- FIPS 140-3 (Cryptographic Module Security)
- GlobalPlatform TEE System Architecture
- NIST FIPS 203 (ML-KEM), FIPS 204 (ML-DSA)

### Research Papers
- VUSec (Rowhammer): https://www.vusec.net/
- Lipp, M., et al. (2018). "Meltdown." USENIX Security.
- Kocher, P., et al. (2019). "Spectre Attacks." IEEE S&P.
- Yarom, Y. (2014). "FLUSH+RELOAD." USENIX Security.

### Hardware Security
- Trust-Hub: https://trust-hub.org/
- Tehranipoor, M. et al. (2011). *Introduction to Hardware Security and Trust*. Springer.
- Confidential Computing Consortium: https://confidentialcomputingconsortium.org/

## License
MIT License — See LICENSE file for details.

## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## Getting Help
- Check the `IMPLEMENTATION_PLAN.md` for detailed implementation details
- Check the `MASTER_PLAN.md` for project scope and roadmap
- Open a GitHub Issue for bug reports or feature requests


# WSO2
### admin@dennisleehappy.org