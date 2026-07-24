# Module 00: Theory - Environment Setup & ChipWhisperer Introduction

## ChipWhisperer Architecture

The ChipWhisperer platform consists of several key components:

### Hardware Components

1. **Capture Hardware**
   - CW-Lite: High-performance capture with FPGA
   - CW-Nano: Compact, portable capture device
   - CW-Pro: Professional-grade capture system

2. **Target Boards**
   - CW305: Xilinx Artix-7 FPGA target
   - CW308: ARM Cortex-M3 target
   - CW310: ChipWhisperer Husky

### Software Components

1. **ChipWhisperer-Linux**
   - Driver framework
   - Capture server
   - API interfaces

2. **Python API**
   - `chipwhisperer` package
   - Scope and target abstractions
   - Capture and analysis tools

## Setup Process

### System Requirements

- Operating System: Linux, macOS, or Windows
- Python: 3.8 or higher
- Hardware: USB 2.0 or higher
- Memory: 4GB minimum, 8GB recommended

### Installation Steps

1. Clone the ChipWhisperer repository
2. Create a Python virtual environment
3. Install required dependencies
4. Connect hardware and verify drivers
5. Run test capture scripts

## Verification

After setup, verify your installation by:

1. Running the connection test script
2. Performing a simple power trace capture
3. Analyzing the captured waveform
4. Checking all software components are functional