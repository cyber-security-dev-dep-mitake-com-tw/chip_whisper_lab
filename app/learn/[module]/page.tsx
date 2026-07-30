"use client";

import { use } from "react";
import { Sidebar } from "@/components/sidebar";
import { useModule } from "@/lib/hooks";
import { useTranslations } from "@/lib/i18n";
import { TheoryMarkdown } from "@/components/theory-markdown";
import Link from "next/link";

// Real Markdown+LaTeX theory content (rendered via TheoryMarkdown / KaTeX),
// sourced from the corresponding curriculum/*/theory.md sections.
const THEORY_MARKDOWN: Record<string, string> = {
  "module-04-puf-trng": `
### Why the Physics Matters: Shannon, Min-Entropy, and Boltzmann

**Shannon entropy** measures the *average* uncertainty of a random variable $X$:

$$
H(X) = -\\sum_{x \\in \\mathcal{X}} P(x) \\log_2 P(x)
$$

This is the right quantity for compression, but the *wrong* one for cryptographic key
material — an attacker only cares about their single best guess. That's why NIST SP
800-90B certifies **min-entropy** instead, the worst-case measure:

$$
H_\\infty(X) = -\\log_2\\left(\\max_{x \\in \\mathcal{X}} P(x)\\right)
$$

Because $H_\\infty(X) \\le H(X)$ always, a source can look fairly random on average while
still being dangerously predictable in the worst case — exactly what NIST SP 800-90B's
health tests exist to catch.

**Boltzmann entropy** explains *why* a physical noise source has unpredictability at all:

$$
S = k_B \\ln \\Omega
$$

where $\\Omega$ is the number of microscopic configurations consistent with a system's
observed macroscopic state. Thermal (Johnson-Nyquist) noise, $V_{thermal} = \\sqrt{4 k_B T R \\Delta f}$,
is a direct macroscopic signature of $\\Omega$: hotter resistors have more thermally-agitated
electrons exploring more microstates, so $\\Omega$ — and the physical entropy available to a
TRNG's digitizer — grows with temperature.

| Noise Source | Physical Origin | Trade-offs |
|---|---|---|
| Thermal (Johnson-Nyquist) noise | Random electron motion in a resistor | Stable, well-understood; slow, temperature-sensitive |
| Clock/RO jitter | Oscillator phase instability | Fully digital; inter-RO correlation must be checked |
| Metastability | Flip-flop resolving an async transition | High bit rate; needs careful timing closure |
| Ring oscillator array | Accumulated jitter across chained inverters | Most common digital TRNG primitive |

*Continues in [Module 22](/learn/module-22-qpuf) with Von Neumann entropy and quantum-gravity entropy. Full derivation in this module's \`theory.md\` §3.8.*
`.trim(),
  "module-22-qpuf": `
### Entropy, Quantum Information & Quantum Gravity

A qubit's state is a density matrix $\\rho$, and its entropy is the **Von Neumann entropy**
— the quantum generalization of Shannon entropy:

$$
S(\\rho) = -\\mathrm{Tr}(\\rho \\ln \\rho)
$$

A qubit in a **pure state** has $S(\\rho) = 0$ — perfectly known, in principle. Once it
**decoheres** (T1/T2 relaxation, gate error, crosstalk — the QPUF entropy sources above), it
becomes a **mixed state** and $S(\\rho) > 0$. Under the standard interpretation of quantum
mechanics, the resulting measurement randomness is believed to be *fundamentally*
non-deterministic — not just unpredictable due to incomplete information, the way classical
thermal noise is (Module 04).

**Bekenstein-Hawking entropy** asks how much information a *region of space* can hold at
maximum. A black hole's entropy scales with the surface area $A$ of its event horizon, not
its volume:

$$
S_{BH} = \\frac{k_B c^3 A}{4 G \\hbar}
$$

unifying thermodynamics ($k_B$), relativity ($c$, $G$), and quantum mechanics ($\\hbar$) in
one formula — the origin of the **holographic principle**.

**Strominger & Vafa (1996)** answered where the microstates $\\Omega$ in $S = k_B \\ln \\Omega$
actually come from: using string theory, they built extremal black holes from D-branes,
counted the microstates directly, and matched the Bekenstein-Hawking formula exactly — the
first microscopic derivation of black hole entropy consistent with general relativity.

**Ryu & Takayanagi (2006)** showed that in AdS/CFT, the entanglement entropy $S_A$ of a
boundary region equals the area of a minimal bulk surface $\\gamma_A$ anchored to it:

$$
S_A = \\frac{\\mathrm{Area}(\\gamma_A)}{4 G_N}
$$

Quantum entanglement entropy — the same object as a QPUF's decohering-qubit entropy above —
appears, in this framework, to be the substrate spacetime geometry itself emerges from.

**References:** NIST SP 800-90B (2012) · Hawking, *Comm. Math. Phys.* 43(3), 199–220 (1975) ·
Strominger & Vafa, *Phys. Lett. B* 379(1-4), 99–104 (1996) · Ryu & Takayanagi, *Phys. Rev.
Lett.* 96(18), 181602 (2006).
`.trim(),
  "module-25-quantum-tunneling-puf": `
### Quantum Tunneling PUF: Fowler-Nordheim Tunneling & Oxide Breakdown

A quantum tunneling PUF pushes the entropy source down to atomic-scale quantum
randomness in the gate oxide, instead of macroscopic delay/threshold-voltage
variation. Tunneling current follows the Fowler-Nordheim relation:

$$
J_{FN} = A E_{ox}^2 \\exp\\left(-\\frac{B}{E_{ox}}\\right), \\qquad E_{ox} = \\frac{V_{ox}}{T_{ox}}
$$

Because $J_{FN}$ is *exponentially* sensitive to oxide thickness $T_{ox}$, even a
single-atomic-layer (~0.3 nm) thickness fluctuation between two adjacent cells
produces an order-of-magnitude tunneling-current gap. Stressing two adjacent
cells at high voltage drives one into **hard oxide breakdown** — a permanent,
irreversible conductive filament — while the other stays insulating; comparing
their read currents (differing by $>10^4\\times$) yields a response bit that is
stable enough to skip ECC entirely ("zero-ECC").

*Full derivation, comparison table vs. delay/memory-based PUFs, and references in this module's \`theory.md\`.*
`.trim(),
  "module-26-puf-applications": `
### PUF-based Applications: Keyless Storage & Fuzzy Extraction

A PUF's core security value comes from **keyless storage**: no key is present
while the chip is powered off, only reconstructed on demand via a fuzzy
extractor:

$$
\\text{Gen}(R) \\to (K, W), \\qquad \\text{Rep}(R', W) \\to K \\ \\text{when}\\ \\mathrm{HD}(R,R') \\le t
$$

where $W$ (helper data) is stored in the clear yet leaks nothing about $K$.
This single primitive underlies seven concrete applications covered in
\`theory.md\`: key generation, IC anti-counterfeiting, lightweight
challenge-response authentication, TRNG entropy, firmware key wrapping,
HUK-based key derivation/isolation, and zero-touch cloud onboarding.

*Reference architecture diagrams and full walkthroughs in this module's \`theory.md\`.*
`.trim(),
  "module-27-puf-hrot-architecture": `
### PUF-based Hardware Root of Trust: Secure Boot Chain

A PUF becomes a Hardware Root of Trust (HRoT) only once combined with an ECC/
helper-data controller, crypto accelerators, and a physically isolated secure
key bus. The resulting PUF-driven secure boot sequence gates CPU release on a
signature check:

$$
\\text{Boot proceeds} \\iff \\mathrm{Verify}_{K_{HUK}}(\\text{Signature}, \\mathrm{Digest}(\\text{Bootloader})) = \\text{true}
$$

The HRoT's memory map is hidden even from a rooted Rich OS, and physical
tamper detection triggers zeroization — since the key was never resident in
static memory, cutting power erases it instantly.

*Full lifecycle management (enrollment, OTA, revocation) and attack-resistance table in this module's \`theory.md\`.*
`.trim(),
  "module-28-efuse-antifuse": `
### eFuse vs. Anti-Fuse: Two Physical OTP Mechanisms

eFuse programs by **destroying** a conductor (electromigration blows a
polysilicon/metal link, raising its resistance by orders of magnitude); Anti-Fuse
programs by **creating** one (a high voltage triggers dielectric breakdown,
punching a conductive filament through an oxide — the same physical mechanism
as the Module 25 quantum tunneling PUF):

| | eFuse | Anti-Fuse |
|---|---|---|
| Native state | Low R (conductive) | High R (insulating) |
| Programmed | High R (link blown) | Low R (filament punched) |
| RE resistance | Lower (visible after delayering) | Higher (buried in dielectric) |

*Comparison table, security implications, and references in this module's \`theory.md\` (note: source reference doc was empty; content compiled from standard OTP literature).*
`.trim(),
  "module-29-hw-security-platform": `
### Hardware Security Platform: The Mailbox Mechanism

A hardware security platform packages the PUF/HRoT, crypto accelerators, and a
dedicated secure CPU into an isolated subsystem the Rich OS cannot read
directly. Communication happens only through a hardware mailbox:

$$
\\text{MainOS} \\xrightarrow{\\text{cmd+data}} \\text{Mailbox} \\xrightarrow{\\text{IRQ}} \\text{Secure CPU} \\xrightarrow{\\text{ACL+crypto}} \\text{Mailbox} \\xrightarrow{\\text{result only}} \\text{MainOS}
$$

The main system only ever receives a *computation result* — never plaintext
key material — which defeats key theft even from a fully root-exploited OS.
ARM PSA, OpenTitan, and TPM 2.0 are the industry's standardized realizations
of this architecture.

*Full architecture breakdown in this module's \`theory.md\`.*
`.trim(),
  "module-30-key-gen-puf": `
### Key Generation with PUF: ECC + Privacy Amplification

Raw PUF output has a bit error rate (BER) of $1\\%$–$15\\%$ — incompatible with
cryptography's avalanche effect, which requires $100\\%$-stable keys. A
multi-layer fuzzy extractor fixes this: a repetition code (majority vote)
followed by a BCH/Reed-Muller code performs **information reconciliation**,
then **privacy amplification** (a universal hash or SHA-256 compression)
turns a long, entropy-sparse corrected string into a short, full-entropy key
— e.g. compressing 2048 bits with only 300 bits of real entropy into a
full-entropy 256-bit key.

*Full Gen/Rep walkthrough, ECC layering rationale, and helper-data zero-leakage requirement in this module's \`theory.md\`.*
`.trim(),
  "module-31-hw-security-background": `
### Background of Hardware Security: Layer 0 and the Fabless Supply Chain

Software security assumes hardware faithfully executes instructions — an
assumption that breaks down once you account for the fragmented, globalized,
fabless IC supply chain (3rd-party IP, offshore foundries, OSAT). Four threat
categories result: Hardware Trojans (trigger + payload), side-channel attacks,
reverse engineering/IP piracy, and counterfeiting/overproduction. Because
silicon is physically immutable post-tape-out, the only complete fix for a
hardware flaw is an expensive re-spin — which is why the industry pushes
**Security-by-Design**, expanding PPA (performance/power/area) into **PPAS**
(+ security) from the specification stage onward.

*Threat taxonomy, Secure HDLC, and standards (ISO/SAE 21434, DARPA SSITH) in this module's \`theory.md\`.*
`.trim(),
};

