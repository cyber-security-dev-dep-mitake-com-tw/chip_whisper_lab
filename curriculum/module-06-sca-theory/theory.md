# Module 06: Side-Channel Analysis Theory — Theory

## 1. Introduction

Side-channel attacks exploit information leaked through the physical implementation of a cryptographic system. Unlike mathematical attacks that target the algorithm itself, side-channel attacks target the hardware: power consumption, electromagnetic emanation, timing, or even acoustic signals.

This module covers the three main power analysis techniques: SPA, DPA, and CPA.

## 2. Leakage Models

### 2.1 Hamming Weight (HW) Model

The Hamming Weight of a value $x$ is the number of set bits:

$$
\text{HW}(x) = \sum_{i=0}^{n-1} x_i
$$

where $x_i$ is the $i$-th bit of $x$.

**Assumption:** Power consumption is proportional to the number of bits flipping from 0 to 1 during a register write.

**Example:**
- $\text{HW}(0x\text{FF}) = 8$
- $\text{HW}(0x00) = 0$
- $\text{HW}(0x55) = 4$

**Leakage model:**
$$
P \approx k \cdot \text{HW}(x) + P_{leak} + \text{noise}
$$

where $k$ is a scaling factor, $P_{leak}$ is static power, and noise is measurement error.

### 2.2 Hamming Distance (HD) Model

The Hamming Distance between two consecutive values $x_{old}$ and $x_{new}$ is the number of bits that change:

$$
\text{HD}(x_{old}, x_{new}) = \text{HW}(x_{old} \oplus x_{new})
$$

**Assumption:** Power consumption during a register transition is proportional to the number of bits that flip.

**Example:**
- Register changes from 0x00 to 0xFF: $\text{HD} = 8$
- Register changes from 0xAA to 0x55: $\text{HD} = 8$ (all bits flip)
- Register changes from 0xFF to 0xFF: $\text{HD} = 0$ (no change)

**Leakage model:**
$$
P \approx k \cdot \text{HD}(x_{old}, x_{new}) + P_{static} + \text{noise}
$$

### 2.3 Model Comparison

| Model | Assumption | Typical Use |
|-------|-----------|-------------|
| **HW** | Power ∝ # of 1-bits in intermediate value | Single register read/write |
| **HD** | Power ∝ # of bits changing between states | Register transition (more realistic) |

**When to use which:**
- HW: When the intermediate value is directly observable (e.g., during SubBytes output)
- HD: When the previous value is known or predictable (e.g., after AddRoundKey)

## 3. Simple Power Analysis (SPA)

### 3.1 Principle

SPA involves directly interpreting power traces to identify operations and extract secrets. It requires no statistical processing — just visual inspection of the power trace.

### 3.2 SPA on RSA

In modular exponentiation $C = M^d \bmod n$, each bit of the private key $d$ corresponds to either:
- **Square** operation (if bit = 0): Short, low power consumption
- **Multiply** operation (if bit = 1): Long, high power consumption

**Example RSA SPA trace:**
```
Bit:  1  0  1  1  0  0  1
Ops:  SM SM M SM SM SM M SM
```
where S = Square, M = Multiply.

### 3.3 SPA on ECC

In scalar multiplication $P = kG$, each bit of the scalar $k$ corresponds to:
- **Double** operation (if bit = 0): Regular pattern
- **Double and Add** (if bit = 1): Higher peak

### 3.4 Limitations of SPA

- Requires clean traces (low noise)
- Sensitive to measurement setup
- Can be defeated by constant-time implementations
- Limited to operations with visible timing/power differences

## 4. Differential Power Analysis (DPA)

### 4.1 Principle

DPA uses statistical analysis of many power traces to extract secrets. It overcomes SPA's noise limitations by correlating power consumption with a hypothesized intermediate value.

### 4.2 DPA Attack Process

1. **Collect $N$ traces:** Each trace $T_i[j]$ is a power measurement at time $j$ for input $P_i$
2. **Hypothesize key:** For each possible key guess $k^*$:
   - Compute intermediate value: $v_i = f(P_i, k^*)$ for all traces
   - Partition traces based on $v_i$ (e.g., MSB = 0 or 1)
3. **Compute differential:** Calculate the difference in average power between partitions
4. **Identify peak:** The key guess with the largest differential peak is most likely correct

