from __future__ import annotations

from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.attacks import router as attacks_router
from .api.experiments import router as experiments_router
from .api.reports import router as reports_router
from .api.targets import router as targets_router
from .api.traces import router as traces_router
from .config import get_settings
from .db import Base, get_engine
from .schemas import HealthResponse


@asynccontextmanager
async def lifespan(app: FastAPI):
    engine = get_engine()
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()


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
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(experiments_router, prefix="/api/v1/experiments", tags=["experiments"])
    app.include_router(traces_router, prefix="/api/v1/traces", tags=["traces"])
    app.include_router(attacks_router, prefix="/api/v1/attacks", tags=["attacks"])
    app.include_router(targets_router, prefix="/api/v1/targets", tags=["targets"])
    app.include_router(reports_router, prefix="/api/v1/reports", tags=["reports"])

    @app.get("/api/v1/health", response_model=HealthResponse)
    async def health() -> HealthResponse:
        return HealthResponse()

    return app


app = create_app()


def run() -> None:
    uvicorn.run(
        "whisperlab.main:app",
        host="0.0.0.0",
        port=8000,
        reload=False,
    )


if __name__ == "__main__":
    run()
