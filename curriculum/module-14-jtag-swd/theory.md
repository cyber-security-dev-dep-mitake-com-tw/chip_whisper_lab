# JTAG/SWD Attacks & Hardware Reverse Engineering

## Test/Debug Interface Attack Overview

Microcontrollers expose JTAG (IEEE 1149.1) and SWD (Serial Wire Debug) interfaces for manufacturing testing and firmware development. If left unlocked or improperly secured, these interfaces provide:

- Full memory read/write access
- CPU register inspection and modification
- Breakpoint placement (halt execution)
- Flash reprogramming
- Firmware extraction

## JTAG (IEEE 1149.1) Boundary Scan

### Pin Signals
| Signal | Direction | Purpose |
|--------|-----------|---------|
| TDI | Input | Test Data In |
| TDO | Output | Test Data Out |
| TCK | Input | Test Clock |
| TMS | Input | Test Mode Select |
| TRST | Input | (Optional) Test Reset |

### Boundary Scan Chain
JTAG devices form a daisy chain (boundary scan chain):
TDI → Device 1 (TDO) → Device 2 (TDI) → Device 3 (TDO) → ... → TDO

Each device has:
- Boundary scan cells (input/output registers)
- Bypass register (1-bit, just passes TDI to TDO)
- ID code (identifies device manufacturer, part number)

### JTAGulator
The JTAGulator (https://github.com/NewAETechnology/JTAGulator) automates discovery of which GPIO pins belong to a JTAG chain on an unknown target board:
1. Scans GPIO pins cycling through TCK/TMS/TDI/TDO combinations
2. Identifies device boundaries via IDCODE requests
3. Maps physical pin names to JTAG signal functions

### Defenses (JTAG)
1. **Read-Out Protection (RDP)**: STM32 RDP Level 1 locks flash readback; RDP Level 2 permanently disables debug
2. **Disabling JTAG fuses**: Blow eFuses to remove JTAG pads from scan chain
3. **Output disable**: Configure GPIOs as outputs driving low, preventing external TDO reading
4. **Secure JTAG**: Use IEEE 1149.1.1-2018 secure JTAG authentication

## SWD (Serial Wire Debug)

### Two-Wire Interface
SWD uses only 2 wires compared to JTAG's 4-5:
- SWDIO: Bidirectional data
- SWCLK: Clock

### Access Methods
1. **DAP (Debug Access Port)**: Full debug access with core register inspection
2. **DP (Debug Port)**: Access to memory and peripheral registers
3. **Flash download**: Reprogram device flash via SWD

### Defenses (SWD)
1. **JTAG-SWD lock**: Some MCUs fuse-lock to disable SWD after initial programming
2. **Secure reset**: Require secure authentication before debug access
3. **Memory protection**: MPU/MPU regions prevent debug access to secure memory areas

## Hardware Reverse Engineering

### Non-Invasive Methods
1. **Firmware extraction**: Via JTAG/SWD, bootloader UART, or chip desoldering + flash reader
2. **Bus Piracy**: Bus Pirate (https://dangerousprototypes.com/bus-pirate/) is a multi-protocol tool for exploring unknown buses (I2C, SPI, UART, JTAG, SWD)
3. **OpenOCD + GDB**: Open On-Chip Debugger provides GDB server for hardware-level dynamic debugging
4. **STM32 RDP Bypass**: Known attack vectors for downgrading STM32 RDP levels

### Invasive Methods (Advanced)
1. **Decapsulation**: Remove chip packaging with fuming nitric acid to access die for FIB probing
2. **FIB (Focused Ion Beam)**: Use FIB to create micro-probes connecting to internal signal lines
3. **Active Shielding**: Anti-tamper metal mesh detection circuits on secure ICs

### RDP Bypass on STM32
STM32 microcontrollers have debug port protection levels:
- Level 0: Debug fully enabled
- Level 1: Debug enabled, flash read protected
- Level 2: Debug permanently disabled (irreversible)

Attack technique: Voltage glitching during RDP reconfiguration can downgrade Level 1 to Level 0.

## References
- JTAGulator documentation: https://github.com/NewAETechnology/JTAGulator
- OpenOCD documentation: https://openocd.org/
- Bus Pirate: https://dangerousprototypes.com/bus-pirate/
- STM32 security application notes (AN2606, AN5115)
- FIPS 140-3: Physical security requirements (tamper evident/resistant/responsive)
