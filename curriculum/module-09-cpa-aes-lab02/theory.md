# Module 09: Full CPA Attack Walkthrough — Theory

## 1. ChipWhisperer Analyzer Overview

ChipWhisperer Analyzer is the analysis component of the ChipWhisperer platform. It provides both a GUI and Python API for performing side-channel analysis attacks including CPA, DPA, and template attacks.

### 1.1 Analyzer Workflow

```
┌─────────────────────────────────────────────────────┐
│ 1. IMPORT TRACES                                     │
│    - Load .hdf5 or .trs trace files                  │
│    - Import associated plaintext/key data            │
├─────────────────────────────────────────────────────┤
│ 2. CONFIGURE LEAKAGE MODEL                           │
│    - Select attack type (CPA/DPA)                     │
│    - Define intermediate value function               │
│    - Set leakage model (HW, HD, identity)            │
├─────────────────────────────────────────────────────┤
│ 3. RUN ATTACK                                        │
│    - Process traces through correlation engine        │
│    - Compute correlation for all key guesses          │
├─────────────────────────────────────────────────────┤
│ 4. ANALYZE RESULTS                                   │
│    - View correlation heatmap                         │
│    - Inspect key ranking per byte                     │
│    - Calculate PGE                                    │
└─────────────────────────────────────────────────────┘
```

### 1.2 Trace File Formats

| Format | Description | Tools |
|--------|-------------|-------|
| `.hdf5` | Hierarchical Data Format (ChipWhisperer native) | ChipWhisperer Analyzer |
| `.trs` | Trace set format (standard) | Various SCA tools |
| `.npy` | NumPy array format | Python scripts |

### 1.3 Importing Traces in Python API

```python
import chipwhisperer as cw

# Load traces from ChipWhisperer capture
project = cw.project.Project("my_project.hdf5")

# Access traces and data
traces = project.traces
plaintexts = project.textin
known_keys = project.known_key  # If known for verification
```

## 2. Leakage Model Configuration

### 2.1 Intermediate Value Function

For AES CPA, the intermediate value is the S-box output:

$$
\text{intermediate} = S(\text{plaintext} \oplus \text{key\_guess})
$$

**ChipWhisperer Analyzer configuration:**

```python
from chipwhisperer.analyzer.attacks.cpa import CPA
from chipwhisperer.analyzer.attacks.cpa.leakage_models import (
    leakage_model, hw_int, hd_int
)

# Create attack object
attack = CPA(project, scope)

# Set intermediate value function
# For AES SubBytes:
attack.set_target(
    intermediate=lambda pt, key: sbox[pt ^ key],
    leakage=hw_int  # Hamming weight model
)
```

### 2.2 Leakage Model Options

| Model | Function | Description |
|-------|----------|-------------|
| `hw_int` | Hamming Weight | HW of intermediate value |
| `hd_int` | Hamming Distance | HD between consecutive values |
| `identity` | Identity | Raw intermediate value |
| `bit` | Bit selection | Single bit of intermediate |

### 2.3 Custom Leakage Models

```python
# Custom model for specific operation
def custom_leakage(pt, key):
    sbox_out = sbox[pt ^ key]
    return bin(sbox_out).count('1')  # Hamming weight

attack.set_target(
    intermediate=lambda pt, key: sbox[pt ^ key],
    leakage=custom_leakage
)
```

## 3. Running the Attack

### 3.1 API Attack Execution

```python
# Configure attack
attack.set_target(
    intermediate=lambda pt, key: sbox[pt ^ key],
    leakage=hw_int
)

# Run attack
attack.run()

# Get results
best_keys = attack.best_key  # Array of best key guesses per byte
key_ranking = attack.key_ranking  # Full ranking per byte
```

### 3.2 GUI Attack Execution

1. Open ChipWhisperer Analyzer
2. Load trace file
3. Select "CPA" attack type
4. Configure intermediate value: `S-box` with input `PT XOR Key`
5. Select leakage model: `Hamming Weight`
6. Click "Run Attack"
7. View results in the Results tab

### 3.3 Attack Parameters

| Parameter | Description | Typical Value |
|-----------|-------------|---------------|
| Number of traces | Total traces to process | 500–50,000 |
| Trace start | First sample to analyze | 0 |
| Trace end | Last sample to analyze | Full trace |
| Guess range | Key value range per byte | 0–255 |

## 4. Correlation Heatmap Interpretation

### 4.1 Structure

The correlation heatmap is a 2D matrix:
- **X-axis**: Key guess (0–255)
- **Y-axis**: Time sample
- **Color**: Correlation value ($|\rho|$)

### 4.2 Reading the Heatmap

**Correct key byte:**
- Shows a distinct "hot spot" (high correlation) at the time when the target operation executes
- The hot spot is at the correct key guess value

**Wrong key bytes:**
- Show random, low correlation across all time samples
- No distinct hot spots

**Example heatmap:**
```
Key →   0x00  0x01  ...  0x2B  ...  0xFF
Time 0:  0.01  0.02  ...  0.01  ...  0.00
Time 10: 0.00  0.01  ...  0.00  ...  0.02
...
Time 50: 0.01  0.03  ...  0.75  ...  0.01  ← Correct key at time 50
...
```

### 4.3 Common Patterns

| Pattern | Meaning |
|---------|---------|
| Single hot spot | Correct key, clean leakage |
| Multiple hot spots | Multiple leaking operations (e.g., multiple rounds) |
| Diffuse correlation | Low SNR, more traces needed |
| No hot spots | Attack failed (wrong model, misaligned traces) |

