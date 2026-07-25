#!/usr/bin/env bash

set -euo pipefail
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=scripts/lib/common.sh
source "${script_dir}/lib/common.sh"

[[ -x "${venv_dir}/bin/jupyter" ]] \
	|| die "Jupyter is not installed. Run ./scripts/install-macos.sh first."
[[ -d "${cw_source_dir}/jupyter" ]] \
	|| die "ChipWhisperer tutorials are missing. Run ./scripts/install-macos.sh first."

info "Starting ChipWhisperer Jupyter at http://127.0.0.1:8888"
cd "${cw_source_dir}"
exec "${venv_dir}/bin/jupyter" lab --ip=127.0.0.1 --port=8888 --notebook-dir="${cw_source_dir}/jupyter"
