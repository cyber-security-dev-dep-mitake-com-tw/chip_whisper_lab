from __future__ import annotations

import math
from datetime import datetime
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy import func, select

from ..deps import DbSession
from ..models.attack import Attack
from ..schemas import ErrorResponse, PaginatedResponse

router = APIRouter()


class AttackCreate(BaseModel):
    experiment_id: UUID
    attack_type: str = Field(pattern="^(cpa|dpa|template|glitch|dfa)$")
    config_json: dict = Field(default_factory=dict)


class AttackOut(BaseModel):
    id: UUID
    experiment_id: UUID
    attack_type: str
    status: str
    config_json: dict
    result_json: dict | None
    created_at: datetime
    completed_at: datetime | None

    model_config = {"from_attributes": True}


@router.post("", response_model=AttackOut, status_code=201)
async def create_attack(body: AttackCreate, db: DbSession):
    attack = Attack(
        experiment_id=body.experiment_id,
        attack_type=body.attack_type,
        config_json=body.config_json,
    )
    db.add(attack)
    await db.commit()
    await db.refresh(attack)
    return AttackOut.model_validate(attack)


@router.get("", response_model=PaginatedResponse[AttackOut])
async def list_attacks(
    db: DbSession,
    experiment_id: UUID | None = None,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
):
    query = select(Attack)
    count_query = select(func.count(Attack.id))
    if experiment_id is not None:
        query = query.where(Attack.experiment_id == experiment_id)
        count_query = count_query.where(Attack.experiment_id == experiment_id)
    total = (await db.execute(count_query)).scalar_one()
    pages = max(1, math.ceil(total / page_size))
    offset = (page - 1) * page_size
    result = await db.execute(
        query.order_by(Attack.created_at.desc()).offset(offset).limit(page_size)
    )
    items = [AttackOut.model_validate(a) for a in result.scalars().all()]
    return PaginatedResponse(
        items=items, total=total, page=page, page_size=page_size, pages=pages
    )


@router.get(
    "/{attack_id}",
    response_model=AttackOut,
    responses={404: {"model": ErrorResponse}},
)
async def get_attack(attack_id: UUID, db: DbSession):
    result = await db.execute(select(Attack).where(Attack.id == attack_id))
    attack = result.scalar_one_or_none()
    if attack is None:
        raise HTTPException(status_code=404, detail="Attack not found")
    return AttackOut.model_validate(attack)


@router.get("/{attack_id}/results", responses={404: {"model": ErrorResponse}})
async def get_attack_results(attack_id: UUID, db: DbSession):
    result = await db.execute(select(Attack).where(Attack.id == attack_id))
    attack = result.scalar_one_or_none()
    if attack is None:
        raise HTTPException(status_code=404, detail="Attack not found")
    return {
        "attack_id": attack.id,
        "attack_type": attack.attack_type,
        "results": attack.result_json,
    }
