# Module 08: AES S-box Leakage & DPA/CPA Attacks — Theory

## 1. Why Target the AES S-box?

The AES SubBytes operation is the primary target for power analysis attacks because:

1. **Non-linear**: The S-box introduces the only non-linearity in AES
2. **Key-dependent**: The S-box input depends on both plaintext and key: $s_{out} = S(P \oplus k)$
3. **Correlatable**: The Hamming weight of $s_{out}$ correlates with power consumption
4. **Single-byte**: Each S-box operates on one byte (8 bits), making key recovery tractable (256 guesses per byte)

## 2. AES First Round Leakage

### 2.1 Operations in the First Round

```
AddRoundKey(key[0])
SubBytes
ShiftRows
MixColumns
AddRoundKey(key[1])
```

The **SubBytes** operation is executed after AddRoundKey, making its input:
$$
s_{in} = P \oplus k
$$

where $P$ is the plaintext byte and $k$ is the corresponding key byte.

The S-box output is:
$$
s_{out} = S(P \oplus k)
$$

### 2.2 Why Not Target Later Rounds?

The first round is preferred because:
- Plaintext is known (attacker controls it)
- Only one key byte interacts with each plaintext byte
- Later rounds involve multiple key bytes (due to MixColumns)

## 3. Leakage Model for AES CPA

### 3.1 Hamming Weight Model

The most common leakage model for AES CPA is:

$$
L = \text{HW}(S(P \oplus k))
$$

where:
- $L$ is the leakage value (proportional to power consumption)
- $S$ is the AES S-box
- $P$ is the plaintext byte
- $k$ is the key byte

### 3.2 Hamming Distance Model

A more realistic model considers the register transition from the previous value:

$$
L = \text{HD}(S(P \oplus k), \text{prev\_value})
$$

For the first round, if the previous value is zero (common assumption):
$$
L = \text{HD}(S(P \oplus k), 0) = \text{HW}(S(P \oplus k))
$$

So the HW model is a special case of the HD model.

### 3.3 Power Consumption Model

$$
P(t) = \alpha \cdot L(t) + \beta + \epsilon(t)
$$

where:
- $\alpha$ is the leakage scaling factor
- $\beta$ is static power consumption
- $\epsilon(t)$ is noise (thermal, measurement, etc.)

## 4. CPA Attack on AES — Complete Methodology

### 4.1 Attack Setup

**Known information:**
- Plaintexts $P_0, P_1, \ldots, P_{N-1}$ (16 bytes each)
- Power traces $T_0, T_1, \ldots, T_{N-1}$ (each with $S$ time samples)

**Unknown:**
- Key bytes $k_0, k_1, \ldots, k_{15}$ (the target)

### 4.2 Divide-and-Conquer: Key Byte by Byte

**Key insight:** Each S-box operates independently on one byte. The leakage of S-box $j$ depends only on $P_j$ and $k_j$.

Therefore, each key byte can be recovered independently:

$$
\text{For } j = 0 \text{ to } 15:
\quad k_j = \arg\max_{k^*} \rho(\text{HW}(S(P_j \oplus k^*)), T[:, t])
$$

where $t$ is the time sample where S-box $j$ executes.

### 4.3 CPA Attack Algorithm (One Byte)

```
Input: plaintexts P[N][16], traces T[N][S]
Output: key byte k[0..15]

for byte_idx = 0 to 15:
    for k_guess = 0 to 255:
        for i = 0 to N-1:
            intermediate[i] = HW(S(P[i][byte_idx] XOR k_guess))
        for t = 0 to S-1:
            rho[k_guess][t] = Pearson(intermediate, T[:, t])
    
    best_k[byte_idx] = argmax over k_guess of max over t of |rho[k_guess][t]|
```

### 4.4 Pearson Correlation Calculation

For each key guess $k^*$ and time sample $t$:

$$
\rho(k^*, t) = \frac{\sum_{i=1}^{N} (L_i - \bar{L})(T_{i,t} - \bar{T}_t)}{\sqrt{\sum_{i=1}^{N} (L_i - \bar{L})^2 \cdot \sum_{i=1}^{N} (T_{i,t} - \bar{T}_t)^2}}
$$

where:
- $L_i = \text{HW}(S(P_i \oplus k^*))$ is the hypothesized leakage for trace $i$
- $T_{i,t}$ is the power measurement at time $t$ for trace $i$
- $\bar{L}$, $\bar{T}_t$ are sample means

