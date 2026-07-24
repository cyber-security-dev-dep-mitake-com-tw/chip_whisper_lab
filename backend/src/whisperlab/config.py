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

    app_name: str = "WhisperLab"
    host: str = "127.0.0.1"
    port: int = 8123
    token: str = Field(default="", repr=False)
    simulation: bool = True
    enable_execution: bool = False
    execution_timeout_seconds: int = Field(default=30, ge=1, le=3600)
    workspace_root: Path = Field(default_factory=lambda: Path.cwd() / "work")
    data_root: Path = Field(default_factory=lambda: Path.cwd() / "data")
    database_url: str = Field(
        default="postgresql+asyncpg://whisperlab:whisperlab@127.0.0.1:5432/whisperlab",
        repr=False,
    )

    @property
    def is_loopback(self) -> bool:
        return self.host in {"127.0.0.1", "::1", "localhost"}


@lru_cache
def get_settings() -> Settings:
    return Settings()
