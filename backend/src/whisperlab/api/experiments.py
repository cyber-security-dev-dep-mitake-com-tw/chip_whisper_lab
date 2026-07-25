from __future__ import annotations

import math
from datetime import UTC, datetime
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy import func, select

from ..deps import DbSession
from ..models.experiment import Experiment
from ..schemas import ErrorResponse, PaginatedResponse

router = APIRouter()


class ExperimentCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    description: str | None = None
    tags: list[str] = Field(default_factory=list)


class ExperimentUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = None
    tags: list[str] | None = None


class ExperimentOut(BaseModel):
    id: UUID
    name: str
    description: str | None
    tags: list[str]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


@router.get("", response_model=PaginatedResponse[ExperimentOut])
async def list_experiments(
    db: DbSession,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
):
    total_q = await db.execute(select(func.count(Experiment.id)))
    total = total_q.scalar_one()
    pages = max(1, math.ceil(total / page_size))
    offset = (page - 1) * page_size
    result = await db.execute(
        select(Experiment)
        .order_by(Experiment.created_at.desc())
        .offset(offset)
        .limit(page_size)
    )
    items = [ExperimentOut.model_validate(e) for e in result.scalars().all()]
    return PaginatedResponse(
        items=items, total=total, page=page, page_size=page_size, pages=pages
    )


@router.post("", response_model=ExperimentOut, status_code=201)
async def create_experiment(body: ExperimentCreate, db: DbSession):
    exp = Experiment(name=body.name, description=body.description, tags=body.tags)
    db.add(exp)
    await db.commit()
    await db.refresh(exp)
    return ExperimentOut.model_validate(exp)


@router.get(
    "/{experiment_id}",
    response_model=ExperimentOut,
    responses={404: {"model": ErrorResponse}},
)
async def get_experiment(experiment_id: UUID, db: DbSession):
    result = await db.execute(select(Experiment).where(Experiment.id == experiment_id))
    exp = result.scalar_one_or_none()
    if exp is None:
        raise HTTPException(status_code=404, detail="Experiment not found")
    return ExperimentOut.model_validate(exp)


@router.patch(
    "/{experiment_id}",
    response_model=ExperimentOut,
    responses={404: {"model": ErrorResponse}},
)
async def update_experiment(
    experiment_id: UUID, body: ExperimentUpdate, db: DbSession
):
    result = await db.execute(select(Experiment).where(Experiment.id == experiment_id))
    exp = result.scalar_one_or_none()
    if exp is None:
        raise HTTPException(status_code=404, detail="Experiment not found")
    if body.name is not None:
        exp.name = body.name
    if body.description is not None:
        exp.description = body.description
    if body.tags is not None:
        exp.tags = body.tags
    exp.updated_at = datetime.now(UTC)
    await db.commit()
    await db.refresh(exp)
    return ExperimentOut.model_validate(exp)


@router.delete(
    "/{experiment_id}",
    status_code=204,
    responses={404: {"model": ErrorResponse}},
)
async def delete_experiment(experiment_id: UUID, db: DbSession):
    result = await db.execute(select(Experiment).where(Experiment.id == experiment_id))
    exp = result.scalar_one_or_none()
    if exp is None:
        raise HTTPException(status_code=404, detail="Experiment not found")
    await db.delete(exp)
    await db.commit()
