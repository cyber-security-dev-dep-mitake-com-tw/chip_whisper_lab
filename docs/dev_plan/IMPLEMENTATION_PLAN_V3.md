# IMPLEMENTATION_PLAN_V3.md

## Detailed Implementation Roadmap — Entropy ↔ Frontier Physics Content, and Deployment Platform Migration

### Overview
- **Scope, part A**: Extend the curriculum with the entropy-to-frontier-physics theory chain (Shannon entropy, min-entropy, Boltzmann entropy, Von Neumann entropy, Bekenstein-Hawking, Strominger-Vafa, Ryu-Takayanagi/holography), split across Module 04 (PUF & TRNG) and Module 22 (Quantum PUF), plus real Python verification notebooks and a KaTeX-capable web renderer.
- **Scope, part B**: Fix a set of real, pre-existing deployment bugs discovered while building Docker images for these components, and investigate deployment platforms (WSO2 Choreo → Hugging Face → Koyeb → Serv00/DomCloud) after each was found to not actually meet the "free" requirement or fit the Docker-based workflow.
- **Scope, part C**: Implement the settled-on architecture: FastAPI on a single always-on free container (Koyeb), and a multi-tenant JupyterHub + DockerSpawner stack (one dynamically-spawned, resource-capped container per notebook user, idle-culled) fronted by a Cloudflare Tunnel, runnable on one VPS or local machine via `docker-compose.yml`.
- **Architecture**: Curriculum content (Markdown + Jupyter notebooks) is documentation-only; the Docker/deployment work touches real infrastructure files (`Dockerfile`s, `docker-compose.yml`, `backend/pyproject.toml`, `.github/workflows/release.yml`, new `jupyterhub/`).

## 🎯 Summary of Delivered Artifacts

