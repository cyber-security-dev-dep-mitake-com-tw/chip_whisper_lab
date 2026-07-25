# Fault Injection: Voltage & Clock Glitching

## Overview

Fault Injection Attacks (FIA) are **active** attacks that manipulate the physical operation of a target device to cause it to behave incorrectly. Unlike passive attacks (CPA/DPA), fault injection actively interferes with the target during operation.

## Voltage Glitching

### Principle
By momentarily dropping the supply voltage below the operating threshold, the target microcontroller can be made to skip instructions — typically conditional branch instructions that implement security checks (e.g., password verification, secure boot validation).

### Target Setup
1. Connect ChipWhisperer-Lite to the target VCC (via shunt resistor or direct connection)
2. Configure glitch module: offset (ns), width (ns), repeat count
3. Set target reset GPIO and glitch output GPIO

### Key Parameters
| Parameter | Description | Typical Range |
|-----------|-------------|---------------|
| Offset | Time from target reset to glitch trigger | 0 - 1000 ns |
| Width | Duration of voltage drop | 1 - 50 ns |
| Repeat | Number of glitch pulses | 1 - 1000 |
| Voltage | Target supply voltage (normal vs glitch) | 3.3V -> 1.8V |

### Attack Workflow
1. Identify security check loop (IDA Pro / Ghidra disassembly)
2. Determine branch instruction address
3. Scan offset/width parameter space
4. Detect successful glitch (e.g., "correct" flag set)
5. Repeat for reliability

## Clock Glitching

### Principle
Injecting additional clock pulses into the target causes the instruction pipeline to execute unintended instructions, often skipping security-critical branches.

### Differences from Voltage Glitching
- Clock glitching affects the CPU pipeline directly
- Voltage glitching affects the power rail to all circuits
- Clock glitching is often more precise but requires closer physical access

## ChipWhisperer-Lite Capabilities
The ChipWhisperer-Lite has built-in glitch hardware:
- External glitch output via IO2/IO3
- Programmable glitch width and offset
- Synchronized with target reset timing

## References
- O'Flynn, C. & Chen, Z.D. (2021). The Hardware Hacking Handbook. No Starch Press. Chapters 5-6.
- ChipWhisperer fault injection course materials (fault101): https://github.com/newaetech/chipwhisperer/tree/master/jupyter/courses/fault101
- Riscure Fault Injection Testing Guidelines (2022)
- PicoEMP (opensource EMFI tool): https://github.com/131041043/PicoEMP