const THEORY_CONTENT: Record<string, { sections: { title: string; content: string }[] }> = {
  "mod-001": {
    sections: [
      {
        title: "What is Side-Channel Analysis?",
        content:
          "Side-channel analysis (SCA) exploits information leaked through physical implementations of cryptographic systems. Unlike mathematical attacks, SCA targets the hardware itself—power consumption, electromagnetic emissions, timing, and even acoustic signals.",
      },
      {
        title: "Power Analysis Basics",
        content:
          "Every CMOS circuit consumes power when transistors switch states. The power consumption pattern correlates with the data being processed. By measuring power traces during cryptographic operations, an attacker can extract secret keys.",
      },
      {
        title: "Simple vs. Differential Analysis",
        content:
          "Simple Power Analysis (SPA) involves visually inspecting a single power trace to identify operations. Differential Power Analysis (DPA) uses statistical methods across many traces to amplify small signal differences.",
      },
    ],
  },
  "mod-002": {
    sections: [
      {
        title: "Correlation Power Analysis Theory",
        content:
          "CPA uses Pearson correlation to find the relationship between a hypothetical power model and actual measurements. For each possible key byte, we compute the predicted power consumption and correlate it with the measured trace.",
      },
      {
        title: "Power Models",
        content:
          "The Hamming Weight model counts the number of set bits in a value. The Hamming Distance model considers bit transitions between consecutive states. Choice of model significantly affects attack success.",
      },
      {
        title: "Key Recovery Process",
        content:
          "We attack one byte at a time, computing correlations for all 256 possible values. The byte with the highest correlation is the most likely correct key byte. Repeating for all 16 bytes recovers the full AES-128 key.",
      },
    ],
  },
  "module-04-puf-trng": {
    sections: [
      {
        title: "Physical Unclonable Functions (PUFs)",
        content:
          "A PUF maps challenges to responses using uncontrollable manufacturing variations, so every silicon die produces a unique fingerprint even from an identical mask. Weak PUFs (e.g. SRAM PUF, keyed ring-oscillator PUF) have a small challenge-response space and are used for key generation; strong PUFs (e.g. Arbiter PUF) have an exponentially large space and can support challenge-response authentication protocols.",
      },
      {
        title: "PUF Types: RO, Arbiter, SRAM, Buskeeper",
        content:
          "Ring-oscillator PUFs compare the frequencies of identical oscillator pairs, which differ due to process variation. Arbiter PUFs race a signal through a butterfly network of switch blocks and read off which output latch wins. SRAM PUFs exploit the random power-on state of uninitialized memory cells (typically 95–99% of cells are stably biased). Buskeeper PUFs use weak-feedback flip-flops for a more uniform response distribution at the cost of custom cell design.",
      },
      {
        title: "PUF Metrics & Fuzzy Extraction",
        content:
          "PUFs are evaluated on uniqueness (Hamming distance between chips, ideal 50%), reliability (stability of the same chip's response, ideal 100%), uniformity, and bit aliasing. Because responses are noisy, a fuzzy extractor derives a stable key: helper data generated at enrollment corrects errors in later noisy re-measurements before deriving the key.",
      },
      {
        title: "True Random Number Generators (TRNGs)",
        content:
          "A TRNG extracts randomness from physical phenomena — thermal (Johnson-Nyquist) noise, shot noise, clock/ring-oscillator jitter, and flip-flop metastability — as opposed to a PRNG's deterministic algorithm or a DRBG's algorithm-plus-entropy-input construction (NIST SP 800-90A). A common digital architecture samples one ring oscillator's phase against another; the sampling phase is randomized by accumulated jitter.",
      },
      {
        title: "The Entropy Source as a System",
        content:
          "Per NIST SP 800-90B, an entropy source is not just a noisy circuit — it is three cooperating parts: a noise source (the physical process, e.g. RO jitter or thermal noise), continuous health tests (repetition count test, adaptive proportion test — catching a source that silently degrades or is attacked), and optional conditioning (von Neumann debiasing, XOR, or a cryptographic hash/AES compression) that removes bias before the bits seed a DRBG. The pipeline runs: physical noise → digitizer → health tests → conditioning → min-entropy estimation (H∞ = −log₂ max pᵢ) → DRBG seed.",
      },
    ],
  },
};

