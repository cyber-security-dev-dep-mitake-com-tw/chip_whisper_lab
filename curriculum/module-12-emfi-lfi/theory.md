# Fault Injection: EMFI & Laser (LFI)

## Electromagnetic Fault Injection (EMFI)

### Principle
A strong, localized electromagnetic pulse can induce currents in the target circuit that cause bit flips in memory or register values. Unlike voltage/clock glitching, EMFI can target specific components without physical contact.

### Attack Setup
1. EMFI coil positioned near target chip
2. Pulse generator produces short high-voltage spike
3. ChipWhisperer provides victim clock/trigger synchronization
4. Automated parameter scanning: coil position, pulse timing, amplitude

### Attack Surface via EMFI
- Flash memory bit flips
- SRAM contents corruption
- Register file corruption
- Bus arbitration logic disruption

### Practical Considerations
- Coil proximity matters greatly (near-field coupling)
- EMFI can target specific functional units on a die
- ChipWhisperer enables automated scanning with precise timing

## Laser Fault Injection (LFI)

### Principle
A focused laser beam aimed at specific transistors on the die can change their logic state by depositing enough energy to flip a transistor's state.

### Equipment Requirements
- Femtosecond or nanosecond pulsed laser (e.g.,钦脉激光器)
- Inverted microscope with XYZ positioning stage
- Beam focusing optics
- Dark room environment

### Attack Precision
- Can target individual transistors (~1 μm precision)
- Can flip specific bits in registers or memory cells
- Can trigger faults in specific clock cycles

### ChipWhisperer + LFI
While LFI requires expensive equipment, ChipWhisperer can serve as:
- Victims operation trigger (synchronized with laser pulse)
- Fault result capture via power analysis or serial output
- Automated parameter sweeps with precise timing control

## References
- O'Flynn, C. & Chen, Z.D. (2021). The Hardware Hacking Handbook. Chapter 7.
- Riscure Fault Injection Testing Guidelines (2022).
- Shahbaz, M., et al. "Laser Fault Injection on Modern Microcontrollers." USENIX Security 2018.
- PicoEMP open-source EMFI project: https://github.com/131041043/PicoEMP
