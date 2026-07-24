from __future__ import annotations

import secrets
from contextlib import asynccontextmanager
from typing import Annotated

import uvicorn
from fastapi import Depends, FastAPI, Header, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from .config import Settings, get_settings
from .schemas import (
    CapturePreview,
    CaptureRequest,
    DeviceSummary,
    DoctorReport,
    ExecutionRequest,
    ExecutionResult,
)
from .services.devices import DeviceService
from .services.doctor import build_doctor_report
from .services.execution import ExecutionDisabledError, ExecutionService


def require_local_token(
    x_whisperlab_token: Annotated[str | None, Header()] = None,
    settings: Settings = Depends(get_settings),
) -> None:
    if not settings.token:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Server token is not configured.",
        )
    if not x_whisperlab_token or not secrets.compare_digest(x_whisperlab_token, settings.token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid local session token.",
        )


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    settings.workspace_root.mkdir(parents=True, exist_ok=True)
    settings.data_root.mkdir(parents=True, exist_ok=True)
    app.state.settings = settings
    yield


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title="WhisperLab API",
        version="0.1.0",
        docs_url="/api/docs",
        redoc_url=None,
        lifespan=lifespan,
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://127.0.0.1:3000", "http://localhost:3000"],
        allow_credentials=False,
        allow_methods=["GET", "POST"],
        allow_headers=["Content-Type", "X-WhisperLab-Token"],
    )

    @app.get("/api/v1/health")
    async def health() -> dict[str, str | bool]:
        return {
            "status": "ok",
            "simulation": settings.simulation,
            "execution_enabled": settings.enable_execution,
        }

    @app.get("/api/v1/system/doctor", response_model=DoctorReport)
    async def doctor() -> DoctorReport:
        return build_doctor_report()

    @app.get("/api/v1/devices", response_model=list[DeviceSummary])
    async def devices() -> list[DeviceSummary]:
        return DeviceService(simulation=settings.simulation).list_devices()

    @app.post(
        "/api/v1/captures/preview",
        response_model=CapturePreview,
        dependencies=[Depends(require_local_token)],
    )
    async def capture_preview(request: CaptureRequest) -> CapturePreview:
        try:
            return DeviceService(simulation=settings.simulation).capture_preview(request)
        except RuntimeError as error:
            raise HTTPException(status_code=409, detail=str(error)) from error

    @app.post(
        "/api/v1/execution/jobs",
        response_model=ExecutionResult,
        dependencies=[Depends(require_local_token)],
    )
    async def execute(request: ExecutionRequest) -> ExecutionResult:
        try:
            return ExecutionService(settings).execute(request)
        except ExecutionDisabledError as error:
            raise HTTPException(status_code=403, detail=str(error)) from error
        except ValueError as error:
            raise HTTPException(status_code=422, detail=str(error)) from error

    return app


app = create_app()


def run() -> None:
    settings = get_settings()
    if not settings.is_loopback:
        raise SystemExit(
            "Refusing to expose hardware control outside loopback. "
            "Use a separate authenticated gateway if remote access is required."
        )
    if not settings.token:
        raise SystemExit("Set WHISPERLAB_TOKEN to a fresh per-launch secret.")
    uvicorn.run(
        "whisperlab.main:app",
        host=settings.host,
        port=settings.port,
        reload=False,
    )


if __name__ == "__main__":
    run()
