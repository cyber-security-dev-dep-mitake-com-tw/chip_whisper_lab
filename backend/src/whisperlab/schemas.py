from __future__ import annotations

from enum import StrEnum

from pydantic import BaseModel, Field


class CheckState(StrEnum):
    READY = "ready"
    MISSING = "missing"
    WARNING = "warning"
    OPTIONAL = "optional"


class DoctorCheck(BaseModel):
    key: str
    label: str
    state: CheckState
    detail: str
    remediation: str | None = None


class DoctorReport(BaseModel):
    platform: str
    architecture: str
    native_apple_silicon: bool
    checks: list[DoctorCheck]


class DeviceSummary(BaseModel):
    id: str
    name: str
    serial_number: str | None = None
    firmware_version: str | None = None
    connected: bool
    simulated: bool = False


class CaptureRequest(BaseModel):
    samples: int = Field(default=5000, ge=1, le=200_000_000)
    gain_db: float = Field(default=22, ge=0, le=78)
    clock_hz: int = Field(default=7_370_000, ge=1)
    traces: int = Field(default=1, ge=1, le=1_000_000)


class CapturePreview(BaseModel):
    device_id: str
    samples: int
    trace: list[float]
    simulated: bool


class ExecutionRequest(BaseModel):
    source: str = Field(min_length=1, max_length=500_000)
    kind: str = Field(default="python", pattern="^(python|notebook)$")
    timeout_seconds: int | None = Field(default=None, ge=1, le=3600)
    acknowledged_risk: bool = False


class ExecutionResult(BaseModel):
    exit_code: int
    stdout: str
    stderr: str
    timed_out: bool = False