### 4.3 DPA Selection Function

$$
D(T_i, k^*) = \begin{cases}
1 & \text{if } \text{HW}(f(P_i, k^*)) > \text{threshold} \\
0 & \text{otherwise}
\end{cases}
$$

**DPA differential:**
$$
\Delta(j) = \frac{\sum_{i: D=1} T_i[j]}{N_1} - \frac{\sum_{i: D=0} T_i[j]}{N_0}
$$

where $N_1$ and $N_0$ are the number of traces in each partition.

### 4.4 DPA on AES

**Target operation:** SubBytes output: $s_{out} = S(P \oplus k)$

**Selection function:** Use MSB of SubBytes output:
$$
D(T_i, k^*) = \text{MSB}(S(P_i \oplus k^*))
$$

**Attack flow:**
1. Collect $N$ traces with random plaintexts
2. For each key guess $k^*$ (0–255 for one byte):
   - Compute $s_{out} = S(P_i \oplus k^*)$ for all traces
   - Partition traces by MSB of $s_{out}$
   - Compute differential power at each time sample
3. Correct key byte shows the largest differential peak

## 5. Correlation Power Analysis (CPA)

### 5.1 Principle

CPA uses the Pearson correlation coefficient to measure the linear relationship between hypothesized intermediate values and actual power consumption. It is more robust than DPA and is the standard method for power analysis attacks.

### 5.2 Pearson Correlation Coefficient

$$
\rho_{X,Y} = \frac{\text{Cov}(X,Y)}{\sigma_X \cdot \sigma_Y} = \frac{\sum_{i=1}^{N} (x_i - \bar{x})(y_i - \bar{y})}{\sqrt{\sum_{i=1}^{N} (x_i - \bar{x})^2} \cdot \sqrt{\sum_{i=1}^{N} (y_i - \bar{y})^2}}
$$

where:
- $X$ = vector of hypothesized intermediate values (one per trace)
- $Y$ = vector of power measurements at a specific time sample
- $\bar{x}, \bar{y}$ = sample means
- $\sigma_X, \sigma_Y$ = sample standard deviations

**Properties:**
- $\rho \in [-1, 1]$
- $\rho = 1$: Perfect positive correlation
- $\rho = 0$: No correlation
- $\rho = -1$: Perfect negative correlation

### 5.3 CPA Attack Process

1. **Collect $N$ traces:** Each trace $T_i[j]$ for random input $P_i$
2. **For each key byte $k^*$ (0–255):**
   a. Compute intermediate value: $v_i = \text{HW}(S(P_i \oplus k^*))$ for all traces
   b. For each time sample $j$:
      - Compute $\rho(k^*, j) = \text{Pearson}(v, T[:, j])$
3. **Identify correct key:** The key byte with the highest $|\rho|$ across all time samples

### 5.4 CPA on AES — Detailed Attack

**Leakage model:** Hamming weight of SubBytes output
$$
v_i = \text{HW}(S(P_i \oplus k^*))
$$

**Attack algorithm (for byte $b$ of the key):**

```
For k = 0 to 255:
    For each trace i:
        intermediate[i] = HW(S(P_i[b] ⊕ k))
    For each time sample j:
        rho[k][j] = Pearson(intermediate, traces[:, j])
```

**Expected result:** The correct key byte shows a correlation spike at the time when SubBytes is executed. Other key bytes show low correlation.

### 5.5 CPA vs. DPA

| Property | DPA | CPA |
|----------|-----|-----|
| Statistical measure | Differential mean | Pearson correlation |
| Noise tolerance | Moderate | High |
| Attack complexity | O(256 × N × T) | O(256 × N × T) |
| Key recovery accuracy | Good | Excellent |
| Practical usage | Historical | Current standard |

## 6. Test Vector Leakage Assessment (TVLA)

### 6.1 Purpose

TVLA (also known as the t-test method) is a statistical test to determine whether a cryptographic implementation leaks side-channel information. It does not require knowledge of the key — it simply detects leakage.

### 6.2 TVLA Methodology

**Two test sets:**
- $T_0$: Fixed-input traces (e.g., all plaintexts = 0x00)
- $T_1$: Random-input traces (e.g., random plaintexts)

**Welch's t-test at each time sample $j$:**

