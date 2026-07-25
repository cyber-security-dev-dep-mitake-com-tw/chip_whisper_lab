# Module 00: Environment Setup

## Learning Objectives
- Install and configure the ChipWhisperer toolchain on macOS/Linux/Windows
- Set up a Python virtual environment with `uv` and install `chipwhisperer` package
- Verify ARM64 cross-compilation toolchain for target firmware
- Validate libusb connectivity for hardware communication
- Confirm end-to-end environment readiness for side-channel analysis labs

## Estimated Time
1.5–2 hours

## Prerequisites
- macOS 12+, Ubuntu 20.04+, or Windows 10+ with WSL2
- Internet connection for package downloads
- ChipWhisperer-Lite or ChipWhisperer-Nano hardware (optional for simulated labs)

## Module Structure
| File | Description |
|------|-------------|
| `theory.md` | Detailed setup procedures for all platforms |
| `lab-simulated.ipynb` | Interactive environment verification notebook |

## Key Topics
1. **Python Environment**: `uv` package manager, virtual environments, dependency management
2. **ChipWhisperer SDK**: Installation, API verification, version checks
3. **Hardware Prerequisites**: libusb, FTDI drivers, ARM64 GCC toolchain
4. **Verification**: End-to-end environment validation before proceeding to Module 01

## References
- [ChipWhisperer Documentation](https://chipwhisperer.readthedocs.io/)
- [uv Package Manager](https://docs.astral.sh/uv/)
- [libusb Documentation](https://libusb.info/)
