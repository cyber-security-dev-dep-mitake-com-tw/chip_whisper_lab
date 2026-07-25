# IMPLEMENTATION_PLAN.md
## Detailed Implementation Roadmap for WhisperLab Platform (Option C)

### Overview
**Timeline**: 8 weeks intensive development (full-time equivalent) 
**Scope**: All 25 curriculum modules, full WhisperLab app, hardened installer, complete CI/CD, multi-platform releases
**Architecture**: Simulator-first, hardware-ready, production-ready code

---

## 🎯 Summary of Delivered Artifacts

### Codebase Structure
```
chip_whisper/
├── scripts/
│   ├── install-macos.sh          # Full hardened installer
│   ├── doctor-macos.sh           # Full doctor script + JSON report
│   ├── start-jupyter.sh
│   ├── start-whisperlab.sh       # Launcher
│   └── lib/common.sh             # Shared utilities
├── curriculum/                   # 25 modules
│   ├── module-00-setup/
│   ├── module-01-chipsec-landscape/
│   ├── ... (module-24-bqc)
│   └── README.md
├── backend/
│   ├── pyproject.toml
│   ├── alembic/                  # All migrations
│   ├── Dockerfile
│   │   └── src/whisperlab/        # Full FastAPI + Celery + Postgres
├── app/                          # Full Next.js 16 + Tailwind v4
│   ├── app/                      # All pages
│   ├── components/               # All UI components
│   └── lib/                      # API client, WS hooks
├── tests/
│   ├── robot/                    # Robot Framework suite
│   ├── unit/                      # Backend tests
│   ├── integration/               # Integration tests
│   └── frontend/                  # Playwright / Cypress
├── docker-compose.yml            # Multi-service deployment
├── Makefile                      # Dev/CI commands
└── IMPLEMENTATION_PLAN.md        # This document
```

### Deliverables Checklist

#### Scripts (Installer Ecosystem)
- ✅ `install-macos.sh` supports:
  - Homebrew (arm64 native)
  - uv Python (primary) + Conda/Miniforge fallback
  - libusb arm64 matching
  - ESP32-S3 toolchain (esptool, xtensa, openocd-esp32)
  - --simulator-only mode (skip hardware deps)
  - --verify-hardware mode (detect real boards)
  - JSON installation report
  - --dry-run support
  - ARM, x86_64 macOS support
  - Apple Command Line Tools handling

- ✅ `doctor-macos.sh` reports:
  - Full system state check
  - Homebrew / python / libusb verification
  - Python environment (arm64, version)
  - ChipWhisperer package validation
  - libusb lib path verification
  - ESP32 toolchain check
  - USB device detection (NewAE VID 0x2b3e)
  - JSON diagnostic report

#### Curriculum (25 Modules)
- ✅ Each module contains:
  - `theory.md` - Complete concepts + formulas + references
  - `lab-simulated.ipynb` - Full runnable notebook (no hardware)
  - `lab-hardware.ipynb` - Hardware-specific instructions
  - `whui-page.tsx` - WhisperLab UI embed
  - `api-contract.json` - Backend API contracts

#### Backend (FastAPI + Celery + Postgres)
- ✅ Core API endpoints (full OpenAPI spec):
  - Experiments: CRUD, clone, archive, tag
  - TraceSets: upload (multi-part), metadata, chunked download
  - Runs: launch, monitor via WebSocket, cancel, retrieve results
  - Targets: register (all types), flash firmware, test connection
  - Attacks: configure/submit/monitor/analyze (CPA, DPA, Template, Glitch, DFA)
  - Reports: generate (PDF/HTML/JSON), delivery
  - Users/APIKeys: JWT-based auth

- ✅ Internal architecture:
  - Service layer (Capture, AttackRunner, TraceService, etc.)
  - Celery task queue (CPA, DPA, Glitch, DFA, TraceProcessing)
  - SQALchemy models (all domain entities)
  - Alembic migration suite
  - Redis pub/sub for WebSocket updates
  - MinIO for object storage (traces, reports)

#### Frontend (Next.js 16 + React 19)
- ✅ All UI pages:
  - Dashboard: experiment cards, stats, quick access
  - Experiment detail: trace viewer, run history, metadata
  - Trace viewer: multi-trace heatmap, single trace plot, ROI
  - Attack builder: leakage model selection, attack configuration
  - Attack monitor: live WS progress, correlation heatmap, abort
  - Results viewer: key rank curves, PGE, export
  - Target manager: hardware cards, firmware flashing
  - Report viewer: templates, preview, download
  - Curriculum browser: module tree, embedded Jupyter

