# Beginner Hardware Security Resources / 晶片安全入門教材與資源

A curated, free/downloadable reading list for learners starting out in chip security / hardware security. All entries are external links (no PDFs are stored in this repo). Where useful, entries are tagged with **[EN]** / **[ZH]**, and **[Free]** / **[Paid or library access]**.

This list complements [Module 04: PUF & TRNG](../module-04-puf-trng/README.md), which covers the same entropy-source topics at a more technical, working-engineer depth. Start here for the big picture, then go deeper in Module 04.

## 1. 最佳入門英文教材 / Best English-Language Introductions

| Resource | Description | Link |
|---|---|---|
| CyBOK Hardware Security Knowledge Area (v1.0.1) | The most complete and clearly structured hardware-security body of knowledge (~41 pages). Covers the hardware design lifecycle, Root of Trust, side-channel attacks, hardware Trojans, PUFs, and trusted computing — ideal for building a full mental map as a beginner. **[EN] [Free]** | https://www.cybok.org/media/downloads/Hardware_Security_v1.0.1.pdf |
| High-Level Approaches to Hardware Security: A Tutorial (Pearce, Karri, Tan, 2023) | Introduces hardware security problems and high-level mitigation approaches through two teaching case studies. **[EN] [Free]** | https://arxiv.org/abs/2302.13445 |
| Introduction to Hardware Security (Yier Jin, 2015) | A classic short survey paper for quickly building core concepts. **[EN] [Free]** | https://www.mdpi.com/2079-9268/5/4/17 |

## 2. 中文／台灣相關入門資源 / Chinese-Language & Taiwan Resources

- **《IC設計中必須懂的資安基礎》（熵碼學院 / PUFacademy）** — A free, beginner-level online course produced in Taiwan (~8 hours). Covers chip-security international standards, hardware Root of Trust, the security-chip market ecosystem, and chip security design concepts. **[ZH] [Free]**
  - ShareCourse 學聯網: course listing on the ShareCourse platform
  - PUFacademy 官網: https://pufacademy.com/basic.html
  - (Includes video; some sections have accompanying slides. The series also has intermediate and advanced tracks.)
- **資通訊產品供應鏈資安標準 第一部：晶片安全** — Industry-standard-oriented document on ICT supply-chain security, Part 1: Chip Security. **[ZH]**

### PUFacademy Quick Links
- 官網 (Homepage): https://pufacademy.com/
- 初階課程 (Basic course): https://pufacademy.com/basic.html
- 核心技術 (Core technology track): https://pufacademy.com/tech.html
- YouTube: search "PUFacademy 熵碼學院"

## 3. 其他可下載的實用 PDF / 講義 / Other Downloadable Handouts

| Resource | Description | Link/Notes |
|---|---|---|
| Introduction to Hardware Security (Italian seminar slides) | 59-page slide-style introduction. **[EN] [Free]** | search "Introduction to Hardware Security" seminar slides |
| Hardware Security (MIT 6.858 lecture notes) | Leans toward supply chain and practical attacks. **[EN] [Free]** | MIT 6.858 course materials |
| Emerging Technologies and Hardware Security Tutorial Handouts | Conference tutorial handout series. **[EN] [Free]** | conference tutorial archives |

## 4. 進階但可參考的書籍／論文集 / Advanced Reference Books

- **Introduction to Hardware Security and Trust** (Tehranipoor & Wang, Springer) — the classic textbook; some chapters may be available via ResearchGate or a library. **[EN] [Paid or library access]**
- For further papers, search keywords: *Hardware Trojan*, *Physical Unclonable Function*, *Side-Channel Analysis*.

## 5. 熵源（Entropy Source）教學教材 / Entropy Source Teaching Materials

Entropy sources are the core building block of TRNGs (True Random Number Generators) — see [Module 04 §3.7](../module-04-puf-trng/theory.md#37-beginner-primer-the-entropy-source-as-a-system) for the underlying theory in this repo.

### 中文 / Chinese (most directly relevant)

- **PUFacademy 熵碼學院《真隨機亂數硬體實現》系列** — Free, complete Chinese-language practical course on TRNG implementation. Part of the "硬體安全核心技術" (Hardware Security Core Technology) track, Topic 4. **[ZH] [Free]**
  - Part 1: 偽隨機亂數產生 (PRNG) — ~2 hours
  - Part 2: 真隨機亂數產生 (TRNG principles & architecture) — ~1h16m
  - Part 3: 通過標準測試 (Passing NIST statistical tests) — ~1h24m

### 英文標準與權威教材 / English Standards & Authoritative Material

| Resource | Description | Link |
|---|---|---|
| NIST SP 800-90B | *Recommendation for the Entropy Sources Used for Random Bit Generation.* The authoritative definition of the entropy-source model, health tests, and entropy estimation (IID / non-IID). **[EN] [Free]** | https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-90B.pdf |
| Viktor Fischer — Random Number Generators for Cryptography | Excellent introductory slide deck clearly explaining TRNG design and evaluation. **[EN] [Free]** | https://summerschool-croatia.cs.ru.nl/2014/slides/Random%20Number%20Generators%20for%20Cryptography.pdf |
| RISC-V Entropy Source Interface | A modern implementation example showing how to design an entropy-source interface into a processor. **[EN] [Free]** | https://eprint.iacr.org/2020/866.pdf |

### 其他實用資源 / Other Practical Resources

- Synopsys 中文白皮書《真正安全系统的真随机数发生器》(True Random Number Generators for Truly Secure Systems) — Synopsys white paper (Chinese). **[ZH]**
- NIST SP800-90B_EntropyAssessment (open-source entropy estimation tool): https://github.com/usnistgov/SP800-90B_EntropyAssessment
