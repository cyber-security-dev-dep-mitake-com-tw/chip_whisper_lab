# Module 07: ChipWhisperer-Lite Hardware & First Lab — Theory

## 1. ChipWhisperer-Lite Overview

ChipWhisperer-Lite is an open-source side-channel analysis and fault injection platform developed by NewAE Technology. It provides a complete toolchain for performing power analysis attacks on real hardware.

### 1.1 Hardware Components

**Scope Board (CW-Lite):**
- **ADC**: 10-bit, up to 105 MS/s (mega-samples per second)
- **FPGA**: Xilinx Spartan 6 for real-time signal processing
- **USB Interface**: FTDI FT2232H for PC communication
- **Clock Generator**: Programmable clock for target board
- **Voltage Regulator**: Adjustable power supply for target

**Target Board:**
- **Microcontroller**: ATxmega328D (default) or STM32F3
- **Crypto Accelerator**: Hardware AES engine (optional)
- **Serial Interface**: UART for simpleserial communication
- **Power Measurement**: Shunt resistor in series with VCC

### 1.2 Power Measurement Setup

```
┌─────────────────────────────────────────────────────┐
│                 ChipWhisperer-Lite                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │ Clock    │  │ ADC      │  │ USB Interface    │ │
│  │ Generator│  │ (10-bit) │  │ (FT2232H)       │ │
│  └────┬─────┘  └────┬─────┘  └────────┬─────────┘ │
│       │              │                 │            │
│       │         ┌────┴─────┐           │            │
│       │         │ shunt    │           │            │
│       │         │ resistor │           │            │
└───────┼─────────┼──────────┼───────────┼────────────┘
        │         │          │           │
        ▼         ▼          ▼           ▼
┌─────────────────────────────────────────────────────┐
│                   Target Board                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │ ATxmega  │  │ Crypto   │  │ Serial (UART)   │ │
│  │ 328D MCU │  │ Engine   │  │ Interface       │ │
│  └──────────┘  └──────────┘  └──────────────────┘ │
└─────────────────────────────────────────────────────┘
```

**Power Measurement Principle:**
The target MCU's VCC line passes through a small shunt resistor (typically 1Ω or 4.7Ω). The voltage drop across this resistor is proportional to the current consumption:

$$
V_{measure} = I_{VCC} \times R_{shunt}
$$

This voltage is amplified and digitized by the scope's ADC.

### 1.3 Signal Chain

```
Target MCU Power Pin
  → Shunt Resistor (1Ω)
  → Amplifier (variable gain)
  → ADC (10-bit, up to 105 MS/s)
  → FPGA (trigger, decimation, averaging)
  → USB → PC (ChipWhisperer software)
```

## 2. Scope Configuration

### 2.1 Clock Setup

The scope provides a programmable clock to the target:

```python
import chipwhisperer as cw

scope = cw.scope()
# Set target clock (typical: 7.37 MHz for XMEGA)
scope.clock.clkgen_freq = 7.37e6
scope.clock.adc_mul = 4  # ADC clock = clkgen × adc_mul
# ADC sample rate = 7.37 MHz × 4 = 29.48 MS/s
```

**Clock Parameters:**
| Parameter | Description | Typical Value |
|-----------|-------------|---------------|
| `clkgen_freq` | Target clock frequency | 7.37 MHz |
| `adc_mul` | ADC clock multiplier | 4 (gives ~29 MS/s) |
| `adc_src` | ADC clock source | "clkgen" |

### 2.2 Gain Setup

```python
scope.gain.gain = 45  # dB
scope.gain.mode = "high"
```

**Gain settings:**
- Low gain: 0–20 dB (for high-power targets)
- High gain: 20–60 dB (for low-power targets)

### 2.3 Trigger Setup

```python
scope.adc.trigger_mode = "rising_edge"  # or "falling_edge", "software"
scope.adc.basic_trigger_level = 0.5  # Volts (threshold for hardware trigger)
scope.adc.timeout = 1.0  # Seconds to wait for trigger
```

**Trigger Modes:**
| Mode | Description |
|------|-------------|
| Rising edge | Trigger when signal rises above threshold |
| Falling edge | Trigger when signal falls below threshold |
| Software | Trigger via command from PC |

### 2.4 Decimation and Averaging

```python
scope.adc.decimate = 1  # No decimation (full sample rate)
scope.adc.presamples = 0  # Samples before trigger
scope.adc.postsamples = 24000  # Samples after trigger
```

### 2.5 Complete Scope Setup Example

```python
import chipwhisperer as cw

# Connect to scope
scope = cw.scope()

# Configure clock
scope.clock.clkgen_freq = 7.37e6
scope.clock.adc_mul = 4

# Configure gain
scope.gain.gain = 45
scope.gain.mode = "high"

# Configure ADC
scope.adc.bits_per_sample = 10
scope.adc.decimate = 1
scope.adc.presamples = 0
scope.adc.postsamples = 24000
scope.adc.trigger_mode = "rising_edge"
scope.adc.timeout = 1.0

print("Scope configured successfully")
```

## 3. Target Board and Firmware

### 3.1 Simpleserial Protocol

ChipWhisperer uses a simple serial protocol called "simpleserial" for communication between the PC and target:

