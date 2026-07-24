#!/usr/bin/env bash

set -euo pipefail
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=scripts/lib/common.sh
source "${script_dir}/lib/common.sh"

failures=0
warnings=0

check() {
  local label="$1"
  local command_name="$2"
  local required="${3:-required}"
  if command_exists "${command_name}"; then
    printf '  [OK]   %-22s %s\n' "${label}" "$(command -v "${command_name}")"
  elif [[ "${required}" == "required" ]]; then
    printf '  [FAIL] %-22s not found\n' "${label}"
    failures=$((failures + 1))
  else
    printf '  [WARN] %-22s not found (optional)\n' "${label}"
    warnings=$((warnings + 1))
  fi
}

printf 'WhisperLab macOS doctor\n'
printf '=======================\n'
printf '  %-29s %s\n' "macOS" "$(sw_vers -productVersion 2>/dev/null || printf 'not macOS')"
printf '  %-29s %s\n' "shell architecture" "$(uname -m)"

if [[ "$(uname -s)" != "Darwin" || "$(uname -m)" != "arm64" ]]; then
  printf '  [FAIL] Expected native arm64 macOS.\n'
  failures=$((failures + 1))
else
  printf '  [OK]   Native Apple Silicon shell\n'
fi

check "Homebrew" brew
check "Git" git
check "make" make
check "ARM GCC" arm-none-eabi-gcc optional
check "AVR GCC" avr-gcc optional
check "OpenOCD" openocd optional
check "Node.js" node optional
check "PostgreSQL client" psql optional

brew_root="$(brew_prefix 2>/dev/null || true)"
if [[ "${brew_root}" == "/opt/homebrew" ]]; then
  printf '  [OK]   %-22s %s\n' "Homebrew architecture" "${brew_root}"
elif [[ -n "${brew_root}" ]]; then
  printf '  [FAIL] %-22s %s (expected /opt/homebrew)\n' "Homebrew architecture" "${brew_root}"
  failures=$((failures + 1))
else
  printf '  [FAIL] %-22s not found\n' "Homebrew prefix"
  failures=$((failures + 1))
fi

libusb_path="/opt/homebrew/opt/libusb/lib/libusb-1.0.dylib"
if [[ -f "${libusb_path}" ]]; then
  printf '  [OK]   %-22s %s\n' "libusb" "${libusb_path}"
  file "${libusb_path}" | sed 's/^/         /'
else
  printf '  [FAIL] %-22s %s missing\n' "libusb" "${libusb_path}"
  failures=$((failures + 1))
fi

if [[ -x "${venv_dir}/bin/python" ]]; then
  python_arch="$("${venv_dir}/bin/python" -c 'import platform; print(platform.machine())')"
  python_version="$("${venv_dir}/bin/python" --version 2>&1)"
  if [[ "${python_arch}" == "arm64" ]]; then
    printf '  [OK]   %-22s %s · %s\n' "Python environment" "${python_version}" "${python_arch}"
  else
    printf '  [FAIL] %-22s %s · %s\n' "Python environment" "${python_version}" "${python_arch}"
    failures=$((failures + 1))
  fi

  if "${venv_dir}/bin/python" -c 'import chipwhisperer, usb1' >/dev/null 2>&1; then
    cw_version="$("${venv_dir}/bin/python" -c 'import chipwhisperer as cw; print(cw.__version__)')"
    printf '  [OK]   %-22s %s\n' "ChipWhisperer import" "${cw_version}"
  else
    printf '  [FAIL] %-22s import chipwhisperer or usb1 failed\n' "Python packages"
    failures=$((failures + 1))
  fi
else
  printf '  [FAIL] %-22s run ./scripts/install-macos.sh\n' "Python environment"
  failures=$((failures + 1))
fi

printf '\nUSB devices (NewAE VID 0x2b3e):\n'
usb_matches="$(system_profiler SPUSBDataType 2>/dev/null | grep -i -B 3 -A 8 -E '0x2b3e|ChipWhisperer|NewAE' || true)"
if [[ -n "${usb_matches}" ]]; then
  printf '%s\n' "${usb_matches}"
else
  printf '  none detected (expected when no board is connected)\n'
fi

printf '\nResult: %d failure(s), %d warning(s)\n' "${failures}" "${warnings}"
if ((failures > 0)); then
  exit 1
fi
