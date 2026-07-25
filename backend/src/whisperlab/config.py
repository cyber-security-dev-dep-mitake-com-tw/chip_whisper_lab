from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="WHISPERLAB_",
        extra="ignore",
    )

    database_url: str = Field(
        default="postgresql+asyncpg://whisperlab:whisperlab@127.0.0.1:5432/whisperlab",
        repr=False,
    )
    redis_url: str = Field(default="redis://127.0.0.1:6379/0", repr=False)

    minio_endpoint: str = "127.0.0.1:9000"
    minio_access_key: str = Field(default="whisperlab", repr=False)
    minio_secret_key: str = Field(default="whisperlab", repr=False)
    minio_bucket: str = "whisperlab"
    minio_use_ssl: bool = False

    secret_key: str = Field(default="change-me-in-production", repr=False)
    cors_origins: list[str] = Field(
        default=["http://127.0.0.1:3000", "http://localhost:3000"],
    )

    enable_execution: bool = False
    workspace_root: Path = Field(default=Path("/tmp/whisperlab-workspace"))
    execution_timeout_seconds: int = Field(default=60, ge=1, le=3600)


@lru_cache
def get_settings() -> Settings:
    return Settings()