**Message Format:**
```
[cmd][len][data...][checksum]\n
```

- `cmd`: Single character command ('p' for plaintext, 'k' for key, etc.)
- `len`: Number of data bytes (hex)
- `data`: Payload bytes (hex)
- `checksum`: XOR of all data bytes (hex)
- `\n`: Newline terminator

**Example:**
```
p10414243444546474849000a\n  # Send plaintext "ABCDEFGH" (10 bytes)
```

### 3.2 Target Firmware Commands

| Command | Description | Response |
|---------|-------------|----------|
| `p` | Set plaintext | `y` (ack) |
| `k` | Set key | `y` (ack) |
| `e` | Encrypt | `r00...00` (ciphertext) |
| `x` | Get last ciphertext | `rXX...XX` (ciphertext) |
| `v` | Version | `v12345` |
| `z` | Reset | `y` |

### 3.3 Power Triggers

The target firmware signals the scope when a cryptographic operation begins:

```c
// In target firmware
trigger_setup();
crypto_encrypt(plaintext, ciphertext);
trigger_high();  // Signal start of operation
crypto_encrypt(plaintext, ciphertext);
trigger_low();   // Signal end of operation
```

The scope captures power traces around this trigger event.

## 4. Power Trace Visualization

### 4.1 Single Trace

```python
# Capture a single trace
target.simpleserial_write('p', plaintext)
scope.arm()
target.simpleserial_write('e', b'')
while not scope.adc.done:
    pass
trace = scope.capture.adc.trace
```

**Single trace features:**
- X-axis: Sample number (time)
- Y-axis: ADC value (power consumption)
- Pattern: Repeated operations visible as repeating structures

### 4.2 Trace Statistics

```python
import numpy as np

# Capture many traces
traces = []
for _ in range(100):
    plaintext = np.random.randint(0, 256, 16, dtype=np.uint8)
    target.simpleserial_write('p', plaintext.tobytes())
    scope.arm()
    target.simpleserial_write('e', b'')
    while not scope.adc.done:
        pass
    traces.append(scope.capture.adc.trace)

traces = np.array(traces)

# Compute mean trace
mean_trace = np.mean(traces, axis=0)

# Compute standard deviation (shows variability)
std_trace = np.std(traces, axis=0)
```

### 4.3 Trace Alignment

Traces must be aligned before analysis. Misalignment reduces correlation:

**Alignment methods:**
- Software: Cross-correlation, template matching
- Hardware: Trigger signal (most reliable)

```python
# Software alignment using cross-correlation
from scipy.signal import correlate

def align_traces(traces, reference):
    aligned = []
    for trace in traces:
        correlation = correlate(trace, reference, mode='full')
        shift = np.argmax(correlation) - len(reference) + 1
        aligned.append(np.roll(trace, -shift))
    return np.array(aligned)
```

## 5. Observing Instruction Differences

### 5.1 Operation-Level Differences

Different cryptographic operations consume different amounts of power:

| Operation | Power Signature | Duration |
|-----------|-----------------|----------|
| SubBytes | High peaks (S-box lookup) | Short |
| ShiftRows | Low power (wire routing) | Very short |
| MixColumns | Medium power (GF multiply) | Medium |
| AddRoundKey | Low (XOR operation) | Short |

### 5.2 Instruction-Level Differences

Even individual instructions have distinct power signatures:

```c
// Different instructions in assembly
ADD R1, R2    // Power: proportional to operands
SUB R1, R2    // Power: slightly different from ADD
MUL R1, R2    // Power: significantly higher
EOR R1, R2    // Power: low (XOR operation)
```

### 5.3 Data-Dependent Differences

The power consumption of an operation depends on the data being processed:

```c
// Different plaintext bytes → different power traces
for (int i = 0; i < 16; i++) {
    plaintext[i] = random_byte();
    // Encrypt and capture trace
    // Each plaintext produces a slightly different trace
}
```

## 6. Lab Exercise Outline

**Objective:** Capture power traces from AES encryption and observe data-dependent leakage.

**Steps:**
1. Configure scope (clock, gain, trigger)
2. Program target with AES firmware
3. Send random plaintexts via simpleserial
4. Capture power traces for each encryption
5. Plot single trace and observe patterns
6. Plot mean and std of many traces
7. Identify Points of Interest (POI) in the trace

**Expected Results:**
- Clear repeating pattern (AES rounds) visible in single trace
- Data-dependent variation visible when overlaying multiple traces
- Points of Interest around SubBytes operations

## 7. References

1. NewAE Technology. ChipWhisperer Documentation. https://chipwhisperer.readthedocs.io/
2. NewAE Technology. ChipWhisperer-Lite Hardware. https://rtfm.newae.com/Capture/Chipwhisperer-Lite/
3. O'Flynn, C. and Chen, Z. "ChipWhisperer: An Open-Source Platform for Hardware Embedded Security Research." COSADE 2014.
4. NewAE Technology. sca101 Jupyter Notebooks. https://github.com/newaetech/chipwhisperer-jupyter
5. Mangard, S. et al. Power Analysis Attacks. Springer, 2007.
6. Coron, J. and Goli, P. "Correlation Power Analysis with a Leakage Model." CHES 2004.
