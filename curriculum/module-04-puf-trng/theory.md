# Module 04: Physical Unclonable Functions & True Random Number Generators — Theory

## 1. Introduction

Hardware security primitives — Physical Unclonable Functions (PUFs) and True Random Number Generators (TRNGs) — provide root-of-trust capabilities that cannot be replicated in software. PUFs exploit manufacturing variations to create device-unique fingerprints, while TRNGs extract randomness from physical phenomena.

## 2. Physical Unclonable Functions (PUFs)

### 2.1 Definition

A PUF is a function that maps challenges (inputs) to responses (outputs), where the mapping is determined by uncontrollable manufacturing variations. Each silicon die has a unique PUF response, even if fabricated from the same mask.

**Formal Definition:**
$$
\text{PUF}: C \to R
$$
where $C$ is the challenge space and $R$ is the response space, with the mapping determined by physical characteristics $\theta$ unique to each die.

### 2.2 PUF Classification

**By Challenge-Response Pair (CRP) Density:**

| Type | CRP Count | Examples |
|------|-----------|----------|
| **Weak PUF** | $O(n)$ (linear in hardware) | SRAM PUF, ring oscillator PUF (keyed) |
| **Strong PUF** | $O(2^n)$ (exponential) | Arbiter PUF, majority voting PUF |

**Weak PUFs** are used for key generation (the CRP space is too small for challenge-response authentication).

**Strong PUFs** can be used for authentication protocols due to the large CRP space.

### 2.3 PUF Types

#### 2.3.1 Ring Oscillator PUF (RO-PUF)

**Structure:** Two or more ring oscillators of identical design, where manufacturing variations cause slightly different frequencies.

$$
f_{RO,i} = \frac{1}{2 \cdot N \cdot t_{gate,i}}
$$

where $N$ is the number of inverter stages and $t_{gate,i}$ is the propagation delay of gate $i$.

**Challenge:** Select pairs of ROs and compare their frequencies.
**Response:** 1 if $f_{RO,i} > f_{RO,j}$, 0 otherwise.

**Advantages:**
- Simple digital implementation
- Can be temperature-compensated
- Scales well with technology

**Disadvantages:**
- Susceptible to environmental variations (temperature, voltage)
- Frequency aging over time

**Frequency Difference Distribution:**
$$
\Delta f = f_{RO,i} - f_{RO,j} \sim \mathcal{N}(0, \sigma_{process}^2 + \sigma_{env}^2)
$$

#### 2.3.2 Arbiter PUF

**Structure:** A series of switch blocks connected in a butterfly network. A start signal propagates through the network; its arrival time at one of two output latches determines the response bit.

**Challenge:** Configure the switch blocks (each either "cross" or "straight").
**Response:** Which output latch captures the signal first.

**Mathematical Model:**
$$
\text{delay}(\mathbf{c}) = \sum_{i=1}^{n} c_i \cdot \Delta_i + \text{interaction terms}
$$

where $c_i \in \{-1, +1\}$ represents the switch configuration and $\Delta_i$ represents the delay of path $i$.

**Advantages:**
- Exponentially many CRPs ($2^n$ for $n$ stages)
- Can be used for authentication

**Disadvantages:**
- Vulnerable to machine learning attacks (modeling)
- Requires precise timing measurement
- Reliability degrades with temperature

#### 2.3.3 SRAM PUF

**Structure:** Exploits the random power-on state of SRAM cells. Each cell has two stable states; the initial state at power-up is determined by transistor mismatch.

**Challenge:** Read the SRAM at power-up.
**Response:** The pattern of 0s and 1s in the uninitialized memory.

**Key Properties:**
- Each SRAM cell has a preference (one state is more likely)
- The preference is determined by the ratio of PMOS to NMOS drive strength
- Typically 95-99% of cells are biased (stable)
- The remaining 1-5% are unstable (noise-sensitive)

**Reliability Enhancement:**
$$
r_{reliable} = \text{majority}(r_{power-up,1}, r_{power-up,2}, \ldots, r_{power-up,k})
$$

Take majority vote over $k$ power-up cycles.

#### 2.3.4 Buskeeper PUF

**Structure:** Uses buskeeper flip-flops (weak feedback inverters) instead of standard SRAM cells. The feedback is weaker, making the initial state more sensitive to noise.

**Advantages over SRAM PUF:**
- More uniform response distribution
- Lower manufacturing bias

**Disadvantages:**
- Requires custom cell design
- Lower reliability

### 2.4 PUF Performance Metrics

