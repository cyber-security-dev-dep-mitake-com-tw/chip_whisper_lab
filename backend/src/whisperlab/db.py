from __future__ import annotations

from datetime import UTC, datetime
from uuid import UUID, uuid4

from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID as PG_UUID
from sqlalchemy.ext.asyncio import AsyncAttrs, AsyncEngine, create_async_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

from .config import Settings


class Base(AsyncAttrs, DeclarativeBase):
    pass


class Experiment(Base):
    __tablename__ = "experiments"

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )
    name: Mapped[str] = mapped_column(String(180))
    workflow: Mapped[str] = mapped_column(String(80), default="capture")
    status: Mapped[str] = mapped_column(String(40), default="draft")
    device_serial: Mapped[str | None] = mapped_column(String(180), nullable=True)
    configuration: Mapped[dict] = mapped_column(JSONB, default=dict)
    artifact_path: Mapped[str | None] = mapped_column(Text, nullable=True)
    trace_count: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
    )


def create_engine(settings: Settings) -> AsyncEngine:
    return create_async_engine(settings.database_url, pool_pre_ping=True)
