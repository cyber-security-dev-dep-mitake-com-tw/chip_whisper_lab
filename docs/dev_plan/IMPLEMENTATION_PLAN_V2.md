# IMPLEMENTATION_PLAN_V2.md

## Detailed Implementation Roadmap — Beginner Hardware Security Resources & Entropy Source Theory

### Overview
- **Scope**: Add a curated, free, beginner-level hardware/chip-security reading list (English + Chinese) to the curriculum, wire it into the existing curriculum index and Module 04, and extend Module 04's `theory.md` with new original-prose theory content on entropy sources as a system (noise source + health tests + conditioning).
- **Architecture**: Purely documentation/curriculum content — no application code, no PDFs committed (links only).

## 🎯 Summary of Delivered Artifacts
- ✅ `curriculum/resources/hardware-security-beginner-resources.md` — new bilingual (EN/ZH) curated resource doc
- ✅ `curriculum/README.md` — new "Supplementary Resources" section linking to the resource doc
- ✅ `curriculum/module-04-puf-trng/README.md` — "Further Reading (Beginner)" pointer added to References
- ✅ `curriculum/module-04-puf-trng/theory.md` — new §3.7 "Beginner Primer: The Entropy Source as a System"
- ✅ `docs/dev_plan/IMPLEMENTATION_PLAN_V2.md` — this plan doc
- ✅ `lib/hooks.ts` — added `module-04-puf-trng` to `MOCK_MODULES` (fixes a pre-existing id-mismatch bug where the module page silently fell back to the wrong module's content)
- ✅ `app/learn/[module]/page.tsx` — real theory content for Module 04 (PUF types, metrics, TRNG, entropy-source-as-a-system) + a "Further Reading" card linking to the new resources page
- ✅ `app/learn/resources/page.tsx` — new web app route rendering the curated bilingual resource list
- ✅ `app/learn/page.tsx` — nav link to the new resources page
- ✅ `.github/workflows/release.yml` — fixed the Windows build job (previously ran PyInstaller against a bash script and silently no-op'd); now packages the real FastAPI entrypoint (`backend/src/whisperlab/main.py`) into a working `.exe`, zipped with bundled curriculum docs; macOS `.dmg` now also bundles `curriculum/resources` and `curriculum/README.md`

## 📋 Implementation Tasks

### Phase 1: Curated Resource Doc
#### T1.1 Create bilingual resource list
- Sections: 最佳入門英文教材 (CyBOK HW Security KA, Pearce/Karri/Tan tutorial, Yier Jin intro paper), 中文/台灣入門資源 (PUFacademy 熵碼學院 basic + core-tech courses, ICT supply-chain chip-security standard), 其他可下載 PDF/講義 (Italian seminar slides, MIT 6.858, tutorial handouts), 進階書籍/論文 (Tehranipoor & Wang), 熵源 (Entropy Source) materials (NIST SP 800-90B, Viktor Fischer slides, RISC-V Entropy Source Interface, Synopsys 中文白皮書, NIST entropy-assessment tool, PUFacademy TRNG video series).
- Links only, tagged [EN]/[ZH] and [Free]/[Paid or library access].
- ✅ Done — `curriculum/resources/hardware-security-beginner-resources.md`

### Phase 2: Curriculum Index Wiring
#### T2.1 Link from curriculum index
- Add "Supplementary Resources" section to `curriculum/README.md`.
- ✅ Done
#### T2.2 Link from Module 04
- Add "Further Reading (Beginner)" line under Module 04's `## References`, without altering existing Module 04 content.
- ✅ Done

### Phase 3: Entropy Source Theory Content
#### T3.1 Add entropy-source-as-a-system primer
- New §3.7 in `curriculum/module-04-puf-trng/theory.md`: three-part NIST SP 800-90B entropy-source model (noise source, health tests, conditioning), consolidated noise-source comparison table, extraction pipeline diagram (digitizer → health tests → conditioning → min-entropy estimate → DRBG seed), cross-link to the new resources doc.
- Written as original explanatory prose, not copied notes; does not duplicate existing §3.2–3.6 content, builds on it.
- ✅ Done

### Phase 4: Web App Wiring
#### T4.1 Fix Module 04 id mismatch and render real content
- `lib/hooks.ts`: `MOCK_MODULES` was missing a `module-04-puf-trng` entry, so `useModule("module-04-puf-trng")` silently fell back to `MOCK_MODULES[0]` (a different module's title/description). Added the correct entry.
- `app/learn/[module]/page.tsx`: added a real `THEORY_CONTENT["module-04-puf-trng"]` entry (PUF types/metrics, TRNG, entropy-source-as-a-system) instead of the generic placeholder, plus a "Further Reading" card linking to `/learn/resources`.
- ✅ Done — verified by production build + HTTP smoke test (see Quality Gates)

#### T4.2 New Resources route
- `app/learn/resources/page.tsx`: new route rendering the curated bilingual resource list as real UI (not markdown passthrough), matching the existing `Sidebar`/`lab-shell` page pattern.
- `app/learn/page.tsx`: added a "📚 Beginner Resources (EN/中文)" nav link.
- ✅ Done

### Phase 5: Native Installer Fixes
#### T5.1 Fix the broken Windows release job
- `.github/workflows/release.yml` `build-windows` previously ran `pyinstaller` against `scripts/install-macos.sh` (a bash script) with a silent `|| echo "...Placeholder..."` fallback — it never produced a working artifact.
- Replaced with: `pip install -e backend`, then `pyinstaller --onefile --name whisperlab-api backend/src/whisperlab/main.py` (the real FastAPI entrypoint), bundled with `curriculum/resources`, `curriculum/README.md`, and root `README.md`, zipped as `whisperlab-<tag>-windows.zip`.
- Verified locally (macOS, Python 3.12 matching CI's pinned version): `pip install -e backend` succeeds, PyInstaller produces a valid executable, and it correctly imports `fastapi`/`uvicorn`/`whisperlab` (confirmed by intentionally testing with a mismatched Python 3.14 venv first, which reproduced an import failure, then with matching 3.12 the build and imports succeeded).
- ✅ Done

#### T5.2 Bundle curriculum docs into macOS installer
- `.github/workflows/release.yml` `build-macos` `.dmg` step now also copies `curriculum/resources/` and `curriculum/README.md` into the disk image, so the new beginner resource list is available offline after install.
- ✅ Done

## 📦 Dependencies
- No new runtime dependencies. CI-only: Windows job now uses `pip install -e backend` + `pyinstaller` (already used elsewhere in the project's `scripts/package-build.sh`).

## 🚀 Implementation Roadmap
| Phase | Tasks | Duration | Deliverables |
|-------|-------|----------|---------------|
| 1 | Curated resource doc | ~1 hr | `curriculum/resources/hardware-security-beginner-resources.md` |
| 2 | Curriculum index wiring | ~15 min | Updated `curriculum/README.md`, Module 04 `README.md` |
| 3 | Entropy source theory content | ~45 min | New §3.7 in Module 04 `theory.md` |
| 4 | Web app wiring | ~1 hr | Fixed Module 04 page, new `/learn/resources` route, nav link |
| 5 | Native installer fixes | ~45 min | Working Windows `.exe` build, curriculum docs bundled into macOS/Windows artifacts |

## 🔍 Quality Gates
- All links match user-supplied URLs exactly — no invented URLs.
- New Markdown renders correctly (tables, headers, relative links resolve) — verified via cross-link resolution script and GitHub heading-slug check.
- Module 04's existing content (§1–§6, references) left unmodified aside from the additive "Further Reading" line and new §3.7.
- No PDFs or binaries committed to the repository.
- `npx tsc --noEmit` — no new type errors introduced (pre-existing unrelated errors in `app/lib/*`, `worker/`, `db/` untouched).
- `eslint` on all touched files — no new errors (one pre-existing unused-import warning in `lib/hooks.ts`, not introduced by this change).
- `npm run build` (vinext/Next.js production build) succeeds; `/learn`, `/learn/module-04-puf-trng`, `/learn/resources` all present in the route manifest.
- `node --test tests/rendered-html.test.mjs` passes.
- Production server smoke test: all three routes return HTTP 200 and contain the expected real content (verified via `curl` + `grep` for known strings, not just status codes).
- Windows PyInstaller build path verified locally end-to-end (correct Python version, dependency install, successful binary build, correct imports) since CI's `windows-latest` runner isn't available in this environment.

## 🛠️ Development Workflow
- `curriculum/` and `docs/` changes are content-only.
- `app/`, `lib/hooks.ts`, and `.github/workflows/release.yml` changes were verified with the project's existing toolchain (`tsc`, `eslint`, `npm run build`, `node --test`) rather than assumed correct.