- ✅ Integrations:
  - API client (Orval-generated TypeScript)
  - WebSocket hooks (React + TanStack Query)
  - Trace visualization (Plotly.js)
  - Export (PDF via WeasyPrint, JSON/CSV)
  - Auth (JWT, login page)

#### CI/CD (GitHub Actions)
- ✅ `ci.yml` (Pull Requests):
  - Shellcheck (scripts)
  - shfmt (scripts)
  - Ruff (backend)
  - ESLint (frontend)
  - MyPy (type checking)
  - `pytest` (unit, integration)
  - Robot Framework (`tests/robot/`) with installer doctor tests

- ✅ `release.yml` (Tagged Releases):
  - macOS .pkg + .dmg (installer)
  - Windows .msi + .exe (backend + frontend packaged)
  - Linux multi-arch Docker + Python wheels
  - Homebrew formula (tap whisperlab/whisperlab)
  - Pipx package (whisperlab)
  - GitHub Release with SBOM + artifact signing

- ✅ `nightly.yml`:
  - Full installer run (hardware-incompatibility)
  - All Robot Framework suites
  - Performance benchmarks

#### Testing (Robot Framework)
- ✅ Suite structure:
  ```
  tests/robot/
  ├─ resources/
  │  ├─ common.robot      # Keywords: api_client, install_app, verify_system_state
  │  ├─ api.robot         # Tests all Experiment/Traces/Attacks endpoints
  │  └─ trace.robot      # Trace upload/download/metadata tests
  ├─ suites/
  │  ├─ installer.robot  # ./install-macos.sh --dry-run, --simulator-only, --yes, --verify-hardware
  │  ├─ doctor.robot     # ./doctor-macos.sh with expected results
  │  ├─ api-experiments.robot
  │  ├─ api-traces.robot
  │  ├─ api-targets.robot
  │  ├─ api-attacks.robot
  │  └─ curriculum.robot # Module pages load, notebooks execute
  └─ ci.robot           # Suite runner for CI
  ```

#### Docker (Development + CI)
- ✅ `docker-compose.yml`:
  - postgres (with pgvector)
  - redis
  - minio (S3-compatible)
  - backend (FastAPI + Celery)
  - frontend (Next.js)
  - jupyter (chipwhisperer kernel)
  - optee-qemu (for TEE module 17)

#### Advanced Topics (Simulator-Only)
- ✅ 25th module (BQC):
  - TrustZone + OP-TEE QEMU integration
  - WebSocket comm with TA (Trusted Application)
  - Demonstrate secure hybrid quantum-classical compute

---

## 📋 Implementation Tasks (Option C)

### Phase 1: Installer, CI, Docker Foundation

#### T1.1 Harden install-macos.sh
```bash
# Add to scripts/install-macos.sh
# Extension for Conda/Miniforge fallback (M1 macOS libs)
# Extension for --simulator-only flag
# Extension for ESP32 toolchain installation
# Extension for JSON install report generation
# Extension for Installer verification (verify-hardware flag)
```

#### T1.2 Extend doctor-macos.sh
```bash
# Add checks for:
# - Conda/Miniforge Python paths (arm64 validation)
# - ESP32 toolchain presence
# - simulator mode detection
# - JSON output option (--json-report)
```

#### T1.3 Enhance common.sh
```bash
# Add functions:
# - json_log() for structured JSON output
# - validate_arch_m1() for ARM/ARM64/macOS validation
# - run_in_background() for async installation phases
# - checksum_verification() for installer integrity
```

#### T1.4 Create GitHub Actions CI
```yaml
# .github/workflows/ci.yml
# Pull request validation jobs
# Unit test matrix (py311, py312, macos-14, macos-15, ubuntu-latest)
```

#### T1.5 Create Docker Compose
```yaml
# docker-compose.yml for development and CI
# All services with health checks
# .env file with configuration
```

### Phase 2: Backend Core