### Part A — Entropy ↔ Frontier Physics Content
- ✅ `curriculum/module-04-puf-trng/theory.md` — new §3.8 "Why the Physics Matters: Shannon, Min-Entropy, and Boltzmann" (Shannon entropy vs. min-entropy contrast, Boltzmann's $S = k_B \ln \Omega$ tied to thermal-noise physics)
- ✅ `curriculum/module-04-puf-trng/README.md` — Key Topics updated to reference §3.8 and the Module 22 continuation
- ✅ `curriculum/module-04-puf-trng/lab-simulated.ipynb` — new cells: NIST SP 800-90B-style min-entropy estimator over the existing simulated noise bitstreams, and a Boltzmann/microstate-counting demo
- ✅ `curriculum/module-22-qpuf/theory.md` — replaced the skeleton with real content: Von Neumann entropy, Bekenstein-Hawking entropy, Strominger-Vafa D-brane microstate counting, Ryu-Takayanagi holographic entanglement entropy — framed around why quantum measurement is QPUF's strongest entropy source
- ✅ `curriculum/module-22-qpuf/README.md` — replaced templated boilerplate with real learning objectives/topics/references
- ✅ `curriculum/module-22-qpuf/lab-simulated.ipynb` — replaced the 2-cell TODO placeholder with: a 3-tier QRNG (real IBM Quantum → local Qiskit Aer → numpy fallback), NIST-style statistical tests vs. classical `random`, and a QPUF fingerprint sketch from per-qubit measurement statistics
- ✅ `lib/hooks.ts` — added `module-22-qpuf` to `MOCK_MODULES` (same id-mismatch fix pattern as v2's Module 04 fix)

### Part B — Deployment Investigation & Real Bug Fixes
- ✅ `app/Dockerfile` (new) — production Next.js/vinext image; requires **repo root** as build context (not `app/`), since the project's `package.json`/`lib/`/`components/` live at repo root and `app/` is only the Next.js App Router folder
- ✅ `docker-compose.yml` — fixed the frontend service's build `context`/`dockerfile` (was `context: app`, which cannot see root `package.json` — this Dockerfile didn't even exist before this work); fixed **all** `backend`/`celery-worker` environment variables to use the `WHISPERLAB_` prefix the app's `Settings` class actually requires (`env_prefix="WHISPERLAB_"` in `backend/src/whisperlab/config.py`) — every one of `DATABASE_URL`, `REDIS_URL`, `MINIO_*` was previously silently ignored, so `docker-compose up` never actually worked
- ✅ `.github/workflows/release.yml` — fixed the same frontend Docker context bug in the `build-docker` job
- ✅ `backend/Dockerfile` — fixed build order: `pip install -e ".[dev]"` ran *before* `COPY src/ src/`, so the editable install never found the package, crashing every container at runtime with `ModuleNotFoundError: No module named 'whisperlab'`
- ✅ `backend/pyproject.toml` — added missing `python-multipart` dependency (`backend/src/whisperlab/api/traces.py` uses `UploadFile`/`File`/`Form`, which FastAPI requires it for; without it the app raised `RuntimeError` on startup)
- ✅ `jupyter/Dockerfile` (moved from root `Dockerfile.jupyter`) — also fixed: the hardcoded `--NotebookApp.token=''` silently ignored the `JUPYTER_TOKEN` env var `docker-compose.yml` was already setting; now honors it when set, defaults to no-token for local dev when unset
- ✅ `.choreo/component.yaml`, `backend/.choreo/component.yaml`, `jupyter/.choreo/component.yaml` — Choreo Service component configs (schemaVersion 1.2, verified against current WSO2 docs), built before the Choreo payment blocker was raised; kept in the repo as a reference even though the active deployment target has since moved
- ⏸️ **Backend hosting platform: unresolved.** Koyeb was chosen (single free container → FastAPI) but its current free web-service tier could not be confirmed from public docs (see Phase 5) — needs a direct dashboard check.
- ✅ `components/theory-markdown.tsx` (new), `app/learn/[module]/page.tsx`, `lib/hooks.ts`, `app/globals.css` — real KaTeX/Markdown rendering for Module 04 and Module 22 theory content, verified via a live production server (see Phase 3)

### Part D — JupyterHub + DockerSpawner (multi-tenant notebooks)
- ✅ `jupyterhub/Dockerfile` (new) — Hub image with `dockerspawner`, `jupyterhub-nativeauthenticator`, `jupyterhub-idle-culler`
- ✅ `jupyterhub/jupyterhub_config.py` (new) — DockerSpawner config: per-user resource limits, persistent per-user volumes, idle culling, NativeAuthenticator with `allow_all` fixed (see Phase 6)
- ✅ `jupyter/Dockerfile` — fixed a second real bug: base image tag `jupyter/scipy-notebook:python-3.12` no longer exists upstream; changed to `:latest`
- ✅ `docker-compose.yml` — replaced the old single shared `jupyter` service with `jupyter-user-image` + `jupyterhub` + `cloudflared`, on a new `lab-network`
- ✅ Full signup → login → dynamic per-user container spawn → resource-limit enforcement flow verified end-to-end against real running containers (see T6.5) — not just "the images build"

## 📋 Implementation Tasks

### Phase 1: Module 04 — Shannon, Min-Entropy, Boltzmann
#### T1.1 Extend theory.md
- New §3.8 cross-referencing (not duplicating) the existing §3.4 min-entropy formula, contrasting it with Shannon entropy, and deriving Boltzmann's $S = k_B \ln \Omega$ from the existing §3.2.2 thermal-noise material.
- ✅ Done

#### T1.2 Notebook verification cells
- Min-entropy estimator applied to the notebook's existing `good_trng`/`biased_trng`/`periodic_trng` arrays.
- Boltzmann/microstate demo (`Ω = 2^N`, plotted `S/k_B` vs. `N`).
- ✅ Done — executed via `jupyter nbconvert --execute` locally; caught and fixed a real bug where the printed interpretation text contradicted the computed output for `periodic_trng` (claimed "min-entropy ~0" when the naive per-sample estimator actually computes ~1.0 — text corrected to accurately explain why the naive estimator is fooled, which is the actual pedagogical point)

### Phase 2: Module 22 — Von Neumann, Black Hole & Holographic Entropy
#### T2.1 Real theory.md content
- Von Neumann entropy tied to the module's existing decoherence/QPUF material; Bekenstein-Hawking, Strominger-Vafa, Ryu-Takayanagi with the user's 4 exact references (NIST SP 800-90B; Hawking 1975; Strominger & Vafa 1996; Ryu & Takayanagi 2006) — cross-checked against the user-supplied citation list, no invented references.
- ✅ Done

#### T2.2 Real README.md
- Replaced generic templated placeholder objectives/content with real ones matching the new theory.
- ✅ Done

#### T2.3 Real lab-simulated.ipynb
- 3-tier QRNG (IBM Quantum hardware → Qiskit Aer simulator → numpy Bernoulli(0.5) fallback), NIST-style frequency/runs tests vs. classical `random`, QPUF fingerprint sketch.
- ✅ Done — executed via `jupyter nbconvert --execute` locally (no `qiskit` installed in this environment, so this run specifically exercised and confirmed the tier-3 numpy fallback path); all printed interpretations verified against actual computed output

### Phase 3: Web App — Real Markdown/LaTeX Renderer
- **Status: done.** `components/theory-markdown.tsx` (new) wraps `react-markdown` with `remark-math` + `remark-gfm` + `rehype-katex`, importing `katex/dist/katex.min.css`.
- `app/learn/[module]/page.tsx`: added a `THEORY_MARKDOWN` map with real Markdown+LaTeX content for `module-04-puf-trng` (Shannon vs. min-entropy, Boltzmann, noise-source table) and `module-22-qpuf` (Von Neumann, Bekenstein-Hawking, Strominger-Vafa, Ryu-Takayanagi, with the exact 4 citations), rendered via `<TheoryMarkdown>` alongside the existing plain-text sections rather than replacing them.
- `lib/hooks.ts`: added `module-22-qpuf` to `MOCK_MODULES` (same id-mismatch fix pattern as Module 04's v2 fix — without this, `useModule("module-22-qpuf")` would have silently fallen back to the wrong module).
- `app/globals.css`: added `.theory-markdown` styling (tables, code, headings) matching the existing panel design, plus `.katex-display { overflow-x: auto }` so wide equations scroll instead of clipping in the narrow panel layout.
- One fake placeholder URL (`https://github.com/`) was caught and removed from the Module 04 content before this was verified — a reminder to self-check for invented links even in generated Markdown, not just prose.
- ✅ Verified end-to-end, not just "builds": `tsc --noEmit` and `eslint` clean on all touched files; `npm run build` succeeds with `/learn/module-04-puf-trng` and `/learn/module-22-qpuf` in the route manifest; ran the real production server and confirmed via `curl` + `grep` that both routes return 200 and contain genuine server-rendered KaTeX output (`class="katex"` — 9 occurrences on Module 04, 15 on Module 22, each with real MathML), and that the bundled CSS assets actually contain KaTeX's stylesheet rules (not just bare, unstyled class names).

### Phase 4: Docker Build Verification (surfaced Part B's real bugs)
#### T4.1 Backend image
- Built and ran `backend/Dockerfile` end-to-end against a real Postgres container. First attempt failed twice (editable-install ordering bug, then missing `python-multipart`); after both fixes, `curl /api/v1/health` returned `{"status":"ok","version":"0.1.0"}` (HTTP 200).
- ✅ Done

#### T4.2 Frontend image
- Building `app/Dockerfile` against repo-root context first failed on a **separate, unrelated pre-existing bug**: `app/lib/` (a dead, unused duplicate of the real root `lib/`, importing the never-installed `@tanstack/react-query`) and `app/_sites-preview/` (dead code importing the never-installed `react-loading-skeleton`) both carry `"use client"` directives, so vinext's RSC build step scans and bundles them even though nothing imports them — breaking a truly clean build (this didn't surface on the host because a stale `.vinext` cache was masking it). Deleted both dead directories; confirmed fix by clearing the cache (`rm -rf .vinext dist`) and rebuilding clean on host before retrying Docker.
- ✅ Image builds successfully. Container runtime smoke test completed: ran the built image, `curl`-verified `/learn`, `/learn/module-04-puf-trng`, and `/learn/resources` all return HTTP 200 with real rendered content (`grep`-checked for "PUF &amp; TRNG", "Entropy Source as a System", "CyBOK Hardware Security Knowledge Area", "Beginner Resources" — not error/blank pages), matching the rigor used for the backend.

#### T4.3 Jupyter image
- Not yet build-tested (lower priority; no code changes beyond the token-handling fix and the file move).

### Phase 5: Deployment Platform Investigation
Each candidate was checked against current official docs rather than assumed, after the first (Choreo) turned out to have real payment issues:

| Platform | Finding | Verified via |
|---|---|---|
| WSO2 Choreo | Component config schema implemented (schemaVersion 1.2) before the user reported account payment issues and asked to move off it. | Official Choreo docs fetch |
| Hugging Face Spaces | **Docker Spaces require a PRO plan** for personal accounts — only Static (no-backend) Spaces are free. Confirmed via two separate official pages, including the explicit line: "Gradio and Docker Spaces run on compute and require a paid plan to create: PRO for personal accounts." Visibility (public/private) is a separate axis from this and does not change it. | `huggingface.co/docs/hub/spaces-overview`, `spaces-sdks-docker` |
| Koyeb | Current public pricing page shows only paid plans starting at $29/mo, plus an unrelated free *Postgres* offering (5h/month) — no free web-service/Docker compute tier is currently documented. Unconfirmed either way beyond that page; needs a direct dashboard check before committing. | `koyeb.com/pricing` (pricing page only; free-plan-specific doc page 404'd) |
| Serv00 | No Docker — FreeBSD shared shell hosting (SSH + `devil` CLI), deploys managed language runtimes directly, not container images. Doesn't fit a Docker-based workflow at all. 512MB RAM, 3GB storage, no uptime SLA on free tier. | `serv00.com` |
| DomCloud | Does claim Docker support on its free tier, plus built-in PostgreSQL/MariaDB. Free tier: 1.5GB storage across up to 3 sites, 2GB/month outbound, but **apps sleep when idle** and cold-start on the next request. RAM not publicly disclosed. Most plausible fit found so far, but not yet hands-on verified. | `domcloud.co` |

**Additional finding**: `package.json` already has `wrangler` + `@cloudflare/vite-plugin` as dependencies and the `dev`/`build`/`start` npm scripts already target Cloudflare Workers (via `vinext` wrapped with `WRANGLER_LOG_PATH`). The frontend was already built to deploy natively to Cloudflare — no Docker/PaaS needed for it at all, which pairs naturally with the user's Cloudflare-for-DNS decision and would cut the "how many Dockerfiles do we need" problem down to just the backend API.

### Phase 7: Neon / Backblaze B2 Connection Wiring
#### T7.1 backend/.env.example
- Replaced a pre-existing, stale `.env.example` whose field names (`WHISPERLAB_HOST`, `WHISPERLAB_PORT`, `WHISPERLAB_TOKEN`, `WHISPERLAB_SIMULATION`, `WHISPERLAB_DATA_ROOT`) didn't match any field on the real `Settings` class in `config.py` at all — it documented an app that no longer exists.
- New version documents every real `Settings` field, plus Neon's connection-string format (flagging the asyncpg-vs-psycopg `ssl=require` vs. `sslmode=require` gotcha) and Backblaze B2's S3-compatible endpoint format for the `WHISPERLAB_MINIO_*` fields.
- **Important finding, surfaced honestly rather than silently implied as working**: grepped the entire `backend/src` tree and found **zero** boto3/minio/S3 client code anywhere — the `minio_*` settings exist on `Settings` but nothing actually constructs a storage client from them. "Wiring up Backblaze B2" today means the config fields are ready and correctly named; it does not mean object storage is a working feature yet. That would be new scope (implementing an S3 client), not something requested so far.
- ✅ Done, verified by actually loading the file into the real `Settings` class in a matching Python 3.12 venv and printing every field back out — confirmed correct, not just "looks right"

#### T7.2 .gitignore bug fix
- Found the same file was being silently swallowed by the repo's broad `.env*` gitignore pattern, meaning this template (placeholders only, no real secrets) could never actually be committed/shared. Added `!.env.example` / `!**/.env.example` negation patterns.
- ✅ Done, verified via `git check-ignore -v` before and after

#### T7.3 Postgres/MinIO docker-compose services
- Left as-is (still useful for local dev without external accounts) rather than removed — Neon/B2 are opt-in via `.env`, not a forced migration.

### Phase 6: JupyterHub + DockerSpawner (multi-tenant notebooks)
Settled architecture: FastAPI gets Koyeb's single free container (small, no-sleep, 512MB is enough per the user's own sizing estimate: ~150MB for FastAPI). Notebooks move off the old single shared `jupyter` container entirely, replaced with a per-user, resource-capped, dynamically-spawned model (~100MB Hub + up to 1GB/active user, idle-culled), runnable on one 2-4GB VPS or a local machine + Cloudflare Tunnel.

#### T6.1 JupyterHub image
- `jupyterhub/Dockerfile` (new): `jupyterhub/jupyterhub:5` base + `dockerspawner`, `jupyterhub-nativeauthenticator` (self-contained signup/login — no host system users needed, unlike PAMAuthenticator, which doesn't fit a container model), `jupyterhub-idle-culler`.
- ✅ Done — builds successfully

#### T6.2 Hub config
- `jupyterhub/jupyterhub_config.py` (new): `DockerSpawner` targeting the per-user image on a shared `lab-network`, `mem_limit`/`cpu_limit` from env (default 1G/1.0 core), one named volume per user (`jupyterhub-user-{username}`) mounted at their home dir for persistence, idle-culler service at 30min timeout, `NativeAuthenticator` for auth.
- Caught and fixed a real bug during verification: JupyterHub logged `No allow config found, it's possible that nobody can login to your Hub!` — `NativeAuthenticator` handling authentication is a separate layer from JupyterHub's authorization gate; without `c.Authenticator.allow_all = True`, every successfully-authenticated user would still be rejected. Fixed and confirmed the warning disappears.
- ✅ Done

#### T6.3 Per-user notebook image
- Reused the existing `jupyter/Dockerfile` (already fixed in Phase 4/5 — token handling) as the DockerSpawner target image, tagged `whisperlab-jupyter-user:latest`.
- Caught and fixed a real pre-existing bug while building it: the base image tag `jupyter/scipy-notebook:python-3.12` doesn't exist (`docker.io/jupyter/scipy-notebook:python-3.12: not found`) — the Jupyter Docker Stacks project no longer publishes that tag. Fixed to `jupyter/scipy-notebook:latest` (confirmed Python 3.11.6, close enough to the project's 3.11/3.12 target range) and verified the build succeeds.
- ✅ Done

#### T6.4 docker-compose.yml wiring
- Replaced the old standalone `jupyter` service with: `jupyter-user-image` (builds and tags the per-user image), `jupyterhub` (mounts `/var/run/docker.sock` for DockerSpawner, joins `lab-network`), and `cloudflared` (tunnel, reads `CLOUDFLARE_TUNNEL_TOKEN` from `.env`).
- ✅ Done — `docker compose config` resolves cleanly with no undefined-service or missing-network errors (first pass caught and fixed a `depends_on` on a profiled-out service)

#### T6.5 End-to-end verification
Full flow tested against the real built images, not just `docker build` success:
1. Started `jupyterhub` container with `/var/run/docker.sock` mounted, on a real `lab-network`.
2. Confirmed `/`, `/hub/login`, `/hub/signup` all serve correctly (302/200).
3. Signed up a real test user (`alice`) via `POST /hub/signup` — first attempt failed (400) using guessed form field names; inspected the installed `nativeauthenticator` package's actual `signup.html` template to get the real field names (`signup_password`, `signup_password_confirmation`, `email`), retried, got the actual success response.
4. Logged in as `alice`, triggered `/hub/spawn/alice`.
5. Confirmed via `docker ps`/`docker inspect` that DockerSpawner **actually spawned a real sibling container** (`jupyter-alice`, healthy, correct image, on `lab-network`), with memory limit correctly enforced (`HostConfig.Memory` = 536870912 bytes = 512MB, matching the test's configured limit) and CPU limit correctly enforced (`CpuQuota`/`CpuPeriod` = 100000/100000 = 1.0 core).
6. Confirmed the spawned container's own logs show JupyterLab actually starting.
- ✅ Done — this is the most thoroughly end-to-end-verified piece of work in this plan

## 📦 Dependencies
- Notebooks: no new Python dependencies required for Module 04 (numpy/scipy/matplotlib, already used). Module 22's notebook optionally uses `qiskit`, `qiskit-aer`, `qiskit-ibm-runtime` if installed, but has zero hard dependency on them (numpy-only fallback tier).
- Backend: added `python-multipart>=0.0.20,<1` (real bug fix, not new scope).
- Frontend: no new dependencies added yet (Phase 3's `react-markdown`/`remark-math`/`rehype-katex`/`katex` were planned but not installed — deferred).
- JupyterHub image: `dockerspawner==13.*`, `jupyterhub-nativeauthenticator==1.*`, `jupyterhub-idle-culler==1.*` (new, real infra dependency, not a curriculum dependency).

## 🔍 Quality Gates
- Both notebooks executed end-to-end via `jupyter nbconvert --execute` with a clean venv; zero errors; all printed interpretive text cross-checked against actual computed output (caught and fixed one real inconsistency).
- All 4 physics citations (NIST SP 800-90B, Hawking 1975, Strominger & Vafa 1996, Ryu & Takayanagi 2006) verified to match the user-supplied reference list exactly.
- Backend Docker image built and runtime-verified against a real Postgres container (`/api/v1/health` → 200 OK), not just "docker build succeeded."
- Frontend Docker image builds successfully after removing dead code that broke a clean (uncached) build; container runtime smoke test completed (`/learn`, `/learn/module-04-puf-trng`, `/learn/resources` all 200 with real content verified by `grep`, see T4.2).
- Every deployment-platform claim (Choreo schema, HF Spaces pricing, Koyeb pricing, Serv00/DomCloud Docker support) was checked against current official sources rather than stated from memory, after the first assumption (Choreo being viable) and second (HF Docker Spaces being free) both turned out wrong.
- JupyterHub stack verified against real running containers end-to-end (signup → login → dynamic spawn → enforced resource limits), not just image builds — see T6.5. Two real bugs caught this way (missing `allow_all`, nonexistent base image tag) that a build-only check would have missed entirely.

## 🛠️ Development Workflow
- Curriculum content changes (`curriculum/`) are documentation-only.
- Infrastructure changes (`Dockerfile`s, `docker-compose.yml`, `backend/pyproject.toml`, `release.yml`, `jupyterhub/`) were each verified by actually running them (`docker build`, `docker run`, `curl`, real signup/login/spawn flow), not just read for correctness — this is what surfaced all six real pre-existing bugs found across Parts B and D.
- Outstanding for a follow-up session: Phase 3 (KaTeX renderer + wiring Module 04/22 into the web app), T4.3 (Jupyter image build test — superseded by the JupyterHub work but the old standalone-container path is no longer used), confirming Koyeb's free tier directly in its dashboard, Neon/Backblaze B2 connection wiring, and generating a real `CLOUDFLARE_TUNNEL_TOKEN` for the `cloudflared` service (currently a required-but-unset `.env` placeholder).
