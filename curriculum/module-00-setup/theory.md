# Module 00: Environment Setup — Theory

## 1. Overview

Before performing any side-channel analysis, you must establish a reproducible development environment. This module covers the complete setup process for the ChipWhisperer ecosystem, including Python toolchain management, hardware driver configuration, and ARM64 cross-compilation.

## 2. Python Environment with `uv`

### 2.1 Why `uv`?

`uv` is a fast Python package installer and resolver written in Rust. It replaces `pip` + `venv` with a single tool that is 10–100× faster. Key advantages:

- **Deterministic resolution**: Lock files ensure reproducible environments
- **Virtual environment management**: Built-in `venv` creation and activation
- **Cross-platform**: Works on macOS (ARM64/x86_64), Linux, and Windows

### 2.2 Installation

```bash
# macOS / Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows (PowerShell)
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# Verify installation
uv --version
# Expected output: uv 0.x.x or similar
```

### 2.3 Creating a Project Environment

```bash
# Create project directory
mkdir chipwhisper-labs && cd chipwhisper-labs

# Initialize uv project
uv init

# Create virtual environment with Python 3.11
uv venv --python 3.11

# Activate the environment
# macOS/Linux:
source .venv/bin/activate
# Windows:
.venv\Scripts\activate

# Install chipwhisperer package
uv pip install chipwhisperer

# Install additional dependencies for labs
uv pip install numpy matplotlib jupyter scikit-learn
```

### 2.4 Verifying the Installation

```python
import chipwhisperer as cw
print(f"ChipWhisperer version: {cw.__version__}")

# Check if hardware detection works (even without hardware connected)
try:
    scope = cw.scope()
    print("Scope detection: OK")
except Exception as e:
    print(f"No hardware detected (expected in simulation mode): {e}")
```

## 3. Hardware Prerequisites

### 3.1 libusb

ChipWhisperer communicates with target boards via USB. The `libusb` library provides userspace USB access:

```bash
# macOS (Homebrew)
brew install libusb

# Ubuntu/Debian
sudo apt-get install libusb-1.0-0-dev

# Verify
pkg-config --modversion libusb-1.0
# Expected: 1.0.xx
```

### 3.2 FTDI Drivers

The ChipWhisperer-Lite uses an FTDI FT2232H for USB-serial communication:

```bash
# macOS: Install from FTDI or use Homebrew
brew install --cask ftdi-vcp-driver

# Ubuntu: Typically included in kernel, verify with:
lsusb | grep FTDI
# Expected: Bus 001 Device 00x: ID 0403:6010 Future Technology Devices International Ltd FT2232H
```

### 3.3 ARM64 Cross-Compilation Toolchain

Target firmware (e.g., AVR, STM32, SAM4L) requires cross-compilation:

```bash
# Install ARM GCC toolchain
# macOS:
brew install --cask gcc-arm-embedded

# Ubuntu:
sudo apt-get install gcc-arm-none-eabi

# Verify
arm-none-eabi-gcc --version
# Expected: arm-none-eabi-gcc (GNU Arm Embedded Toolchain) 10.x or later
```

For AVR targets (ATmega328P on ChipWhisperer-Lite):
```bash
# Install avr-gcc
brew install avr-gcc    # macOS
sudo apt-get install gcc-avr avr-libc  # Ubuntu

# Verify
avr-gcc --version
```

## 4. ARM64 Verification on Apple Silicon

Apple Silicon (M1/M2/M3) Macs require special attention for ARM64:

```bash
# Check architecture
uname -m
# Expected: arm64

# Verify Python is native ARM64 (not Rosetta)
python -c "import platform; print(platform.machine())"
# Expected: arm64

# If running under Rosetta, reinstall Python for native ARM64
uv python install 3.11 --python-preference only-system
```

### 4.1 Common Issues on Apple Silicon