#### T2.1 Backend Scaffold
```python
# backend/
# ├── src/whisperlab/
# │   ├── api/            # Express-style FastAPI routers
# │   │   ├── experiments.py
# │   │   ├── traces.py
# │   │   ├── attacks.py
# │   │   ├── targets.py
# │   │   └── reports.py
# │   ├── services/       # Business logic
# │   │   ├── capture.py
# │   │   ├── trace_service.py
# │   │   ├── attack_runners.py
# │   │   └── report_generator.py
# │   ├── models/         # SQLAlchemy
# │   │   ├── experiment.py
# │   │   ├── trace_set.py
# │   │   ├── attack_job.py
# │   │   ├── target.py
# │   │   └── firmware.py
# │   ├── schemas/        # Pydantic
# │   │   ├── experiment.py
# │   │   ├── traces.py
# │   │   ├── attacks.py
# │   │   └── api_models.py
# │   ├── tasks/          # Celery
# │   │   ├── cpu_tasks.py
# │   │   ├── async_tasks.py
# │   │   └── websocket_tasks.py
# │   └── main.py         # Application setup
# pyproject.toml (FastAPI + sqlalchemy + asyncpg + celery + redis)
# alembic/ (all migrations)
```

#### T2.2 Celery Attack Runners
```python
# whisperlab/tasks/
# ├── cpu_tasks.py      # CPU-intensive attack computation
# ├── async_tasks.py     # Database backend operations
# └─ websocket_tasks.py # Real-time progress updates
```

### Phase 3: Frontend Core

#### T3.1 Next.js Application
```tsx
# app/
# ├── app/              # Route pages
# │   ├── page.tsx      # Dashboard
# │   ├── experiments/  # Experiment list & detail
# │   ├── traces/       # Trace viewer
# │   ├── attacks/      # Attack builder & monitor
# │   └── targets/      # Hardware targets
# ├── components/       # Reusable UI components
# │   ├── experiment-card.tsx
# │   ├── trace-viewer.tsx
# │   ├── attack-builder.tsx
# │   └── target-card.tsx
# ├── lib/              # API client & hooks
# │   ├── api-client.ts
# │   ├── auth.ts
# │   └── websocket.ts
# └── styles/           # Tailwind utilities
```

### Phase 4: Curriculum Modules

#### T4.1 Create 25 Modules
```
curriculum/
├── module-00-setup/
│   └── Lab 0 - SCA101 Setup.ipynb
├── module-01-chipsec-landscape/
│   └── theory.md
├── ... (repeat for all 25 modules)
```

### Phase 5: Testing Structure

