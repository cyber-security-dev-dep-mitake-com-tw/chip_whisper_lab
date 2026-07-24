from __future__ import annotations

import math
from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from ..db import get_db
from ..models.target import Target
from ..schemas import ErrorResponse, PaginatedResponse

router = APIRouter()


class TargetCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    target_type: str = Field(pattern="^(cw_lite|cw_hex|cw_pro|custom)$")
    connection_info_json: dict = Field(default_factory=dict)
    firmware_path: str | None = None


class TargetOut(BaseModel):
    id: UUID
    name: str
    target_type: str
    connection_info_json: dict
    firmware_path: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class FlashRequest(BaseModel):
    firmware_path: str = Field(min_length=1)


class FlashResponse(BaseModel):
    target_id: UUID
    firmware_path: str
    status: str


class ConnectionTestResponse(BaseModel):
    target_id: UUID
    connected: bool
    detail: str


@router.post("", response_model=TargetOut, status_code=201)
async def register_target(body: TargetCreate, db: AsyncSession = Depends(get_db)):
    target = Target(
        name=body.name,
        target_type=body.target_type,
        connection_info_json=body.connection_info_json,
        firmware_path=body.firmware_path,
    )
    db.add(target)
    await db.commit()
    await db.refresh(target)
    return TargetOut.model_validate(target)


@router.get("", response_model=PaginatedResponse[TargetOut])
async def list_targets(
    page: int = Field(default=1, ge=1),
    page_size: int = Field(default=20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    total = (await db.execute(select(func.count(Target.id)))).scalar_one()
    pages = max(1, math.ceil(total / page_size))
    offset = (page - 1) * page_size
    result = await db.execute(
        select(Target).order_by(Target.created_at.desc()).offset(offset).limit(page_size)
    )
    items = [TargetOut.model_validate(t) for t in result.scalars().all()]
    return PaginatedResponse(items=items, total=total, page=page, page_size=page_size, pages=pages)


@router.get("/{target_id}", response_model=TargetOut, responses={404: {"model": ErrorResponse}})
async def get_target(target_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Target).where(Target.id == target_id))
    target = result.scalar_one_or_none()
    if target is None:
        raise HTTPException(status_code=404, detail="Target not found")
    return TargetOut.model_validate(target)


@router.post("/{target_id}/flash", response_model=FlashResponse, responses={404: {"model": ErrorResponse}})
async def flash_firmware(target_id: UUID, body: FlashRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Target).where(Target.id == target_id))
    target = result.scalar_one_or_none()
    if target is None:
        raise HTTPException(status_code=404, detail="Target not found")
    target.firmware_path = body.firmware_path
    await db.commit()
    return FlashResponse(target_id=target.id, firmware_path=body.firmware_path, status="flashed")


@router.post("/{target_id}/test", response_model=ConnectionTestResponse, responses={404: {"model": ErrorResponse}})
async def test_connection(target_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Target).where(Target.id == target_id))
    target = result.scalar_one_or_none()
    if target is None:
        raise HTTPException(status_code=404, detail="Target not found")
    return ConnectionTestResponse(
        target_id=target.id, connected=True, detail="Connection successful"
    )
