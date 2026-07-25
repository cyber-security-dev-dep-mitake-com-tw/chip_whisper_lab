# Module 10: Countermeasures Against Side-Channel Attacks — Theory

## 1. Introduction

Countermeasures against side-channel attacks fall into two main categories:

1. **Masking**: Randomize the intermediate values to decorrelate power consumption from secrets
2. **Hiding**: Randomize the execution timing or power profile to obscure the signal

## 2. Masking Countermeasures

### 2.1 Boolean Masking (First-Order)

**Principle:** Split each sensitive variable $x$ into two (or more) random shares:
$$
x = x_0 \oplus x_1
$$

where $x_0$ is random and $x_1 = x \oplus x_0$.

**Power consumption:**
$$
P = P(x_0) + P(x_1) + \text{noise}
$$

Since $x_0$ is random, the power consumption is decorrelated from $x$.

### 2.2 Masked S-box Computation

**Original S-box:**
$$
y = S(x)
$$

**Masked S-box:**
$$
y_0 = S(x_0 \oplus x_1) \oplus r
$$
$$
y_1 = r
$$

where $r$ is a fresh random mask.

**Secure S-box computation requires:**
1. Unmask input: $x = x_0 \oplus x_1$
2. Compute S-box: $y = S(x)$
3. Apply fresh mask: $y_0 = y \oplus r$
4. Output shares: $(y_0, r)$

### 2.3 Higher-Order Masking

First-order masking protects against single-point leakage. Higher-order masking protects against combining leakage from multiple points.

**Second-order masking:**
Split each variable into 3 shares:
$$
x = x_0 \oplus x_1 \oplus x_2
$$

**Security guarantee:**
- First-order masking: Secure against attacks using 1 trace point
- Second-order masking: Secure against attacks using 2 trace points
- $d$-th order masking: Secure against attacks using $d$ trace points

### 2.4 Masking Overheads

| Order | Shares | Random Bits/Operation | Area Overhead | Speed Overhead |
|-------|--------|----------------------|---------------|----------------|
| 0 (unmasked) | 1 | 0 | 1× | 1× |
| 1st order | 2 | 1 | 2–3× | 2–4× |
| 2nd order | 3 | 2+ | 3–5× | 4–8× |
| 3rd order | 4 | 3+ | 5–8× | 8–16× |

### 2.5 Recombination Attacks

An attacker can attempt to combine multiple shares to recover the secret:
$$
x = x_0 \oplus x_1
$$

**Protection:** Ensure the shares are processed at different times or locations, making correlation difficult.

### 2.6 Refreshing Masks

To prevent higher-order attacks, masks should be refreshed periodically:
$$
x_0' = x_0 \oplus r_{new}
$$
$$
x_1' = x_1 \oplus r_{new}
$$

This ensures $x_0' \oplus x_1' = x_0 \oplus x_1 = x$ (unchanged), but the individual shares are randomized.

## 3. Hiding Countermeasures

### 3.1 Random Delays

**Principle:** Insert random delays between operations to misalign traces.

**Implementation:**
```c
for (int i = 0; i < 16; i++) {
    random_delay();  // Insert random number of NOPs
    process_byte(plaintext[i]);
}
```

**Effect:** Traces become misaligned, reducing correlation.

**Weakness:** Deterministic delays can be filtered; statistical methods can re-align traces.

### 3.2 Shuffling

**Principle:** Randomize the order of independent operations.

**Example (AES SubBytes):**
$$
\text{Original: } S(P_0 \oplus k_0), S(P_1 \oplus k_1), \ldots, S(P_{15} \oplus k_{15})
$$
$$
\text{Shuffled: } S(P_{\pi(0)} \oplus k_{\pi(0)}), S(P_{\pi(1)} \oplus k_{\pi(1)}), \ldots
$$

where $\pi$ is a random permutation.

**Effect:** Each S-box operation occurs at a random time, making byte-level correlation impossible without alignment.

**Weakness:** If the permutation is reused, template attacks can still work.

### 3.3 Random Pipeline Stage Insertion

**Principle:** Insert random operations (dummy computations) into the execution pipeline.

