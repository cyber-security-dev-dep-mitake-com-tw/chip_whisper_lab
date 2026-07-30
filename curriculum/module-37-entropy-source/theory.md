# Module 37: Entropy Source — Theory

*(Source: compiled from `docs/references/ch-1/entropy source.md`.)*

## 1. What Is Entropy? The Bedrock of Cryptography (什麼是熵？密碼學的絕對基石)

**Shannon Entropy**, from information theory, quantifies unpredictability. A binary source that always outputs `0` has zero entropy; a source with a perfect, independent 50/50 split has 1 bit of entropy per output bit. Every cryptographic protocol — TLS handshakes, AES root-key generation, replay-attack-resistant nonces — assumes an attacker cannot guess the underlying random string. The source of that unpredictability is the **Entropy Source**.

## 2. Hardware / Physical Entropy Sources (硬體/物理熵源)

Physical entropy sources underpin **True Random Number Generators (TRNG)**, exploiting physical phenomena that classical determinism cannot predict:

- **Thermal Noise (Johnson-Nyquist Noise)**: random voltage fluctuation from electron thermal motion in a conductor; exists whenever $T > 0\text{K}$; flat (white) spectrum, Gaussian distribution — an excellent cryptographic entropy source.
- **Ring Oscillator (RO) Phase Jitter**: the most widely used digital-SoC TRNG mechanism. An odd chain of inverters has a nominally fixed oscillation frequency, but transistor thermal/flicker noise causes small random timing drift (jitter) at each edge. Sampling a fast RO with a slow RO converts this jitter into random `0`/`1` bits.
- **Quantum Tunneling**: in advanced processes, an electron's probability of tunneling through an ultra-thin gate oxide is governed by quantum mechanics — absolutely random and unpredictable (same mechanism as Module 25's PUF).
- **Metastability**: when a flip-flop's input violates setup time, its output briefly enters an undefined state between 0 and 1; which way it resolves depends on internal thermal noise (the mechanism exploited by SRAM PUF).

**Trade-offs**: physical sources offer *information-theoretic security* (unpredictable even against unlimited compute), but suffer low output rate (limited noise bandwidth) and environmental sensitivity — e.g. an attacker who injects a strong EM signal can frequency-lock a ring oscillator, collapsing its entropy to near zero.

## 3. Software / Non-Physical Entropy Sources (軟體/非物理熵源)

Systems without a dedicated TRNG collect unpredictability from an OS-maintained **entropy pool**, fed by asynchronous events: mouse movement/timing, keystroke inter-arrival delay, disk-seek timing, network packet arrival timestamps, IRQ timing, memory-allocation jitter, and context-switch timing (feeding `/dev/random` / `/dev/urandom` on Linux).

**Trade-offs and threats**:
- **VM entropy starvation**: virtual machines have no real mouse/keyboard/disk; hypervisor-simulated interrupts starve the entropy pool, occasionally causing *identical* SSH keys to be generated across VMs.
- **Boot-time vulnerability**: in the first seconds after boot, the entropy pool is empty or highly predictable — generating security keys at this moment is extremely weak.

## 4. From Entropy Source to Cryptographic Key: Conditioning (從熵源到密碼學金鑰的轉換)

Raw entropy-source output cannot be used directly as a key — it usually has bias (e.g. keyboard space-bar over-represented, or circuit asymmetry skewing 1s vs. 0s).

- **Von Neumann Extractor**: groups bits in pairs; `01` → output `1`, `10` → output `0`, `00`/`11` discarded. Removes 0/1 imbalance but wastes significant bandwidth.
- **Cryptographic hash conditioning (Hash_DF)**: per NIST SP 800-90B, raw physical bits are compressed through AES-CBC-MAC or SHA-256 ("entropy compression").

**Hybrid architecture (TRNG seeds a DRBG)** — used because pure TRNG is too slow and pure software entropy is unsafe at boot:

1. An on-chip **TRNG** (physical entropy source) produces a high-strength 256-bit **seed**.
2. The seed feeds an algorithmic **PRNG/DRBG** (e.g. AES-CTR mode).
3. The DRBG acts as a "high-speed pump," generating GB/s of random output from that one truly-random seed.
4. The system periodically **reseeds** from the physical TRNG to preserve long-term security.

## 5. NIST SP 800-90B: Quantifying Entropy Quality (NIST SP 800-90B 熵評估的數學模型)

We cannot just "feel" that a noise source is random — SP 800-90B provides a rigorous mathematical framework whose sole goal is computing a conservative **lower bound** on unpredictability.

### 5.1 Why Min-Entropy, Not Shannon Entropy?

Shannon entropy measures *average* uncertainty:

$$
H_{shannon} = -\sum_{i=1}^{k} p_i \log_2(p_i)
$$

Cryptography cares about the **worst case**, not the average: a TRNG that outputs perfect randomness 99% of the time but glitches to a fixed `00000000` 1% of the time still has high Shannon entropy on average — yet an attacker who simply guesses that fixed 1%-probability output breaks the system. NIST SP 800-90B therefore mandates **Min-Entropy**, defined only by the probability of the single most likely outcome $p_{max}$:

$$
H_{min} = -\log_2(p_{max})
$$

If $p_{max} = 1$ (fully predictable), $H_{min} = 0$. If 256 outcomes are each equally likely ($p_{max} = 2^{-8}$), $H_{min} = 8$ bits.

### 5.2 IID vs. Non-IID Evaluation Tracks (IID vs. Non-IID 雙軌機制)

NIST 800-90B requires collecting **1,000,000 raw samples** from the chip and running one of two tracks:

- **IID track**: if permutation tests and a chi-square test confirm the sequence is Independent and Identically Distributed, evaluation is simple: find the most frequent value's empirical probability $\hat{p}$, derive a conservative upper confidence bound on $p_{max}$ via the binomial distribution, then apply $H_{min} = -\log_2(p_{max})$.
- **Non-IID track**: real IC noise usually has weak Markovian memory (voltage ripple, thermal residue, clock coupling) and fails the IID test. NIST then requires running **10 distinct non-IID estimators** and taking the **minimum** result across all 10 as the final, most-conservative $H_{min}$ — e.g. Markov Estimate, Collision Estimate (birthday-paradox based), LZ78 Compression Estimate, and Longest Repeated Substring (LRS) Estimate.

### 5.3 Online Health Tests (線上健康測試)

SP 800-90B also mandates real-time RTL health tests whose alarm thresholds are derived mathematically from $H_{min}$ and an acceptable false-positive rate $\alpha$ (e.g. $2^{-30}$). For the **Repetition Count Test (RCT)**, the trigger count $C$ is:

$$
C = 1 + \left\lceil \frac{-\log_2 \alpha}{H_{min}} \right\rceil
$$

Example: $H_{min} = 0.5$ bits/sample, $\alpha = 2^{-30}$ ⟹ $C = 1 + \lceil 30/0.5 \rceil = 61$. If the physical entropy source repeats the same sample 61 times in a row, the hardware must assume environmental attack (or laser fault injection) and halt key supply immediately.

## 6. References

1. NIST SP 800-90B — *Recommendation for the Entropy Sources Used for Random Bit Generation*.
2. Linux Kernel Archives — `random.c` source code documentation.
3. Baando, M., et al. (2015). *A Hardware Ring Oscillator True Random Number Generator*. IEEE.
4. Turan, M., et al. (2018). *Status Report on the Second Round of the NIST Post-Quantum Cryptography Standardization Process*.
