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

## 📦 Dependencies
- None (documentation-only change, no new packages or build steps).

## 🚀 Implementation Roadmap
| Phase | Tasks | Duration | Deliverables |
|-------|-------|----------|---------------|
| 1 | Curated resource doc | ~1 hr | `curriculum/resources/hardware-security-beginner-resources.md` |
| 2 | Curriculum index wiring | ~15 min | Updated `curriculum/README.md`, Module 04 `README.md` |
| 3 | Entropy source theory content | ~45 min | New §3.7 in Module 04 `theory.md` |

## 🔍 Quality Gates
- All links match user-supplied URLs exactly — no invented URLs.
- New Markdown renders correctly (tables, headers, relative links resolve).
- Module 04's existing content (§1–§6, references) left unmodified aside from the additive "Further Reading" line.
- No PDFs or binaries committed to the repository.

## 🛠️ Development Workflow
- Content-only change on the `dev` branch; no build/test suite applies (Markdown curriculum content).
