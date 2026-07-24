#!/usr/bin/env bash

# WhisperLab macOS doctor — verifies the installation environment.
#
# Usage:
#   ./scripts/doctor-macos.sh                       # human-readable output
#   ./scripts/doctor-macos.sh --json                # JSON report
#   ./scripts/doctor-macos.sh --simulator-only=true # relax hardware checks

set -euo pipefail
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=scripts/lib/common.sh
source "${script_dir}/lib/common.sh"

json_mode=false
simulator_only="${simulator_only:-false}"
json_report=""

while (($#)); do
  case "$1" in
    --json) json_mode=true ;;
    --simulator-only=*) simulator_only="${1#*=}" ;;
    *) ;;
  esac
  shift
done

failures=0
warnings=0
checks_json=""

check() {
  local label="$1"
  local command_name="$2"
  local required="${3:-required}"
  if command_exists "${command_name}"; then
    local path
    path="$(command -v "${command_name}")"
    printf '  [OK]   %-22s %s\n' "${label}" "${path}"
    checks_json+="{\"label\":\"${label}\",\"status\":\"ok\",\"path\":\"${path}\"},"
  elif [[ "${required}" == "required" ]]; then
    printf '  [FAIL] %-22s not found\n' "${label}"
    checks_json+="{\"label\":\"${label}\",\"status\":\"fail\",\"path\":null},"
    failures=$((failures + 1))
  else
    printf '  [WARN] %-22s not found (optional)\n' "${label}"
    checks_json+="{\"label\":\"${label}\",\"status\":\"warn\",\"path\":null},"
    warnings=$((warnings + 1))
  fi
}

printf 'WhisperLab macOS doctor\n'
printf '=======================\n'
printf '  %-29s %s\n' "macOS" "$(sw_vers -productVersion 2>/dev/null || printf 'not macOS')"
printf '  %-29s %s\n' "shell architecture" "$(uname -m)"

if [[ "$(uname -s)" != "Darwin" || "$(uname -m)" != "arm64" ]]; then
  if [[ "${simulator_only}" == "true" ]]; then
    printf '  [WARN] %-22s %s (simulator mode OK)\n' "Architecture" "$(uname -m)"
    warnings=$((warnings + 1))
  else
    printf '  [FAIL] Expected native arm64 macOS.\n'
    failures=$((failures + 1))
  fi
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
check "Conda" conda optional
check "ESP32 IDF" idf.py optional

printf '\n'
printf 'Homebrew:\n'
brew_root="$(brew_prefix 2>/dev/null || true)"
if [[ "${brew_root}" == "/opt/homebrew" ]]; then
  printf '  [OK]   %-22s %s\n' "Homebrew prefix" "${brew_root}"
elif [[ -n "${brew_root}" ]]; then
  printf '  [FAIL] %-22s %s (expected /opt/homebrew)\n' "Homebrew prefix" "${brew_root}"
  failures=$((failures + 1))
else
  printf '  [FAIL] %-22s not found\n' "Homebrew prefix"
  failures=$((failures + 1))
fi

printf '\n'
printf 'libusb:\n'
libusb_path="/opt/homebrew/opt/libusb/lib/libusb-1.0.dylib"
if [[ -f "${libusb_path}" ]]; then
  printf '  [OK]   %-22s %s\n' "libusb.dylib" "${libusb_path}"
  file "${libusb_path}" | sed 's/^/         /'
elif [[ "${simulator_only}" == "true" ]]; then
  printf '  [WARN] %-22s missing (simulator mode: libusb not required)\n' "libusb.dylib"
  warnings=$((warnings + 1))
else
  printf '  [FAIL] %-22s missing\n' "libusb.dylib"
  failures=$((failures + 1))
fi

printf '\n'
printf 'Python environment:\n'
if [[ -x "${venv_dir}/bin/python" ]]; then
  python_arch="$("${venv_dir}/bin/python" -c 'import platform; print(platform.machine())')"
  python_version="$("${venv_dir}/bin/python" --version 2>&1)"
  if [[ "${python_arch}" == "arm64" ]]; then
    printf '  [OK]   %-22s %s · %s\n' "Python" "${python_version}" "${python_arch}"
  elif [[ "${simulator_only}" == "true" ]]; then
    printf '  [WARN] %-22s %s · %s (simulator mode)\n' "Python" "${python_version}" "${python_arch}"
    warnings=$((warnings + 1))
  else
    printf '  [FAIL] %-22s %s · %s (expected arm64)\n' "Python" "${python_version}" "${python_arch}"
    failures=$((failures + 1))
  fi

  if "${venv_dir}/bin/python" -c 'import chipwhisperer' >/dev/null 2>&1; then
    cw_version="$("${venv_dir}/bin/python" -c 'import chipwhisperer as cw; print(cw.__version__)')"
    printf '  [OK]   %-22s %s\n' "ChipWhisperer" "${cw_version}"
  else
    printf '  [FAIL] %-22s import chipwhisperer failed\n' "Python packages"
    failures=$((failures + 1))
  fi

  if "${venv_dir}/bin/python" -c 'import usb1' >/dev/null 2>&1; then
    printf '  [OK]   %-22s\n' "usb1 (libusb1)"
  elif [[ "${simulator_only}" == "true" ]]; then
    printf '  [WARN] %-22s not installed (simulator mode)\n' "usb1"
    warnings=$((warnings + 1))
  else
    printf '  [FAIL] %-22s import usb1 failed\n' "Python packages"
    failures=$((failures + 1))
  fi
else
  printf '  [FAIL] %-22s run ./scripts/install-macos.sh\n' "Python environment"
  failures=$((failures + 1))
fi

printf '\n'
printf 'USB devices (NewAE VID 0x2b3e):\n'
usb_matches="$(system_profiler SPUSBDataType 2>/dev/null | grep -i -B 3 -A 8 -E '0x2b3e|ChipWhisperer|NewAE' || true)"
if [[ -n "${usb_matches}" ]]; then
  printf '%s\n' "${usb_matches}"
else
  printf '  none detected (expected when no board is connected)\n'
fi

printf '\nResult: %d failure(s), %d warning(s)\n' "${failures}" "${warnings}"

if [[ "${json_mode}" == "true" ]]; then
  json_report="{
  \"macos\": \"$(sw_vers -productVersion 2>/dev/null || echo 'unknown')\",
  \"arch\": \"$(uname -m)\",
  \"simulator_only\": ${simulator_only},
  \"failures\": ${failures},
  \"warnings\": ${warnings},
  \"checks\": [${checks_json%,}]
}"
  printf '%s\n' "${json_report}"
fi

if ((failures > 0)); then
  exit 1
fi