## 5. Key Ranking Analysis

### 5.1 Key Ranking Process

For each key byte:
1. Compute maximum $|\rho|$ across all time samples for each key guess
2. Sort key guesses by $|\rho|$ (descending)
3. Assign rank: rank 1 = highest correlation

### 5.2 Ranking Visualization

```python
import matplotlib.pyplot as plt

# Plot key ranking for byte 0
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# Left: All key guesses sorted by correlation
axes[0].bar(range(256), sorted_max_corr)
axes[0].set_title('Key Guesses Ranked by Correlation')
axes[0].set_xlabel('Rank')
axes[0].set_ylabel('|Correlation|')

# Right: Zoomed view of top 10
axes[1].bar(range(10), sorted_max_corr[:10])
axes[1].set_title('Top 10 Key Guesses')
axes[1].set_xlabel('Rank')
axes[1].set_ylabel('|Correlation|')
```

### 5.3 Interpreting Key Rankings

| Rank | Meaning | Action |
|------|---------|--------|
| 1 | Correct key recovered | Success |
| 2–10 | Near miss | Can brute-force remaining |
| >10 | Attack failed | Need more traces or different approach |

## 6. Probability of Guessing Entropy (PGE)

### 6.1 Definition

The **Guessing Entropy (GE)** for a single attack run is:

$$
\text{GE} = \log_2(\text{rank of correct key})
$$

- GE = 0: Correct key is rank 1
- GE = 1: Correct key is rank 2
- GE = 7: Correct key is rank 128

The **Probability of Guessing Entropy (PGE)** is the probability that the correct key has rank 1:

$$
\text{PGE} = P(\text{rank of correct key} = 1)
$$

### 6.2 Computing PGE

To compute PGE, run the CPA attack multiple times (or on subsets of traces):

```python
n_runs = 100
n_traces_subset = 500  # Use subset of traces per run
pge_count = 0

for run in range(n_runs):
    # Randomly select traces
    indices = np.random.choice(n_total_traces, n_traces_subset, replace=False)
    subset_traces = traces[indices]
    subset_plaintexts = plaintexts[indices]
    
    # Run CPA on subset
    best_key_byte = run_cpa(subset_traces, subset_plaintexts, byte_idx)
    
    # Check if correct
    if best_key_byte == true_key[byte_idx]:
        pge_count += 1

pge = pge_count / n_runs
print(f"PGE: {pge:.4f} ({pge_count}/{n_runs} runs successful)")
```

### 6.3 PGE Interpretation

| PGE Value | Meaning |
|-----------|---------|
| 1.0 | Attack always succeeds (100% confidence) |
| 0.9 | Attack succeeds 90% of the time |
| 0.5 | Attack succeeds 50% of the time (borderline) |
| <0.5 | Attack rarely succeeds (need more traces) |

### 6.4 Traces vs. PGE

As the number of traces increases:
- PGE increases (more reliable attack)
- The curve typically shows a sharp transition
- The transition point depends on SNR and target implementation

```
PGE
1.0 |                    ___________
    |                   /
0.5 |                  /
    |                 /
0.0 |________________/
    +--------------------------------→
    0   100  500  1000  5000  10000
         Number of Traces
```

## 7. Attack Evaluation Metrics

### 7.1 Metrics Summary

| Metric | Formula | Ideal |
|--------|---------|-------|
| **Rank of correct key** | Position in sorted correlation list | 1 |
| **Max correlation** | $\max_t |\rho(k_{correct}, t)|$ | >0.5 |
| **PGE** | $P(\text{rank}=1)$ | 1.0 |
| **Guessing Entropy** | $\log_2(\text{rank})$ | 0 |
| **Traces to key** | Minimum $N$ for rank=1 | As low as possible |

### 7.2 Reporting Results

A complete CPA attack report should include:
1. Attack parameters (number of traces, leakage model)
2. Correlation heatmap for each key byte
3. Key ranking table
4. PGE calculation
5. Comparison with theoretical expectations

## 8. Practical Considerations

### 8.1 Trace Selection

- Use traces with random plaintexts (uniform distribution)
- Avoid correlated plaintexts (biases reduce attack effectiveness)
- Ensure sufficient trace count for reliable correlation

### 8.2 Noise Handling

- Pre-process traces (filtering, alignment)
- Use appropriate leakage model
- Increase trace count for noisy environments

### 8.3 Countermeasure Detection

If CPA fails:
- Check for masking (random intermediates)
- Check for hiding (random delays, shuffling)
- Consider higher-order CPA for first-order masking

## 9. References

1. NewAE Technology. ChipWhisperer Analyzer Documentation. https://chipwhisperer.readthedocs.io/en/latest/analyzer.html
2. NewAE Technology. sca101 Lab 4_3: CPA Attack Walkthrough. https://github.com/newaetech/chipwhisperer-jupyter
3. NewAE Technology. sca101 Lab 5_1: CPA Results and PGE. https://github.com/newaetech/chipwhisperer-jupyter
4. Mangard, S. et al. Power Analysis Attacks. Springer, 2007.
5. Standaert, F. et al. "A Unified Framework for the Analysis of Side-Channel Key Recovery Attacks." EUROCRYPT 2009.
6. Coron, J. and Goli, P. "Correlation Power Analysis with a Leakage Model." CHES 2004.