**Implementation:**
```c
for (int i = 0; i < 16; i++) {
    dummy_computation();  // Random operation
    real_computation(i);
    dummy_computation();  // Random operation
}
```

**Effect:** Obscures the timing of real operations.

### 3.4 Hiding Limitations

- Does not remove information leakage, only obscures it
- Statistical methods can often recover alignment
- Increases execution time without providing information-theoretic security
- Limited protection against powerful attackers with unlimited traces

## 4. Threshold Implementations (TI)

### 4.1 Concept

Threshold Implementations (TI) are a provable-secure masking technique based on multi-party computation (MPC) in the secret-sharing setting.

**Key properties:**
- **Non-completeness:** Each sharing does not depend on all input shares
- **Correctness:** The output shares correctly represent the function
- **Security:** Provable security against $d$-th order attacks without assumptions on randomness quality

### 4.2 TI for Boolean Functions

A function $f(x)$ is implemented with $d+1$ shares:
$$
x = x_0 \oplus x_1 \oplus \cdots \oplus x_d
$$

**TI properties:**
1. **Non-completeness:** Each output share $y_i$ depends on at most $d$ input shares
2. **Correctness:** $y_0 \oplus y_1 \oplus \cdots \oplus y_d = f(x_0 \oplus x_1 \oplus \cdots \oplus x_d)$
3. **Uniformity:** For linear functions, the output distribution is uniform (statistical security)

### 4.3 TI for AES S-box

The AES S-box is non-linear and requires decomposition:

$$
S(x) = \text{Inv}(\text{Affine}(x))
$$

**TI decomposition:**
1. Affine layer: Linear, easy to mask
2. GF(2⁸) inversion: Requires special treatment

**GF(2⁸) inversion TI:**
$$
x^{-1} = x^{254} \text{ in } GF(2^8)
$$

This can be decomposed into multiplication operations, each implementable with TI.

### 4.4 TI Security Analysis

| Property | Description |
|----------|-------------|
| **Provable security** | No assumptions on randomness quality needed |
| **Glitch-resilient** | Secure even with combinational glitches |
| **Higher-order** | Naturally provides $d$-th order security |
| **Uniformity** | Output shares are uniformly distributed (for linear functions) |

## 5. Dual-Rail Logic

### 5.1 Principle

Dual-rail logic represents each bit $b$ as a pair of signals $(b, \bar{b})$. In each clock cycle, exactly one of the two signals is high, ensuring constant power consumption regardless of the data value.

### 5.2 WDDL (Wave Dynamic Differential Logic)

**Structure:** Each gate is implemented as a differential pair:

```
WDDL AND gate:
  (a, a') AND (b, b') → (a·b, a'·b' + a'·b + a·b')
```

**Properties:**
- Precharge phase: Both rails set to 0
- Evaluate phase: One rail goes high, one stays low
- Total power consumption is constant (ideally)

### 5.3 TDPL (Two-Rail Dynamic Pseudo-NMOS Logic)

**Structure:** Uses pseudo-NMOS logic with two rails:
- Evaluate: One rail evaluates, the other is precharged
- Precharge: Both rails are precharged

### 5.4 Dual-Rail Limitations

| Issue | Description |
|-------|-------------|
| **Area overhead** | ~2× compared to single-rail |
| **Power overhead** | Higher due to differential signaling |
| **Glitch sensitivity** | Timing mismatches between rails create leakage |
| **Process variation** | Manufacturing variations cause rail imbalance |
| **Routing complexity** | Differential signals require matched routing |

### 5.5 Glitches vs. Leakage

**Glitches:** Spurious transitions in combinational logic before the signal settles.

**Effect on dual-rail logic:**
- If rails are not perfectly balanced, glitches create transient power variations
- These variations can leak information about the data being processed
- Glitch frequency depends on signal paths and routing

**Mitigation:**
- Synchronous dual-rail (register-based)
- Careful routing to balance rail delays
- Additional registers to suppress glitches

## 6. Countermeasure Evaluation Methodology

### 6.1 TVLA (Test Vector Leakage Assessment)

TVLA is the standard method for evaluating countermeasure effectiveness:

