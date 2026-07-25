from __future__ import annotations

from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.attack import Attack
from ..tasks.cpu_tasks import (
    run_cpa_attack,
    run_dfa_attack,
    run_dpa_attack,
    run_glitch_attack,
    run_template_attack,
)

ATTACK_TASK_MAP: dict[str, Any] = {
    "cpa": run_cpa_attack,
    "dpa": run_dpa_attack,
    "template": run_template_attack,
    "glitch": run_glitch_attack,
    "dfa": run_dfa_attack,
}


class AttackRunner:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def dispatch(self, attack_id: str, attack_type: str, config: dict) -> str:
        task_fn = ATTACK_TASK_MAP.get(attack_type)
        if task_fn is None:
            raise ValueError(f"Unknown attack type: {attack_type}")

        result = task_fn.delay(attack_id, config)

        attack = (
            await self.db.execute(select(Attack).where(Attack.id == attack_id))
        ).scalar_one_or_none()
        if attack is not None:
            attack.status = "running"
            await self.db.commit()

        return result.id

    async def get_status(self, attack_id: str) -> dict[str, Any]:
        attack = (
            await self.db.execute(select(Attack).where(Attack.id == attack_id))
        ).scalar_one_or_none()
        if attack is None:
            raise ValueError(f"Attack not found: {attack_id}")
        return {
            "attack_id": str(attack.id),
            "status": attack.status,
            "attack_type": attack.attack_type,
        }