const DEFAULT_THEORY = {
  sections: [
    {
      title: "Module Overview",
      content:
        "This module covers essential concepts in hardware security and side-channel analysis. Follow the theory sections and complete the practical lab to master the material.",
    },
  ],
};

const difficultyColors: Record<string, string> = {
  beginner: "border-[#3f7547] text-[var(--green)]",
  intermediate: "border-[#6b5b34] text-[var(--amber)]",
  advanced: "border-[#6b3434] text-[var(--red)]",
};

export default function ModuleDetailPage({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const { module: moduleId } = use(params);
  const { data: mod } = useModule(moduleId);
  const t = useTranslations();
  const markdownTheory = THEORY_MARKDOWN[moduleId];
  const theory = THEORY_CONTENT[moduleId] || DEFAULT_THEORY;

  return (
    <main className="lab-shell">
      <Sidebar />
      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">{t("learnModule.eyebrow")}</p>
            <h1>{mod.title}</h1>
          </div>
          <div className="top-actions">
            <Link
              href="/learn"
              className="rounded-lg border border-[var(--line)] bg-transparent px-4 py-2 text-[11px] font-mono text-[var(--muted)] transition hover:border-[#3a5245] hover:text-[var(--ink)]"
            >
              {t("learnModule.back")}
            </Link>
          </div>
        </header>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <span
              className={`rounded-md border px-2 py-0.5 text-[9px] font-mono ${difficultyColors[mod.difficulty]}`}
            >
              {mod.difficulty}
            </span>
            <span className="text-[10px] font-mono text-[var(--dim)]">
              {mod.duration}
            </span>
            <span className="rounded bg-[#1c2922] px-1.5 py-0.5 text-[9px] font-mono text-[var(--muted)] border border-[#2a3a30]">
              {mod.category}
            </span>
          </div>

          <div className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-5">
            <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--green)]">
              {t("learnModule.about")}
            </p>
            <p className="mt-2 text-[13px] text-[var(--muted)] leading-relaxed">
              {mod.description}
            </p>
          </div>

          <div className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-5">
            <p className="mb-4 text-[10px] font-mono uppercase tracking-wider text-[var(--green)]">
              {t("learnModule.theory")}
            </p>
            <div className="space-y-5">
              {theory.sections.map((section, i) => (
                <div key={i}>
                  <h3 className="text-[14px] font-medium text-[var(--ink)]">
                    {section.title}
                  </h3>
                  <p className="mt-2 text-[12px] text-[var(--muted)] leading-relaxed">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
            {markdownTheory && <TheoryMarkdown content={markdownTheory} />}
          </div>

          <div className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-5">
            <p className="mb-2 text-[10px] font-mono uppercase tracking-wider text-[var(--green)]">
              {t("learnModule.furtherReading")}
            </p>
            <p className="text-[12px] text-[var(--muted)] leading-relaxed">
              {t("learnModule.furtherReadingBody")}
            </p>
            <Link
              href="/learn/resources"
              className="mt-3 inline-block rounded-lg border border-[var(--line)] px-3 py-1.5 text-[11px] font-mono text-[var(--green)] transition hover:border-[#3a5245]"
            >
              {t("learnModule.furtherReadingLink")}
            </Link>
          </div>

          {mod.lab_url && (
            <div className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-5">
              <p className="mb-3 text-[10px] font-mono uppercase tracking-wider text-[var(--green)]">
                {t("learnModule.labNotebook")}
              </p>
              <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed border-[var(--line)] bg-[#111915]">
                <div className="text-center">
                  <span className="block text-[32px]">📓</span>
                  <span className="mt-2 block text-[13px] text-[var(--muted)]">
                    {t("learnModule.labNotebookInteractive")}
                  </span>
                  <span className="mt-1 block text-[10px] text-[var(--dim)]">
                    {t("learnModule.labNotebookEmbed")}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Link
              href="/experiments"
              className="flex-1 rounded-lg bg-[var(--green)] px-4 py-3 text-center text-[11px] font-mono font-semibold text-[#10200f] transition hover:bg-[#b2ff9f]"
            >
              {t("learnModule.startExperiment")}
            </Link>
            <Link
              href="/traces"
              className="flex-1 rounded-lg border border-[var(--line)] bg-transparent px-4 py-3 text-center text-[11px] font-mono text-[var(--muted)] transition hover:border-[#3a5245] hover:text-[var(--ink)]"
            >
              {t("learnModule.viewSampleTraces")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
