from __future__ import annotations

import importlib.util
import os
import platform
import shutil
import subprocess
from pathlib import Path

from ..schemas import CheckState, DoctorCheck, DoctorReport


def _command_version(command: str, *args: str) -> str | None:
    executable = shutil.which(command)
    if not executable:
        return None
    try:
        result = subprocess.run(
            [executable, *args],
            check=False,
            capture_output=True,
            text=True,
            timeout=5,
        )
    except (OSError, subprocess.TimeoutExpired):
        return None
    output = (result.stdout or result.stderr).strip().splitlines()
    return output[0] if output else executable


def _check(
    key: str,
    label: str,
    version: str | None,
    remediation: str,
    *,
    optional: bool = False,
) -> DoctorCheck:
    if version:
        return DoctorCheck(key=key, label=label, state=CheckState.READY, detail=version)
    state = CheckState.OPTIONAL if optional else CheckState.MISSING
    return DoctorCheck(
        key=key,
        label=label,
        state=state,
        detail="Not found",
        remediation=remediation,
    )


def build_doctor_report() -> DoctorReport:
    machine = platform.machine()
    system = platform.system()
    brew_prefix = _command_version("brew", "--prefix")
    python_arch = platform.machine()
    libusb_path = None
    if brew_prefix:
        candidate = Path(brew_prefix) / "opt" / "libusb" / "lib" / "libusb-1.0.dylib"
        if candidate.exists():
            libusb_path = str(candidate)

    checks = [
        DoctorCheck(
            key="platform",
            label="macOS Apple Silicon",
            state=CheckState.READY if system == "Darwin" and machine == "arm64" else CheckState.WARNING,
            detail=f"{system} {machine}",
            remediation=None
            if system == "Darwin" and machine == "arm64"
            else "This installer targets native Apple Silicon macOS.",
        ),
        _check("homebrew", "Homebrew", brew_prefix, "Install Homebrew in /opt/homebrew."),
        _check("libusb", "libusb", libusb_path, "Run: brew install libusb"),
        DoctorCheck(
            key="python",
            label="Native Python",
            state=CheckState.READY if python_arch == "arm64" else CheckState.WARNING,
            detail=f"{platform.python_version()} · {python_arch}",
            remediation=None if python_arch == "arm64" else "Recreate the environment with native arm64 Python.",
        ),
        DoctorCheck(
            key="chipwhisperer",
            label="ChipWhisperer Python",
            state=CheckState.READY
            if importlib.util.find_spec("chipwhisperer")
            else CheckState.MISSING,
            detail="Importable" if importlib.util.find_spec("chipwhisperer") else "Not importable",
            remediation="Run ./scripts/install-macos.sh --full",
        ),
        _check(
            "arm_gcc",
            "ARM GCC",
            _command_version("arm-none-eabi-gcc", "--version"),
            "Run: brew install arm-none-eabi-gcc",
            optional=True,
        ),
        _check(
            "avr_gcc",
            "AVR GCC",
            _command_version("avr-gcc", "--version"),
            "Run: brew tap osx-cross/avr && brew install avr-gcc",
            optional=True,
        ),
        _check(
            "openocd",
            "OpenOCD",
            _command_version("openocd", "--version"),
            "Run: brew install open-ocd",
            optional=True,
        ),
    ]

    return DoctorReport(
        platform=system,
        architecture=machine,
        native_apple_silicon=system == "Darwin" and machine == "arm64",
        checks=checks,
    )


def redacted_environment() -> dict[str, str]:
    allowed = ("PATH", "SHELL", "LANG", "TERM", "VIRTUAL_ENV")
    return {key: value for key in allowed if (value := os.environ.get(key))}
