# CHANGELOG

## [v0.1.0] — 2026-07-25

### Added
- Hardened macOS installer with --simulator-only, --conda-fallback, --install-esp32 flags
- JSON install report generation (INSTALL_REPORT.json)
- Extended doctor script with --json output and ESP32/Conda checks
- 25-module curriculum (modules 00-24) covering chip security, SCA, fault injection, PQC, quantum security
- Full-stack WhisperLab application (Next.js 16 + FastAPI)
- Backend API with experiments, traces, attacks, targets, reports endpoints
- Alembic migrations configuration for all 5 SQLAlchemy models
- TanStack Query hooks for all entity types
- Robot Framework integration test suites
- Docker Compose with 7 services (postgres, redis, minio, backend, celery, frontend, jupyter)
- GitHub Actions CI/CD with lint, typecheck, unit tests, installer dry-run, Robot Framework
- Makefile with dev/CI/release commands
- Docker build verification script
- Release preparation script
- CI validation workflow enhancement
- Comprehensive README with API reference and curriculum table

### CI/CD
- PR validation: shellcheck, shfmt, ruff, eslint, mypy, tsc, pytest, installer dry-run, robot
- Release pipeline: macOS .pkg/.dmg, Windows .exe/.msi, Docker multi-arch, GitHub Release creation
- Release validation: full lint/typecheck/test pipeline with validation.yml

### Curriculum Modules
- 00-10: Core SCA theory and labs (installed in Phase 1)
- 11-15: Fault injection, JTAG/SWD, hardware RE (filled in Phase 2.7)
- 16-24: HW Trojans, TEE/Cryptarch, Cache SC, Transient Exec, PQC, QKD, QPUF, Cryo-CMOS, BQC (filled in Phase 2.7)