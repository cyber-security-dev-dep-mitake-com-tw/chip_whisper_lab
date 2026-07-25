from __future__ import annotations

from enum import Enum
from typing import Generic, Literal, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class HealthResponse(BaseModel):
    status: str = "ok"
    version: str = "0.1.0"


class ErrorResponse(BaseModel):
    detail: str
    code: str | None = None


class PaginatedResponse(BaseModel, Generic[T]):
    items: list[T]
    total: int
    page: int = Field(ge=1)
    page_size: int = Field(ge=1)
    pages: int


class CheckState(str, Enum):
    READY = "ready"
    MISSING = "missing"
    OPTIONAL = "optional"
    WARNING = "warning"


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
    connected: bool = False
    simulated: bool = False


class CaptureRequest(BaseModel):
    samples: int = Field(default=5000, ge=1, le=1_000_000)
    device_id: str | None = None


class CapturePreview(BaseModel):
    device_id: str
    samples: int
    trace: list[float]
    simulated: bool = True


class ExecutionRequest(BaseModel):
    kind: Literal["python", "notebook"] = "python"
    source: str
    acknowledged_risk: bool = False
    timeout_seconds: int | None = None


class ExecutionResult(BaseModel):
    exit_code: int
    stdout: str = ""
    stderr: str = ""
    timed_out: bool = False