### 4.5 Expected Results

**Correct key byte:** High correlation spike at the time when S-box is executed

**Wrong key bytes:** Low correlation (noise-level) at all time samples

**Correlation heatmap:**
- X-axis: Key guess (0–255)
- Y-axis: Time sample
- Color: Correlation value
- **Hot spot** at correct key byte + S-box execution time

## 5. Number of Traces Required

The number of traces needed depends on:

$$
N \propto \frac{1}{\text{SNR}^2}
$$

| SNR | Traces Required | Difficulty |
|-----|-----------------|------------|
| High (>10) | 100–500 | Easy |
| Medium (1–10) | 500–5,000 | Moderate |
| Low (0.1–1) | 5,000–50,000 | Hard |
| Very low (<0.1) | 50,000+ | Very hard |

## 6. Practical Considerations

### 6.1 Trace Alignment

If traces are misaligned, correlation decreases:
- Use hardware trigger for best alignment
- Software alignment via cross-correlation
- Template-based alignment

### 6.2 Points of Interest (POI)

Not all time samples contain useful information. Identify POIs:
- Visual inspection of single trace
- t-test (TVLA) analysis
- Principal Component Analysis (PCA)

### 6.3 Noise Reduction

- **Averaging**: Average multiple traces for same plaintext
- **Filtering**: Bandpass filter to remove out-of-band noise
- **PCA**: Project traces onto principal components

### 6.4 First-Round vs. Last-Round Attack

**First-round attack** (most common):
- Plaintext is known
- Target: $S(P \oplus k_0)$

**Last-round attack**:
- Ciphertext is known
- Target: $S^{-1}(C \oplus k_{10}) \oplus k_9$ (for AES-128)
- More complex but can work when plaintext is unknown

## 7. DPA vs. CPA Comparison

### 7.1 DPA on AES

**Selection function:** $D(T_i, k^*) = \text{MSB}(S(P_i \oplus k^*))$

**Differential:**
$$
\Delta(j) = \frac{\text{mean}(T_i[j] \text{ where } D=1) - \text{mean}(T_i[j] \text{ where } D=0)}
$$

**Advantages of CPA over DPA:**
- CPA uses all trace data (continuous correlation)
- DPA partitions traces (loses information)
- CPA is more robust to noise
- CPA provides quantitative measure (correlation)

## 8. Interpreting Results

### 8.1 Correlation Heatmap

```
Key Guess →  0    1    2   ...  43   ...  255
Time 0:    [0.01 0.02 0.00 ... 0.01 ... 0.00]
Time 100:  [0.00 0.03 0.01 ... 0.00 ... 0.02]
...
Time 500:  [0.01 0.02 0.00 ... 0.75 ... 0.01]  ← Hot spot at k=43
...
```

### 8.2 Key Ranking

After CPA, rank all key guesses by their maximum correlation:

| Rank | Key Guess | Max Correlation |
|------|-----------|-----------------|
| 1 | 0x2B | 0.75 |
| 2 | 0xA3 | 0.08 |
| 3 | 0x5C | 0.06 |
| ... | ... | ... |

The correct key should have rank 1 if the attack succeeds.

### 8.3 Probability of Guessing Entropy (PGE)

$$
\text{PGE} = P(\text{rank of correct key} = 1)
$$

PGE over many independent attack runs indicates attack reliability.

## 9. References

1. Mangard, S. et al. Power Analysis Attacks: Revealing the Secrets of Smart Cards. Springer, 2007.
2. Coron, J. and Goli, P. "Correlation Power Analysis with a Leakage Model." CHES 2004.
3. Brier, E. and Faust, S. "Correlation Power Analysis." CHES 2004.
4. Standaert, F. et al. "A Unified Framework for the Analysis of Side-Channel Key Recovery Attacks." EUROCRYPT 2009.
5. O'Flynn, C. and Chen, Z. "ChipWhisperer: An Open-Platform for Hardware Embedded Security Research." COSADE 2014.
6. NewAE Technology. sca101 Lab 3_3: CPA on AES. https://github.com/newaetech/chipwhisperer-jupyter
7. NewAE Technology. sca101 Lab 4_2: CPA on AES. https://github.com/newaetech/chipwhisperer-jupyter
8. Eisenbarth, T. et al. "A Practical Method for Side-Channel Leakage Analysis." CHES 2008.