**Uniqueness:** How different are responses from two different chips?
$$
\text{Uniqueness} = \frac{2}{k(k-1)} \sum_{i=1}^{k-1} \sum_{j=i+1}^{k} \text{HD}(r_i, r_j)
$$
where $\text{HD}$ is the Hamming distance and $r_i, r_j$ are responses from chips $i$ and $j$.
Ideal: 50% (randomly different).

**Reliability:** How stable is the response from the same chip?
$$
\text{Reliability} = 1 - \frac{1}{k} \sum_{i=1}^{k} \frac{\text{HD}(r_i, r_i')}{n}
$$
where $r_i'$ is a re-measurement of $r_i$.
Ideal: 100% (perfectly stable).

**Uniformity:** How balanced are the 0s and 1s in the response?
$$
\text{Uniformity} = \frac{1}{n} \sum_{j=1}^{n} r_j
$$
Ideal: 50% (equal number of 0s and 1s).

**Bit Aliasing:** How consistent is a particular response bit across multiple chips?
$$
\text{Bit Aliasing} = \frac{1}{k} \sum_{i=1}^{k} r_{i,j}
$$
Ideal: 50% (no correlation across chips).

### 2.5 PUF Applications

| Application | PUF Type | Method |
|-------------|----------|--------|
| **Key Generation** | Weak PUF | Extract key from noisy PUF response using fuzzy extractor |
| **Device Authentication** | Strong PUF | Challenge-response protocol |
| **Secure Boot** | Weak PUF | Derive root key for firmware verification |
| **Anti-Cloning** | Any | Unique response cannot be replicated |

### 2.6 Fuzzy Extractor

Since PUF responses are noisy, a fuzzy extractor is used to derive a stable key:

**Gen phase (during enrollment):**
1. Measure PUF response $r$
2. Compute helper data: $w = (r, \text{encode}(r))$
3. Store $w$ (helper data)

**Rep phase (during authentication):**
1. Measure noisy response $r'$
2. Correct errors using $w$: $r'' = \text{decode}(r' \oplus \text{parity}(w))$
3. Derive key: $K = \text{KDF}(r'')$

## 3. True Random Number Generators (TRNGs)

### 3.1 TRNG vs. PRNG vs. DRBG

| Type | Source | Properties |
|------|--------|------------|
| **TRNG** | Physical phenomena (quantum, thermal noise) | Truly random,不可预测,不可重现 |
| **PRNG** | Deterministic algorithm | Periodic, reproducible with seed |
| **DRBG** | Algorithm + entropy input (NIST SP 800-90A) | Deterministic from seed, requires entropy source |

### 3.2 Entropy Sources

#### 3.2.1 Ring Oscillator Jitter

**Principle:** The period of a ring oscillator fluctuates due to thermal noise and shot noise in the transistors.

**Jitter accumulation:**
$$
\sigma_{jitter}(T) = K \cdot \sqrt{T}
$$

where $T$ is the observation time and $K$ is a technology-dependent constant.

**Entropy rate:**
$$
H \approx \frac{1}{2} \log_2\left(\frac{\sigma_j^2}{\sigma_q^2}\right) \text{ bits/sample}
$$

where $\sigma_j$ is the jitter standard deviation and $\sigma_q$ is the quantization noise.

#### 3.2.2 Thermal Noise (Johnson-Nyquist Noise)

$$
V_{thermal} = \sqrt{4 k_B T R \Delta f}
$$

where $k_B$ is Boltzmann's constant, $T$ is temperature, $R$ is resistance, and $\Delta f$ is bandwidth.

This is a fundamental physical noise source — truly random and不可预测.

#### 3.2.3 Shot Noise

$$
\sigma_{shot} = \sqrt{2 q I \Delta f}
$$

where $q$ is the electron charge and $I$ is the average current.

#### 3.2.4 Metastability

A flip-flop driven by an asynchronous signal can enter a metastable state. The time to resolve is exponentially distributed:

$$
P(T_{resolve} > t) \approx e^{-t/\tau}
$$

where $\tau$ is the technology-dependent time constant.

### 3.3 Ring Oscillator TRNG Architecture

**Design:** Two ring oscillators, one sampled by the other:

$$
\text{TRNG output} = \text{sample}(f_{RO,1}, f_{RO,2})
$$

The sampling oscillator's phase relationship to the sampled oscillator is random due to jitter.

**Aging compensation:** Use a feedback loop to maintain the oscillators near the metastable point.

### 3.4 NIST SP 800-90B Requirements

NIST SP 800-90B defines requirements for entropy sources used in DRBGs:

**Health Testing:**
1. **Repetition Count Test:** Flag if the same output repeats more than a threshold
2. **Adaptive Proportion Test:** Flag if one symbol dominates (proportion > threshold)
3. **Compression Test:** Flag if output is compressible (excessive redundancy)

**Min-Entropy Estimation:**
$$
H_{\infty} = -\log_2\left(\max_i p_i\right)
$$

where $p_i$ is the probability of the most likely symbol.

**Collision Entropy:**
$$
H_2 = -\log_2\left(\sum_i p_i^2\right)
$$

**Required entropy for specific security levels:**

| Security Level | Min-Entropy Required |
|----------------|---------------------|
| 128-bit | 128 bits per seed |
| 256-bit | 256 bits per seed |

### 3.5 Entropy Assessment Methods

| Method | Description | Reference |
|--------|-------------|-----------|
| **NIST SP 800-90B** | Repetition count, adaptive proportion, compression | NIST |
| **IID testing** | Test for independent and identically distributed | NIST SP 800-90B |
| **Non-IID testing** | Account for correlations in entropy source | NIST SP 800-90B |
| **Min-entropy estimation** | Estimate the worst-case entropy | NIST SP 800-90B |

### 3.6 TRNG Quality Metrics

**Randomness:** Statistical tests (NIST SP 800-22, Dieharder, TestU01)

**Unpredictability:** Next-bit test, unpredictability to adversary

**Reproducibility:** Not required for TRNG (but required for PRNG)

**Throughput:** Bits per second (typically 1-100 Mbps for hardware TRNGs)

**Bias:** Deviation from 50/50 distribution; typically < 1% for good TRNGs

### 3.7 Beginner Primer: The Entropy Source as a System

Sections 3.2–3.5 above derive the physics and statistics of individual noise mechanisms. It helps to also see how those pieces compose into a single **entropy source**, since that is the unit NIST SP 800-90B actually certifies and the unit a TRNG designer builds. An entropy source is not just "a noisy circuit" — per NIST SP 800-90B it is always three cooperating parts:

1. **Noise source** — the physical process that actually contains unpredictability (thermal noise, RO jitter, metastability, etc.).
2. **Health tests** — continuous, real-time checks that the noise source has not silently failed, degraded, or come under attack (e.g. glitching, temperature manipulation, EM injection). A noise source with no health tests cannot be trusted, because a stuck-at fault or an adversarial fault injection can silently collapse its entropy to near zero while still producing plausible-looking bits.
3. **Optional conditioning** — a post-processing step (von Neumann debiasing, XOR combination, or a cryptographic hash/AES compression) that removes bias and correlation from the raw noise samples before they are used.

**Comparison of common physical noise sources** (consolidating §3.2 into one design-reference table):

| Noise Source | Physical Origin | Typical Implementation | Trade-offs |
|---|---|---|---|
| Thermal (Johnson-Nyquist) noise | Random electron motion in a resistor | Amplifier + comparator/ADC sampling | Stable, well-understood; slow, sensitive to temperature drift |
| Clock/RO jitter | Oscillator phase instability | Multiple ring oscillators sampled/XORed against each other | Fully digital, easy to integrate in FPGA/ASIC; inter-RO correlation must be checked |
| Metastability | Flip-flop resolving an asynchronous transition | Dual-clock or delay-line circuits forced into the metastable window | High bit rate; requires careful timing closure to avoid systematic bias |
| Ring oscillator (RO) array | Accumulated jitter across chained inverters | Phase difference sampling across many ROs | The most common practical digital TRNG primitive; needs enough independent ROs to avoid shared-noise correlation |
| Shot noise / other (optical, RF, quantum) | Discrete-charge or quantum-level effects | Photodiodes, RF front-ends, quantum-optical setups | Very high quality entropy; higher cost and complexity, rarely used in commodity chips |

**Extraction pipeline** — from raw physics to a usable random bit:

```
physical noise → digitizer (ADC / comparator)
              → raw bitstream (biased, possibly correlated)
              → health tests (repetition count test, adaptive proportion test, §3.4)
              → conditioning (von Neumann debiasing / XOR / hash / AES compression)
              → min-entropy estimation (H∞, §3.4)
              → seed for a DRBG (NIST SP 800-90A, e.g. AES-CTR DRBG) or direct key material
```

The min-entropy estimate from the last-but-one step is what determines how many raw bits must be consumed to produce one bit of usable, cryptographically strong output — this is why a "TRNG" is really a certified pipeline, not just a noisy wire.

*Further reading, free downloadable references (CyBOK, NIST SP 800-90B, RISC-V Entropy Source Interface), and a Chinese-language (中文) video course on this exact pipeline are collected in [`curriculum/resources/hardware-security-beginner-resources.md`](../resources/hardware-security-beginner-resources.md).*

### 3.8 Why the Physics Matters: Shannon, Min-Entropy, and Boltzmann

§3.4 already gives the min-entropy formula NIST SP 800-90B certifies against. It's worth stepping back to see where that formula comes from and why the "physical" in "physical noise source" is doing real work, not just marketing.

**Shannon entropy** measures the *average* uncertainty of a random variable $X$ over its outcome space $\mathcal{X}$:

$$
H(X) = -\sum_{x \in \mathcal{X}} P(x) \log_2 P(x)
$$

This is the right quantity for compression and average-case reasoning, but it is the *wrong* quantity for cryptographic key material: an attacker doesn't care about your source's average behavior, only about their best single guess. That's why NIST SP 800-90B certifies **min-entropy** instead — the worst-case (most conservative) measure, driven entirely by the single most likely outcome:

$$
H_\infty(X) = -\log_2\left(\max_{x \in \mathcal{X}} P(x)\right)
$$

(This is the same $H_\infty$ defined in §3.4; it's restated here to contrast it directly with Shannon entropy above.) Because $H_\infty(X) \le H(X)$ always, a source can look "fairly random" on average (decent Shannon entropy) while still being dangerously predictable in the worst case (poor min-entropy) — which is exactly the failure mode the health tests in §3.7 exist to catch.

**Boltzmann entropy** explains *why* a physical noise source has any unpredictability to measure in the first place. In statistical mechanics:

$$
S = k_B \ln \Omega
$$

where $k_B$ is Boltzmann's constant and $\Omega$ is the number of microscopic configurations (microstates) consistent with a system's observed macroscopic state. The thermal noise in §3.2.2 (Johnson-Nyquist noise, $V_{thermal} = \sqrt{4 k_B T R \Delta f}$) is a direct macroscopic signature of $\Omega$: at higher temperature $T$, electrons in a resistor explore more microstates, $\Omega$ grows, and so does the physical entropy available to sample from — which is precisely why hotter chips produce measurably stronger thermal-noise entropy sources, and why some TRNG designs deliberately self-heat or temperature-compensate. This is the classical (non-quantum) floor of "true" randomness: unlike a PRNG's algorithmic state, the noise source's unpredictability is rooted in a physically large $\Omega$, not in an attacker's incomplete knowledge of a deterministic process.

Module 22 (Quantum PUF) picks up this thread where classical statistical mechanics stops being the deepest available explanation — quantum measurement offers a source of randomness that isn't just "many hidden microstates" but appears to be *fundamentally* non-deterministic, and pushes the same entropy concept ($S$, $\Omega$) all the way to black hole thermodynamics and quantum gravity.

**References:** NIST SP 800-90B, *Recommendation for the Entropy Sources Used for Random Bit Generation* (2012).

## 4. Side-Channel Relevance

### 4.1 PUF as Side-Channel Target
- PUF responses can be extracted via power analysis
- SRAM PUF power-up patterns leak through electromagnetic emanation
- Arbiter PUF timing can be measured externally

### 4.2 TRNG as Side-Channel Target
- TRNG output can influence cryptographic operations
- Biased TRNG output can create vulnerabilities in key generation
- TRNG state can be recovered via timing/power analysis

## 5. References

1. Gassend, B. et al. "Silicon Physical Unclonable Functions." ACM DAC, 2002.
2. Suh, G. and Devadas, S. "Physical Unclonable Functions for Device Authentication and Secret Key Generation." ACM DAC, 2007.
3. NIST SP 800-90B: Recommendation for the Entropy Sources Used for Random Bit Generation. August 2012.
4. Dodis, Y. et al. "Fuzzy Extractors: How to Generate Strong Keys from Biometrics and Other Noisy Data." EUROCRYPT 2004.
5. Pappu, R. et al. "Physical One-Way Functions." Science, 2002.
6. Maes, R. and Verbauwhede, I. "Physically Unclonable Functions: A Study on the State of the Art and Future Research Directions." CHES 2010.
7. NIST SP 800-22: A Statistical Test Suite for Random and Pseudorandom Number Generators. 2010.
8. Delvaux, J. et al. "A Survey on Physical Unclonable Functions." IEEE TCAS-I, 2016.
9. Rochez, J. et al. "Reliability Analysis of SRAM-Based Physical Unclonable Functions." DATE, 2015.
10. Tkachenko, A. et al. "Ring Oscillator Based True Random Number Generator." IEEE ISCAS, 2016.
