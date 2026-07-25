#!/bin/bash

#
# User Guide - Phase 4.2
#
# Complete installation and usage guide for WhisperLab platform
#

cat << 'EOF'
# WhisperLab User Guide

## Overview
WhisperLab is a comprehensive hardware security testing platform that enables students and researchers to perform side-channel attacks, fault injection, and hardware security analysis through a web-based interface.

## Quick Start

### 1. Installation Options

#### Option A: Docker (Recommended for Beginners)
```bash
# Start all services with Docker Compose
docker-compose up -d

# Access WhisperLab web interface
open http://localhost:3000

# Start Jupyter notebooks
open http://localhost:8888
```

#### Option B: Local Development with Simulator-Only Mode
```bash
# Install simulator-only (no hardware dependencies)
./scripts/install-macos.sh --simulator-only --yes

# Start services
make setup
make start

# Access the application
open http://localhost:3000
```

#### Option C: Full Hardware Setup (Advanced)
```bash
# Install with hardware detection
scripts/install-macos.sh --verify-hardware --yes

# Verify system state
./scripts/doctor-macos.sh

# Start all services
make setup-hardware
make start
```

### 2. First-Time Use

#### Web Interface Navigation
- **Dashboard**: Overview of all experiments and statistics
- **Experiments**: Create and manage side-channel analysis projects
- **Traces**: View and analyze captured hardware traces
- **Attacks**: Configure and execute attack operations
- **Targets**: Manage hardware devices and firmware
- **Reports**: Generate analysis reports and documentation
- **Curriculum**: Access interactive hardware security learning modules

#### Basic Workflow
1. Navigate to http://localhost:3000
2. Click "Start New Experiment"
3. Choose experiment type (CPA, DPA, Template Attack, etc.)
4. Configure attack parameters and target device
5. Start the attack and monitor progress in real-time
6. Analyze results and generate reports

### 3. Key Features

#### Experiment Management
- Multiple concurrent experiments
- Real-time progress monitoring
- Automated result analysis
- Export capabilities (CSV, PDF, JSON)

#### Hardware Integration
- Simulator-only mode (Python-based)
- Hardware support: ChipWhisperer-Lite, CW-1200, etc.
- Automatic device detection
- Firmware flashing and management

#### Analysis Tools
- Trace visualization and comparison
- Power analysis (DPA, CPA)
- Electromagnetic analysis
- Fault injection (voltage, glitch, laser)
- Statistical analysis tools
- Report generation and export

### 4. Troubleshooting

#### Common Issues

**Problem: Cannot connect to backend**
```bash
# Check if backend is running
ps aux | grep whisperlab

# Start backend manually
make backend

# Check logs
make logs
```

**Problem: Missing Python packages**
```bash
# Install via pip
pip install -r requirements.txt

# Or use the installer
./scripts/install-macos.sh --conda-fallback --yes
```

**Problem: Hardware not detected**
```bash
# Check hardware state
./scripts/doctor-macos.sh

# Verify USB drivers
lsusb | grep "2b3e"
```

### 5. Advanced Usage

#### API Access
WhisperLab provides a comprehensive REST API for programmatic access:

```bash
# Get all experiments
curl -X GET http://localhost:8000/api/v1/experiments

# Start a new attack
curl -X POST http://localhost:8000/api/v1/attacks \
  -H "Content-Type: application/json" \
  -d '{"experiment_id": "123", "attack_type": "dpa"}'

# Upload traces
curl -X POST http://localhost:8000/api/v1/traces \
  -F "file=@traces.csv"
```

#### Automation Script Example
```bash
#!/bin/bash

# Create a new experiment and run analysis
EXPERIMENT_ID=$(curl -X POST http://localhost:8000/api/v1/experiments \
  -H "Content-Type: application/json" \
  -d '{"name": "AES CPA Analysis", "device_type": "chipwhisperer-lite"}' \
  | jq -r '.id')

echo "Created experiment: $EXPERIMENT_ID"

# Wait for experiment to be ready
sleep 10

# Start CPA attack
curl -X POST http://localhost:8000/api/v1/attacks \
  -H "Content-Type: application/json" \
  -d "{\"experiment_id\": \"$EXPERIMENT_ID\", \"attack_type\": \"cpa\"}"
```

### 6. Hardware Module Setup

#### Simulator Mode (Recommended)
The simulator mode provides a Python-based hardware emulation that includes:

- Power trace simulation
- Clock cycle modeling
- Signal noise and jitter
- Basic attack algorithms

#### Real Hardware Setup
For real hardware (ChipWhisperer-Lite, CW-1200, etc.):

1. Connect the device via USB
2. Install ChipWhisperer firmware
3. Configure jumper settings
4. Use the hardware setup scripts

### 7. Training and Documentation

#### Access Training Materials
- **Main Website**: http://localhost:3000
- **Interactive Jupyter Notebooks**: http://localhost:8888
- **Video Tutorials**: Available in the curriculum
- **API Documentation**: See API reference

#### Suggested Learning Path
1. Complete Module 00 (Environment Setup)
2. Try Module 01 (Basic Concepts)
3. Perform Module 07 (Hardware Lab 01)
4. Complete Module 16 (Hardware Trojans)
5. Finish Module 24 (Advanced Quantum Computing)

### 8. Support and Community

#### Online Resources
- **Documentation**: https://docs.whisperlab.dev
- **GitHub Repository**: https://github.com/cyber-security-dev-dep-mitake-com-tw/chip_whisper_lab
- **Discussions**: https://github.com/cyber-security-dev-dep-mitake-com-tw/chip_whisper_lab/discussions
- **Issues**: https://github.com/cyber-security-dev-dep-mitake-com-tw/chip_whisper_lab/issues

#### Contact
- For support: support@whisperlab.dev
- For partnerships: partnerships@whisperlab.dev

---

### Version Information
- **Version**: 0.1.0
- **Build Date**: $(date -u +%Y-%m-%d)
- **Last Updated**: $(date -u +%Y-%m-%d)

*(End of User Guide)*
EOF