#!/usr/bin/env bash

# WhisperLab / ChipWhisperer installer for Apple Silicon macOS.
#
# This follows NewAE's macOS guide while updating stale commands:
# - current Homebrew installer (the guide still shows the retired Ruby command)
# - project-local native arm64 Python instead of changing the global Python
# - current Homebrew arm-none-eabi-gcc formula, with the same compiler binary
#
# Nothing is installed when --dry-run is used.

set -euo pipefail
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=scripts/lib/common.sh
source "${script_dir}/lib/common.sh"

dry_run=false
assume_yes=false
install_app_stack=true
install_avr=true
install_openocd=true
verify_hardware=false
simulator_only=false
install_conda_fallback=false
install_esp32=false
cw_ref="${CW_REF:-v6.0.0}"
python_version="${WHISPERLAB_PYTHON_VERSION:-3.12}"
install_report_file="${project_root}/INSTALL_REPORT.json"

usage() {
  cat <<'EOF'
Usage: ./scripts/install-macos.sh [options]

Installs a native Apple Silicon ChipWhisperer development environment.

Options:
  --dry-run            Print every action without changing the Mac.
  --yes                Accept installer prompts.
  --core-only          Install ChipWhisperer/Jupyter, not the UI/API/Postgres.
  --skip-avr           Skip the optional AVR compiler.
  --skip-openocd       Skip OpenOCD.
  --verify-hardware    Finish by opening a real cw.scope() connection.
  --simulator-only     Skip hardware deps (libusb, AVR, OpenOCD), ChipWhisperer/Jupyter only.
  --conda-fallback     Use Conda/Miniforge for Python + libusb (M1 fallback).
  --install-esp32      Install ESP32-S3 toolchain (esptool, openocd, xtensa).
  --cw-ref REF         ChipWhisperer release/tag/branch (default: v6.0.0).
  --python VERSION     Native Python version managed by uv (default: 3.12).
  -h, --help           Show this help.

Examples:
  ./scripts/install-macos.sh --dry-run
  ./scripts/install-macos.sh --yes
  ./scripts/install-macos.sh --yes --verify-hardware
  ./scripts/install-macos.sh --yes --simulator-only
  ./scripts/install-macos.sh --yes --conda-fallback --install-esp32
EOF
}

