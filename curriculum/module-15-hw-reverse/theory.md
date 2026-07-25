# Hardware Reverse Engineering (Decapsulation, FIB, Active Shield)

## Overview

Hardware reverse engineering (HRE) is the process of analyzing an integrated circuit (IC) to understand its design, functionality, and security properties. This ranges from non-invasive techniques (reading external interfaces) to fully invasive approaches (physical decapsulation and FIB micro-probing).

## Non-Invasive Hardware RE

### Firmware Extraction
1. **UART/Bootloader**: Many MCUs expose a UART bootloader (e.g., STM32, ESP32, nRF52)
2. **JTAG/SWD**: Debug interface allows full flash readout and register inspection
3. **Chip desoldering + external reader**: Remove chip from board, read flash via dedicated programmer
4. **Bus Pirate / Logic analyzer**: Explore external buses (I2C, SPI, UART) for protocol analysis

### Bus Pirate
The Bus Pirate is a multi-protocol tool for exploring unknown circuits:
- Protocols: I2C, SPI, UART, 1-Wire, JTAG, SWD, CAN, etc
- Interactive terminal mode for manual exploration
- Can dump flash content from connected devices

### OpenOCD + GDB
Open On-Chip Debugger provides a GDB server for hardware-level debugging:
- Attach target via JTAG/SWD
- Halt CPU at any point
- Read/write memory and registers
- Set breakpoints on flash or RAM
- Single-step through firmware execution

## Invasive Hardware RE

### Decapsulation (Delidding)
Removing the plastic/ceramic IC packaging to expose the silicon die:
1. Mechanical milling (for larger packages)
2. Chemical decapsulation (fuming nitric acid dissolves epoxy)
3. Results: bare die ready for FIB probing or optical inspection

### FIB (Focused Ion Beam) Micro-Probing
1. Mount decapped die in FIB chamber
2. Use focused Ga+ ion beam to mill pathways (cross-sectioning)
3. Deposit platinum/copper for electrical connections
4. Create micro-probes connecting to internal signal lines
5. Probe internal buses with oscilloscope or logic analyzer

### Active Shields (Anti-Tamper)
High-security ICs (smart cards, hardware wallets) incorporate active protection:
- Metal mesh layers over the die
- Mesh continuity monitored by sensors
- Breaking mesh triggers data erasure (tamper response)
- Detect physical intrusion attempts in real-time

### FIB Attack on Active Shields
1. Remove outer metal layers with FIB milling
2. Locate and probe inner signal layers
3. Bypass active shield monitoring circuits
4. Read internal SRAM contents through exposed nodes

## Practical RE Workflow

### Tool Chain
1. **Visual inspection**: Optical microscope, X-ray (non-destructive)
2. **Decapsulation**: Chemical or mechanical
3. **FIB setup**: Sample preparation, probe station integration
4. **Signal capture**: Oscilloscope, logic analyzer, protocol analyzer
5. **Firmware analysis**: IDA Pro, Ghidra, Binary Ninja, radare2

## References
- Tehranipoor, M., & Koushanfar, F. (2010). "A Survey of Hardware Trojan Taxonomy and Detection." IEEE Design & Test of Computers.
- Tehranipoor, M., et al. (2011). Introduction to Hardware Security and Trust. Springer.
- CHIPSEC: Open-source framework for hardware security analysis (https://chipsec.github.io/)
- FIPS 140-3: Physical Security Requirements (Tamper Evident, Tamper Resistant, Tamper Responsive)