**Process:**
1. Collect fixed-input traces ($T_0$) and random-input traces ($T_1$)
2. Compute Welch's t-test at each time sample
3. If $|t| > 4.5$ for any time sample, leakage is detected

**Countermeasure evaluation:**
- Without countermeasure: $|t| >> 4.5$ (clear leakage)
- With countermeasure: $|t| < 4.5$ (no detectable leakage)

### 6.2 CPA Resistance

**Metric:** Number of traces required for successful CPA attack.

**Evaluation:**
1. Run CPA attack with increasing number of traces
2. Record the number of traces where the correct key achieves rank 1
3. Plot PGE vs. number of traces

**Comparison:**

| Countermeasure | Traces Required (1st-order CPA) | Security Level |
|---------------|--------------------------------|-----------------|
| None | 100–500 | None |
| 1st-order masking | 10,000–100,000 | 1st-order |
| 2nd-order masking | >1,000,000 | 2nd-order |
| TI (d=1) | >1,000,000 | Provable 1st-order |

### 6.3 Higher-Order CPA

If a first-order masking countermeasure is in place, the attacker can use higher-order CPA:

**Second-order CPA:**
$$
\rho_2(t_1, t_2) = \text{Corr}(L_i(t_1) \cdot L_i(t_2), T_i[t_1] \cdot T_i[t_2])
$$

This combines leakage from two time samples to recover the secret.

### 6.4 Countermeasure Selection Guide

| Threat Model | Recommended Countermeasure |
|-------------|---------------------------|
| Low-cost, low-security | Hiding (random delays) |
| Medium security | 1st-order Boolean masking |
| High security | 2nd-order masking or TI |
| Very high security | TI with higher order + hiding |
| Regulatory compliance | TVLA testing + documented evaluation |

### 6.5 Evaluation Report Structure

A complete countermeasure evaluation should include:

1. **Threat model:** What attacks are being defended against
2. **Countermeasure description:** Detailed implementation details
3. **TVLA results:** t-test statistics with and without countermeasure
4. **CPA resistance:** Number of traces required for key recovery
5. **Higher-order analysis:** Results of second-order CPA attempts
6. **Performance overhead:** Area, speed, and power impact
7. **Compliance:** NIST SP 800-90B, FIPS 140-3 requirements

## 7. Side-Channel Resistant Design Principles

### 7.1 Defense in Depth

Combine multiple countermeasures:
- **Masking** + **Hiding** + **Constant-time implementation**
- No single countermeasure is perfect; layering provides robust security

### 7.2 Formal Verification

Use formal methods to prove countermeasure correctness:
- **TI:** Provable security guarantees
- **Masking verification:** Tools like SILVER, REBECCA
- **Constant-time verification:** Tools like ct-verif, timecop

### 7.3 Testing and Certification

- **TVLA testing** for leakage detection
- **CPA/DPA testing** for attack resistance
- **FIPS 140-3** certification for cryptographic modules
- **Common Criteria** evaluation for security products

## 8. References

1. Mangard, S. et al. Power Analysis Attacks: Revealing the Secrets of Smart Cards. Springer, 2007.
2. Prouff, E. and Rivain, M. "A Generic Security Proof Methodology for Masking Schemes." 2009.
3. Nikova, S. et al. "Threshold Implementations Against Side-Channel Attacks and Glitches." CHES 2006.
4. Popp, T. and Mangard, S. "Masked Dual-Rail Pre-Charge Logic: DPA-Resistance Without Routing Constraints." CHES 2005.
5. NIST SP 800-90B: Recommendation for the Entropy Sources Used for Random Bit Generation. 2012.
6. Goodwill, G. et al. "A Testing Methodology for Side-Channel Resistance Validation." NIST IR 8000, 2011.
7. Benadjila, R. et al. "A Generic Tool for Software Evaluation of Side-Channel Countermeasures." CHES 2014.
8. Coron, J. and Goli, P. "Correlation Power Analysis with a Leakage Model." CHES 2004.
9. Standaert, F. et al. "A Unified Framework for the Analysis of Side-Channel Key Recovery Attacks." EUROCRYPT 2009.
10. Bilgin, B. et al. "Threshold Implementations: A Masking Countermeasure for Hardware." IEEE TCAD, 2015.