while (($#)); do
  case "$1" in
    --dry-run) dry_run=true ;;
    --yes) assume_yes=true ;;
    --core-only) install_app_stack=false ;;
    --skip-avr) install_avr=false ;;
    --skip-openocd) install_openocd=false ;;
    --verify-hardware) verify_hardware=true ;;
    --simulator-only) simulator_only=true ;;
    --conda-fallback) install_conda_fallback=true ;;
    --install-esp32) install_esp32=true ;;
    --cw-ref)
      shift
      (($#)) || die "--cw-ref requires a value."
      cw_ref="$1"
      ;;
    --python)
      shift
      (($#)) || die "--python requires a value."
      python_version="$1"
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *) die "Unknown option: $1" ;;
  esac
  shift
done

require_apple_silicon

cat <<EOF

WhisperLab Apple Silicon installer
==================================
macOS:        $(sw_vers -productVersion)
architecture: $(uname -m) (native)
Python:       ${python_version}, project-local
CW source:    newaetech/chipwhisperer @ ${cw_ref}
mode:         $([[ "${dry_run}" == "true" ]] && printf 'DRY RUN' || printf 'INSTALL')
simulator:    $([[ "${simulator_only}" == "true" ]] && printf 'YES (no hardware deps)' || printf 'NO')

Planned official prerequisites:
  Homebrew, Git, make, native Python
  ARM GCC
  $([[ "${simulator_only}" != "true" ]] && printf 'libusb, ' || true)
  $([[ "${install_avr}" == "true" && "${simulator_only}" != "true" ]] && printf 'AVR GCC, ' || true)
  $([[ "${install_openocd}" == "true" && "${simulator_only}" != "true" ]] && printf 'OpenOCD, ' || true)
  $([[ "${install_esp32}" == "true" && "${simulator_only}" != "true" ]] && printf 'ESP32-S3 toolchain, ' || true)
  ChipWhisperer source + Jupyter tutorials
EOF

if [[ "${install_app_stack}" == "true" ]]; then
  cat <<'EOF'
Planned WhisperLab application stack:
  Node.js, PostgreSQL, Next.js, FastAPI
EOF
fi
printf '\n'

if [[ "${dry_run}" != "true" ]] && ! confirm "Proceed with these installations?"; then
  die "Installation cancelled."
fi

info "1/9 Checking Apple Command Line Tools"
if ! xcode-select -p >/dev/null 2>&1; then
  if [[ "${dry_run}" == "true" ]]; then
    run xcode-select --install
  else
    xcode-select --install
    die "Finish the Apple Command Line Tools dialog, then run this installer again."
  fi
else
  printf 'ready: %s\n' "$(xcode-select -p)"
fi

info "2/9 Installing Homebrew when missing"
if ! command_exists brew && [[ ! -x /opt/homebrew/bin/brew ]]; then
  printf '%s\n' '+ /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
  if [[ "${dry_run}" != "true" ]]; then
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  fi
fi

if [[ "${dry_run}" == "true" ]] && ! command_exists brew && [[ ! -x /opt/homebrew/bin/brew ]]; then
  homebrew_bin="/opt/homebrew/bin/brew"
else
  homebrew_root="$(brew_prefix)" || die "Homebrew was not found after installation."
  [[ "${homebrew_root}" == "/opt/homebrew" ]] || die "Expected native Apple Silicon Homebrew at /opt/homebrew; found ${homebrew_root}."
  homebrew_bin="${homebrew_root}/bin/brew"
  printf 'ready: %s\n' "${homebrew_root}"
fi

info "3/9 Installing host build tools"
brew_packages=(git make pkgconf uv)
if [[ "${simulator_only}" != "true" ]]; then
  brew_packages+=(libusb arm-none-eabi-gcc)
fi
if [[ "${install_openocd}" == "true" && "${simulator_only}" != "true" ]]; then
  brew_packages+=(open-ocd)
fi
if [[ "${install_esp32}" == "true" && "${simulator_only}" != "true" ]]; then
  brew_packages+=(open-ocd)
fi
if [[ "${install_app_stack}" == "true" ]]; then
  brew_packages+=(node postgresql@17)
fi
run "${homebrew_bin}" install "${brew_packages[@]}"

if [[ "${install_conda_fallback}" == "true" ]]; then
  info "3a/9 Installing Conda/Miniforge as Python/libusb fallback (M1 arch match)"
  if [[ "${dry_run}" == "true" ]]; then
    echo '+ MINIFORGE_INSTALL="curl -fsSL https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-arm64.sh"'
    echo '+ verify libusb arm64: file /opt/homebrew/opt/libusb/lib/libusb-1.0.dylib'
  else
    conda_sh="$(mktemp)"
    curl -fsSL https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-arm64.sh -o "${conda_sh}"
    bash "${conda_sh}" -b -p "${HOME}/miniconda3" 2>/dev/null || true
    export PATH="${HOME}/miniconda3/bin:${PATH}"
    conda_bin="${HOME}/miniconda3/bin/conda"
    "${conda_bin}" init bash 2>/dev/null || true
    echo 'source "${HOME}/miniconda3/etc/profile.d/conda.sh" 2>/dev/null' >> "${HOME}/.bash_profile"
    "${conda_bin}" create -y -p "${python_install_dir}/conda" "python=${python_version}" 2>/dev/null || true
    if [[ -f "/opt/homebrew/opt/libusb/lib/libusb-1.0.dylib" ]]; then
      file "/opt/homebrew/opt/libusb/lib/libusb-1.0.dylib" | grep -q "arm64" || \
        warn "libusb.dylib architecture mismatch; Conda should provide arm64-compatible libusb"
    fi
  fi
fi

if [[ "${install_avr}" == "true" && "${simulator_only}" != "true" ]]; then
  info "4/9 Installing the AVR toolchain from osx-cross/avr"
  run "${homebrew_bin}" tap osx-cross/avr
  run "${homebrew_bin}" trust --formula \
    osx-cross/avr/avr-binutils \
    osx-cross/avr/avr-gcc@9
  run "${homebrew_bin}" install osx-cross/avr/avr-gcc@9
else
  info "4/9 Skipping AVR toolchain"
fi

info "5/9 Creating a native project-local Python"
if [[ "${install_conda_fallback}" == "true" && -x "${HOME}/miniconda3/bin/conda" ]]; then
  info "Using Conda Miniforge Python (M1 fallback)"
  run "${HOME}/miniconda3/bin/conda" create -y -p "${venv_dir}" "python=${python_version}" 2>/dev/null || true
  venv_python="${venv_dir}/bin/python"
else
  uv_bin="/opt/homebrew/bin/uv"
  run env UV_PYTHON_INSTALL_DIR="${python_install_dir}" \
    "${uv_bin}" python install "${python_version}"
  run env UV_PYTHON_INSTALL_DIR="${python_install_dir}" \
    "${uv_bin}" venv --python "${python_version}" --clear "${venv_dir}"
  venv_python="${venv_dir}/bin/python"
fi

info "6/9 Fetching the latest known-working ChipWhisperer source"
if [[ -d "${cw_source_dir}/.git" ]]; then
  origin_url="$(git -C "${cw_source_dir}" remote get-url origin)"
  [[ "${origin_url}" == "https://github.com/newaetech/chipwhisperer"* ]] ||
    die "${cw_source_dir} exists but is not NewAE ChipWhisperer."
  run git -C "${cw_source_dir}" fetch --tags origin
  run git -C "${cw_source_dir}" checkout "${cw_ref}"
  if [[ "${cw_ref}" == "develop" ]]; then
    run git -C "${cw_source_dir}" pull --ff-only origin "${cw_ref}"
  fi
else
  if [[ -e "${cw_source_dir}" ]]; then
    die "${cw_source_dir} exists but is not a Git checkout."
  fi
  run git clone --branch "${cw_ref}" https://github.com/newaetech/chipwhisperer.git "${cw_source_dir}"
fi
run git -C "${cw_source_dir}" submodule update --init jupyter

info "7/9 Installing ChipWhisperer, libusb1, and Jupyter"
run "${venv_python}" -m pip install --upgrade pip 2>/dev/null || \
  run "${uv_bin}" pip install --python "${venv_python}" --upgrade pip
run "${uv_bin}" pip install --python "${venv_python}" -e "${cw_source_dir}"
run "${uv_bin}" pip install --python "${venv_python}" -r "${cw_source_dir}/jupyter/requirements.txt"

if [[ "${install_app_stack}" == "true" ]]; then
  info "8/9 Installing the WhisperLab API and UI"
  run "${uv_bin}" pip install --python "${venv_python}" -e "${project_root}/backend[dev]"
  run_in "${project_root}" npm ci
else
  info "8/9 Skipping the WhisperLab application stack"
fi

info "9/9 Verifying architecture and imports"
if [[ "${dry_run}" == "true" ]]; then
  run "${venv_python}" -c "import chipwhisperer as cw; print(cw.__version__)"
  run "${script_dir}/doctor-macos.sh"
else
  python_machine="$("${venv_python}" -c 'import platform; print(platform.machine())')"
  if [[ "${simulator_only}" == "true" ]]; then
    "${venv_python}" -c 'import chipwhisperer as cw; print("ChipWhisperer", cw.__version__, "(simulator mode) import: ready")'
  else
    [[ "${python_machine}" == "arm64" ]] ||
      die "Python is ${python_machine}, not arm64. Refusing an architecture-mismatched libusb setup."
    "${venv_python}" -c 'import chipwhisperer as cw; print("ChipWhisperer", cw.__version__, "import: ready")'
  fi
  "${script_dir}/doctor-macos.sh" --simulator-only="${simulator_only}"
fi

if [[ "${verify_hardware}" == "true" && "${simulator_only}" != "true" ]]; then
  info "Connecting to real ChipWhisperer hardware"
  run "${venv_python}" -c 'import chipwhisperer as cw; print(cw.list_devices()); s=cw.scope(); print(s); s.dis()'
fi

install_report "${install_report_file}"

cat <<EOF

Installation complete.

Activate:   source "${venv_dir}/bin/activate"
Doctor:     ./scripts/doctor-macos.sh
Jupyter:    ./scripts/start-jupyter.sh
Workbench:  ./scripts/start-whisperlab.sh

No macOS udev rules are needed. USB access is provided by native Homebrew
libusb at /opt/homebrew and the arm64 Python environment above.
EOF
