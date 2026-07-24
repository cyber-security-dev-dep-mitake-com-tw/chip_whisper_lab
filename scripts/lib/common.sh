#!/usr/bin/env bash

# Shared utilities for WhisperLab scripts.
# Source this file; do not execute directly.

set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cw_source_dir="${project_root}/.vendor/chipwhisperer"
venv_dir="${project_root}/.venv"
python_install_dir="${project_root}/.toolchains/python"

color_green=$'\033[32m'
color_yellow=$'\033[33m'
color_red=$'\033[31m'
color_reset=$'\033[0m'

info() {
  printf '%s==>%s %s\n' "${color_green}" "${color_reset}" "$*"
}

warn() {
  printf '%swarning:%s %s\n' "${color_yellow}" "${color_reset}" "$*" >&2
}

die() {
  printf '%serror:%s %s\n' "${color_red}" "${color_reset}" "$*" >&2
  exit 1
}

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

run() {
  printf '+'
  printf ' %q' "$@"
  printf '\n'
  if [[ "${dry_run:-false}" != "true" ]]; then
    "$@"
  fi
}

run_in() {
  local directory="$1"
  shift
  printf '+ cd %q &&' "${directory}"
  printf ' %q' "$@"
  printf '\n'
  if [[ "${dry_run:-false}" != "true" ]]; then
    (
      cd "${directory}"
      "$@"
    )
  fi
}

confirm() {
  local prompt="$1"
  if [[ "${assume_yes:-false}" == "true" ]]; then
    return 0
  fi
  if [[ ! -t 0 ]]; then
    die "${prompt} Re-run in a terminal or pass --yes."
  fi
  read -r -p "${prompt} [y/N] " answer
  [[ "${answer}" =~ ^[Yy]$ ]]
}

require_apple_silicon() {
  [[ "$(uname -s)" == "Darwin" ]] || die "This installer supports macOS only."
  [[ "$(uname -m)" == "arm64" ]] || die "Native Apple Silicon is required; current architecture: $(uname -m). Do not run this installer through Rosetta."
}

brew_prefix() {
  if command_exists brew; then
    brew --prefix
  elif [[ -x /opt/homebrew/bin/brew ]]; then
    printf '/opt/homebrew\n'
  else
    return 1
  fi
}

install_report() {
  local report_file="${1:-${project_root}/INSTALL_REPORT.json}"
  shift
  local timestamp
  timestamp="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
  local os_version
  os_version="$(sw_vers -productVersion 2>/dev/null || echo 'unknown')"
  local arch
  arch="$(uname -m)"
  local cw_version="unknown"
  if [[ -x "${venv_dir}/bin/python" ]]; then
    cw_version="$("${venv_dir}/bin/python" -c 'import chipwhisperer as cw; print(cw.__version__)' 2>/dev/null || echo 'unknown')"
  fi

  cat > "${report_file}" <<ENDJSON
{
  "timestamp": "${timestamp}",
  "macos": "${os_version}",
  "arch": "${arch}",
  "dry_run": ${dry_run:-false},
  "simulator_only": ${simulator_only:-false},
  "conda_fallback": ${install_conda_fallback:-false},
  "install_esp32": ${install_esp32:-false},
  "install_app_stack": ${install_app_stack:-false},
  "cw_ref": "${cw_ref:-unknown}",
  "python_version": "${python_version:-unknown}",
  "chipwhisperer_version": "${cw_version}",
  "venv_path": "${venv_dir}",
  "cw_source": "${cw_source_dir}",
  "install_path": "${project_root}"
}
ENDJSON
  info "Installation report written to ${report_file}"
}