| Issue | Solution |
|-------|----------|
| `libusb` not found | `brew install libusb && export LDFLAGS="-L/opt/homebrew/lib"` |
| FTDI permission errors | No `sudo` needed on macOS; check System Preferences > Security |
| `chipwhisperer` install fails | Ensure you're using ARM64 Python, not Rosetta |
| Cross-compiler missing paths | Add to `~/.zshrc`: `export PATH="/opt/homebrew/bin:$PATH"` |

## 5. Windows Setup (WSL2)

For Windows users, WSL2 is strongly recommended:

```powershell
# Enable WSL2
wsl --install

# In WSL2 (Ubuntu):
sudo apt-get update
sudo apt-get install python3-pip libusb-1.0-0-dev gcc-arm-none-eabi

# Install uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# Create environment
uv venv --python 3.11
source .venv/bin/activate
uv pip install chipwhisperer
```

### 5.1 USB Passthrough in WSL2

WSL2 requires `usbipd` for USB device passthrough:

```powershell
# On Windows host (PowerShell as Administrator):
winget install usbipd
usbipd list                          # Find ChipWhisperer device
usbipd bind --busid x-x             # Bind the device
usbipd attach --wsl --busid x-x     # Attach to WSL2
```

## 6. Docker Alternative

For fully reproducible environments:

```dockerfile
FROM ubuntu:22.04
RUN apt-get update && apt-get install -y \
    python3-pip python3-venv \
    libusb-1.0-0-dev \
    gcc-arm-none-eabi \
    gcc-avr avr-libc \
    pkg-config
RUN pip3 install chipwhisperer numpy matplotlib jupyter
WORKDIR /labs
```

```bash
docker build -t chipwhisperer-labs .
docker run -it --privileged -v /dev/bus/usb:/dev/bus/usb chipwhisperer-labs
```

## 7. Environment Verification Checklist

Before proceeding to Module 01, verify all items:

| Component | Command | Expected |
|-----------|---------|----------|
| Python version | `python --version` | 3.10+ |
| uv version | `uv --version` | 0.x.x |
| chipwhisperer | `python -c "import chipwhisperer; print(chipwhisperer.__version__)"` | 5.x.x |
| libusb | `pkg-config --modversion libusb-1.0` | 1.0.xx |
| ARM toolchain | `arm-none-eabi-gcc --version` | 10.x+ |
| NumPy | `python -c "import numpy; print(numpy.__version__)"` | 1.24+ |
| Matplotlib | `python -c "import matplotlib; print(matplotlib.__version__)"` | 3.7+ |
| Jupyter | `jupyter --version` | 1.0+ |

## 8. Troubleshooting

### 8.1 Permission Denied on USB Devices (Linux)

```bash
# Create udev rule for ChipWhisperer
sudo tee /etc/udev/rules.d/52-chipwhisperer.rules << 'EOF'
# ChipWhisperer-Lite (FTDI FT2232H)
SUBSYSTEM=="usb", ATTR{idVendor}=="0403", ATTR{idProduct}=="6010", MODE="0666"
SUBSYSTEM=="usb", ATTR{idVendor}=="2a19", ATTR{idProduct}=="5342", MODE="0666"
EOF

sudo udevadm control --reload-rules
sudo udevadm trigger
```

### 8.2 Python Version Conflicts

```bash
# Use uv to manage Python versions
uv python list --only-installed
uv python install 3.11.8
uv venv --python 3.11.8
```

### 8.3 ChipWhisperer Import Errors

```bash
# Ensure you're in the correct virtual environment
which python  # Should point to .venv/bin/python

# Reinstall if corrupted
uv pip install --force-reinstall chipwhisperer
```

## 9. References

1. ChipWhisperer Documentation. "Getting Started." https://chipwhisperer.readthedocs.io/en/latest/
2. uv Documentation. "Installation." https://docs.astral.sh/uv/getting-started/installation/
3. libusb. "libusb: A cross-platform library to access USB devices." https://libusb.info/
4. ARM GNU Toolchain. "Getting Started." https://developer.arm.com/tools-and-software/open-source-software/developer-tools/gnu-toolchain/gnu-rm
5. USB/IP Project. "USB/IP on Windows." https://github.com/dorssel/usbipd-win
