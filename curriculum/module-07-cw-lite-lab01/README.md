# Module 07: ChipWhisperer-Lite Hardware & First Lab

## Learning Objectives
- Understand the ChipWhisperer-Lite hardware architecture and components
- Configure the ChipWhisperer scope for power trace acquisition
- Set up the target board and simpleserial protocol
- Capture and visualize power traces from a cryptographic operation
- Observe instruction-level differences in power traces

## Estimated Time
2–3 hours

## Prerequisites
- Module 00 (Environment Setup)
- Module 06 (Side-Channel Analysis Theory)
- ChipWhisperer-Lite hardware (or simulator)

## Module Structure
| File | Description |
|------|-------------|
| `theory.md` | Hardware architecture, scope setup, simpleserial protocol |
| `lab-simulated.ipynb` | Interactive trace capture and visualization |

## Key Topics
1. **Hardware Architecture**: CW-Lite scope, target board, FPGA, ADC
2. **Scope Setup**: Clock, gain, trigger, decimation
3. **Target Board**: XMEGA/STM32 firmware, simpleserial protocol
4. **Power Trace Acquisition**: Capturing, storing, visualizing traces
5. **Instruction Differences**: Observing different operations in power traces

## References
- [ChipWhisperer Documentation](https://chipwhisperer.readthedocs.io/)
- [ChipWhisperer-Lite Hardware](https://rtfm.newae.com/Capture/Chipwhisperer-Lite/)
- [NewAE sca101 Labs](https://github.com/newaetech/chipwhisperer-jupyter)
