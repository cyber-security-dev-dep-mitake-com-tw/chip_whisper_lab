from __future__ import annotations

from datetime import UTC, datetime
from uuid import UUID, uuid4

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.dialects.postgresql import JSONB, UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from ..db import Base


class Attack(Base):
    __tablename__ = "attacks"

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid4
    )
    experiment_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("experiments.id", ondelete="CASCADE")
    )
    attack_type: Mapped[str] = mapped_column(String(50))
    status: Mapped[str] = mapped_column(String(40), default="pending")
    config_json: Mapped[dict] = mapped_column(JSONB, default=dict)
    result_json: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC)
    )
    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
