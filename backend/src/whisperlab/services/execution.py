from __future__ import annotations

import json
import subprocess
import sys
import tempfile
from pathlib import Path

from ..config import Settings
from ..schemas import ExecutionRequest, ExecutionResult


class ExecutionDisabledError(RuntimeError):
    pass


def _to_text(value: bytes | str | None) -> str:
    if value is None:
        return ""
    if isinstance(value, bytes):
        return value.decode("utf-8", errors="replace")
    return value


class ExecutionService:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings

    def execute(self, request: ExecutionRequest) -> ExecutionResult:
        if not self.settings.enable_execution:
            raise ExecutionDisabledError(
                "Arbitrary execution is disabled. Start with WHISPERLAB_ENABLE_EXECUTION=1."
            )
        if not request.acknowledged_risk:
            raise ValueError("acknowledged_risk must be true")

        self.settings.workspace_root.mkdir(parents=True, exist_ok=True)
        timeout = request.timeout_seconds or self.settings.execution_timeout_seconds
        suffix = ".ipynb" if request.kind == "notebook" else ".py"

        with tempfile.TemporaryDirectory(
            prefix="job-",
            dir=self.settings.workspace_root,
        ) as temporary_directory:
            job_root = Path(temporary_directory)
            source_path = job_root / f"source{suffix}"
            source_path.write_text(request.source, encoding="utf-8")

            if request.kind == "notebook":
                try:
                    json.loads(request.source)
                except json.JSONDecodeError as error:
                    raise ValueError("Notebook source must be valid JSON") from error
                command = [
                    sys.executable,
                    "-m",
                    "jupyter",
                    "nbconvert",
                    "--to",
                    "notebook",
                    "--execute",
                    "--ExecutePreprocessor.timeout",
                    str(timeout),
                    str(source_path),
                ]
            else:
                command = [sys.executable, "-I", str(source_path)]

            try:
                completed = subprocess.run(
                    command,
                    cwd=job_root,
                    capture_output=True,
                    text=True,
                    timeout=timeout,
                    check=False,
                    env={
                        "PATH": str(Path(sys.executable).parent),
                        "PYTHONIOENCODING": "utf-8",
                    },
                )
            except subprocess.TimeoutExpired as error:
                return ExecutionResult(
                    exit_code=124,
                    stdout=_to_text(error.stdout)[-100_000:],
                    stderr=_to_text(error.stderr)[-100_000:],
                    timed_out=True,
                )

        return ExecutionResult(
            exit_code=completed.returncode,
            stdout=completed.stdout[-100_000:],
            stderr=completed.stderr[-100_000:],
        )
