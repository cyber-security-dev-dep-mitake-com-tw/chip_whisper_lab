#!/usr/bin/env bash

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