$$
t(j) = \frac{\bar{T_0}(j) - \bar{T_1}(j)}{\sqrt{\frac{s_0^2(j)}{N_0} + \frac{s_1^2(j)}{N_1}}}
$$

where:
- $\bar{T_0}(j), \bar{T_1}(j)$ = mean power at time $j$ for fixed and random sets
- $s_0^2(j), s_1^2(j)$ = sample variances
- $N_0, N_1$ = number of traces in each set

**Decision rule:**
- If $|t(j)| > 4.5$ (for $\alpha = 0.05$ with large $N$), leakage is detected at time $j$
- NIST recommends collecting at least 1000 traces per set

### 6.3 Fixed vs. Random Testing

**Fixed set ($T_0$):** All traces use the same input (e.g., plaintext = 0x00)
- If the implementation is constant-time and data-independent, the power trace should be the same for all traces
- If leakage exists, the fixed set shows consistent power patterns

**Random set ($T_1$):** Each trace uses a random input
- Captures the full range of data-dependent power variations
- Combined with fixed set, reveals implementation leakage

### 6.4 Univariate vs. Multivariate TVLA

**Univariate:** Test each time sample independently (most common)
**Multivariate:** Test multiple time samples simultaneously (more sensitive but more complex)

## 7. Practical Considerations

### 7.1 Trace Acquisition

**Requirements:**
- Sampling rate: ≥ 1 GS/s for modern processors
- Synchronization: Trigger signal for precise alignment
- Number of traces: Typically 1000–100,000 for CPA
- Noise reduction: Averaging, filtering

**Common issues:**
- Trigger jitter: Misaligned traces reduce correlation
- Electromagnetic noise: Reduces signal-to-noise ratio
- Countermeasures: Masking and hiding reduce leakage

### 7.2 Signal-to-Noise Ratio (SNR)

$$
\text{SNR} = \frac{\text{Var}(\text{signal})}{\text{Var}(\text{noise})}
$$

**For CPA to succeed:** SNR must be positive. Higher SNR means fewer traces needed.

**Number of traces required (approximate):**
$$
N \approx \frac{C}{\text{SNR}^2}
$$

where $C$ is a constant depending on the target and attack complexity.

### 7.3 Points of Interest (POI)

The time samples where the target operation leaks information are called Points of Interest (POI). Identifying POIs is critical for efficient attacks.

**Methods:**
- Visual inspection of single trace
- t-test (TVLA) to identify leaking time samples
- Principal Component Analysis (PCA) for dimensionality reduction

## 8. Side-Channel Metrics

### 8.1 Guessing Entropy (GE)

$$
\text{GE} = \log_2(\text{rank of correct key})
$$

- GE = 0: Correct key is top guess
- GE = 7 (for one byte): Correct key is rank 128

### 8.2 Probability of Guessing Entropy (PGE)

The probability that the correct key has a given rank across multiple attack runs.

### 8.3 Key Ranking

After CPA, rank all key guesses by correlation. The correct key's rank indicates attack success:
- Rank 1: Attack succeeded
- Rank ≤ 10: Near-success (key can be brute-forced)
- Rank > 10: Attack failed (need more traces or different approach)

## 9. References

1. Kocher, P. "Timing Attacks on Implementations of Diffie-Hellman, RSA, DSS, and Other Systems." CRYPTO 1996.
2. Mangard, S. et al. Power Analysis Attacks: Revealing the Secrets of Smart Cards. Springer, 2007.
3. Coron, J. and Goli, P. "Correlation Power Analysis with a Leakage Model." CHES 2004.
4. Standaert, F. et al. "A Unified Framework for the Analysis of Side-Channel Key Recovery Attacks." EUROCRYPT 2009.
5. NIST SP 800-90B: Recommendation for the Entropy Sources Used for Random Bit Generation. 2012.
6. Goodwill, G. et al. "A Testing Methodology for Side-Channel Resistance Validation." NIST IR 8000, 2011.
7. Joy, A. et al. "A Methodology for Hidden Markov Model Side-Channel Analysis." CHES 2019.
8. Eisenbarth, T. et al. "A Practical Method for Side-Channel Leakage Analysis." CHES 2008.
9. Brier, E. and Faust, S. "Correlation Power Analysis." CHES 2004.
10. Prouff, E. and Rivain, M. "A Generic Security Proof Methodology for Masking Schemes." 2009.