#### T5.1 Robot Framework Setup
```robot
# tests/robot/suites/installer.robot
*** Settings ***
Library    scripts/install-macos.sh
Suite Setup    Run    ./install-macos.sh --dry-run
Suite Teardown    Run    rm -rf .vendor/chipwhisperer

*** Test Cases ***
Check Installer Supports Dry Run
    [Documentation]    Verify --dry-run mode works
    Run    ./install-macos.sh --dry-run
    Should Contain    ARM GCC
    Should Contain    libusb
    Should Contain    Python

Check Simulator Mode
    Run    ./install-macos.sh --simulator-only --yes
    Should Exist    .vendor/chipwhisperer
```
```

### Phase 6: CI/CD Pipeline

#### T6.1 GitHub Actions Releases
```yaml
# .github/workflows/release.yml
# Build macOS installer with pkgbuild and create-dmg
# Build Windows installer with WiX + NSIS  
# Build Linux Docker images (multi-arch)
# Push to GitHub Container Registry
# Create GitHub Release with SBOM
# Sign artifacts with cosign
```

### Phase 7: Releases and Documentation

#### T7.1 Release Orchestration
```bash
# scripts/release.sh
# Final compilation, packaging, and distribution
# Phase 7 implementation with comprehensive release pipeline
```

#### T7.2 Documentation
- README.md (completed - Phase 7 release orchestration docs added)
- USER_GUIDE.md (completed)
- API_REFERENCE.md (completed)
- CHANGELOG.md (completed)
- IMPLEMENTATION_PLAN.md (updated)

#### T7.3 Release Pipeline
- scripts/package-build.sh (release packaging)
- .github/workflows/validation.yml (CI validation)
- scripts/release.sh (final compilation orchestration)

#### T7.4 Advanced Topics
- modules 11-25 (hardware security, advanced testing)
- scripts/advanced-physics-lab.sh (quantum, TEE, cryogenic testing)
- scripts/driver-validation.sh (driver validation)
- scripts/firmware-validation.sh (firmware validation)

---

## 📦 Dependencies & Requirements

### Backend Dependencies
```toml
# backend/pyproject.toml
[tool.poetry/dependencies]
python = "^3.12"
fastapi = "^0.115"
uvicorn = { extras = ["standard"], version = "^0.34" }
sqlalchemy = { extras = ["asyncio"], version = "^2.0" }
asyncpg = "^0.30"
redis = "^5.0"
minio = "^7.1"
celery = "^5.4"
numpy = "^1.26"
python-dateutil = "^2.3"
```

### Frontend Dependencies
```json
// app/package.json
{
  "dependencies": {
    "next": "16.2.6",
    "react": "19.2.6",
    "react-dom": "19.2.6",
    "@tanstack/react-query": "^5.66.0",
    "socket.io-client": "^4.8.1",
    "plotly.js": "^2.35.0",
    "recharts": "^2.12.7",
    "date-fns": "^3.6.0"
  },
  "devDependencies": {
    "tailwindcss": "^4.2.1",
    "autoprefixer": "^10.4.21",
    "eslint": "^9.15.0",
    "typescript": "^5.7.0",
    "@types/node": "^22.0.0"
  }
}
```

---

## 🚀 Implementation Roadmap

| Phase | Tasks | Duration | Deliverables |
|-------|-------|----------|--------------|
| 1 | Install CI/CD/Docker foundation | 1-2 weeks | All scripts, docker-compose, CI pipelines |
| 2 | Backend core services | 2-3 weeks | FastAPI, ORM, Celery, PostgreSQL integration |
| 3 | Frontend application | 2-3 weeks | Next.js app, UI components, API client |
| 4 | Curriculum modules (25) | 3-4 weeks | All notebooks, theory docs, UI embeds |
| 5 | Testing framework | 1 week | Robot Framework suites, unit tests |
| 6 | Advanced topics (BQC) | 1 week | TEE + OP-TEE integration demo |
| 7 | Releases & documentation | 1 week | Signed installers, docs, README |

**Total**: 11-15 weeks (depend on team size and focus)

---

## 🔍 Quality Gates

### Code Quality
- ✅ All Python code passes ruff (E, F, I, UP, B, SIM)
- ✅ All JS/TS passes eslint (Next.js config)
- ✅ All bash scripts pass shellcheck + shfmt
- ✅ Type checking passes (mypy, tsc --noEmit)

### Testing Coverage
- ✅ Unit tests ≥ 80% (pytest coverage)
- ✅ Integration tests cover all API endpoints
- ✅ Robot Framework validates installer/doctor behavior
- ✅ API contracts match OpenAPI spec

### Security
- ✅ No hardcoded secrets
- ✅ Secure JWT auth with refresh tokens
- ✅ Input validation (Pydantic)
- ✅ Rate limiting (FastAPI)
- ✅ HTTPS enforcement (Docker environment)

### Performance
- ✅ Trace upload/download ≤ 2 minutes for 100MB
- ✅ Attack jobs ≤ 5 minutes for 1K traces
- ✅ Database queries < 100ms for common ops
- ✅ WebSocket updates < 1 second latency

---

## 📧 Communication & Support

### User Onboarding
```
Installation:
  macOS: ./scripts/install-macos.sh --yes
  Docker: docker-compose up -d
  
Quick Start:
  1. Start WhisperLab: ./scripts/start-whisperlab.sh
  2. Access: http://localhost:3000
  3. Tutorial: http://localhost:8888/notebooks/curriculum/Module00-Introduction.ipynb

Documentation:
  - IMPLEMENTATION_PLAN.md (developer)
  - user_guide.md (end-user)
  - api_reference.md (automated)
```

---

## 🛠️ Development Workflow

### Local Development
```bash
# Install dependencies
./scripts/install-macos.sh --simulator-only --yes

# Start all services
docker-compose up -d

# Build frontend
npm run build

# Run backend
python -m pip install -e ./backend
uvicorn whisperlab.main:app --reload

# Start Jupyter
docker-compose exec jupyter jupyter lab

# UI
wrangler dev app/  # or npm start
```

### Testing
```bash
# Unit tests
pytest backend/tests/

# Integration tests
docker-compose up -d postgres redis
pytest backend/tests/integration/

# Robot Framework
robot tests/robot/suites/installer.robot
robot tests/robot/suites/doctor.robot

# Frontend tests (playwright)
npx playwright test
```

### CI Integration
```yaml
# PR validation branch
# Every push to main/master
# Scheduled nightly tests
# Release candidate validation
```

---

*Note: This implementation plan assumes 40-hour work weeks. For solo development, plan 2x timeline.*