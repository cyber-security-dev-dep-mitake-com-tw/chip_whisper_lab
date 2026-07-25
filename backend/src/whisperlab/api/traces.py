from __future__ import annotations

import math
from datetime import datetime
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, File, Form, HTTPException, Query, UploadFile
from pydantic import BaseModel
from sqlalchemy import func, select

from ..deps import DbSession
from ..models.trace import Trace
from ..schemas import ErrorResponse, PaginatedResponse

router = APIRouter()


class TraceUploadResponse(BaseModel):
    trace_id: UUID
    trace_set_name: str
    num_traces: int
    storage_path: str


class TraceOut(BaseModel):
    id: UUID
    experiment_id: UUID
    trace_set_name: str
    num_traces: int
    metadata_json: dict
    storage_path: str
    created_at: datetime

    model_config = {"from_attributes": True}


@router.post("/upload", response_model=TraceUploadResponse, status_code=201)
async def upload_trace(
    db: DbSession,
    experiment_id: Annotated[UUID, Query(description="Parent experiment ID")],
    file: Annotated[UploadFile, File()],
    trace_set_name: Annotated[str, Form()] = "default",
):
    content = await file.read()
    storage_path = f"/data/traces/{experiment_id}/{trace_set_name}"
    trace = Trace(
        experiment_id=experiment_id,
        trace_set_name=trace_set_name,
        num_traces=1,
        metadata_json={"filename": file.filename, "size_bytes": len(content)},
        storage_path=storage_path,
    )
    db.add(trace)
    await db.commit()
    await db.refresh(trace)
    return TraceUploadResponse(
        trace_id=trace.id,
        trace_set_name=trace.trace_set_name,
        num_traces=trace.num_traces,
        storage_path=trace.storage_path,
    )


@router.get("", response_model=PaginatedResponse[TraceOut])
async def list_traces(
    db: DbSession,
    experiment_id: UUID | None = None,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
):
    query = select(Trace)
    count_query = select(func.count(Trace.id))
    if experiment_id is not None:
        query = query.where(Trace.experiment_id == experiment_id)
        count_query = count_query.where(Trace.experiment_id == experiment_id)
    total = (await db.execute(count_query)).scalar_one()
    pages = max(1, math.ceil(total / page_size))
    offset = (page - 1) * page_size
    result = await db.execute(
        query.order_by(Trace.created_at.desc()).offset(offset).limit(page_size)
    )
    items = [TraceOut.model_validate(t) for t in result.scalars().all()]
    return PaginatedResponse(
        items=items, total=total, page=page, page_size=page_size, pages=pages
    )


@router.get(
    "/{trace_id}",
    response_model=TraceOut,
    responses={404: {"model": ErrorResponse}},
)
async def get_trace(trace_id: UUID, db: DbSession):
    result = await db.execute(select(Trace).where(Trace.id == trace_id))
    trace = result.scalar_one_or_none()
    if trace is None:
        raise HTTPException(status_code=404, detail="Trace not found")
    return TraceOut.model_validate(trace)


@router.get("/{trace_id}/download")
async def download_trace(trace_id: UUID, db: DbSession):
    result = await db.execute(select(Trace).where(Trace.id == trace_id))
    trace = result.scalar_one_or_none()
    if trace is None:
        raise HTTPException(status_code=404, detail="Trace not found")
    return {"storage_path": trace.storage_path, "trace_set_name": trace.trace_set_name}
