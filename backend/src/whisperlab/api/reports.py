from __future__ import annotations

import math
from datetime import datetime
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy import func, select

from ..deps import DbSession
from ..models.report import Report
from ..schemas import ErrorResponse, PaginatedResponse

router = APIRouter()


class ReportCreate(BaseModel):
    experiment_id: UUID
    report_type: str = Field(min_length=1, max_length=50)


class ReportOut(BaseModel):
    id: UUID
    experiment_id: UUID
    report_type: str
    file_path: str
    created_at: datetime

    model_config = {"from_attributes": True}


@router.post("", response_model=ReportOut, status_code=201)
async def generate_report(body: ReportCreate, db: DbSession):
    file_path = f"/data/reports/{body.experiment_id}/{body.report_type}.pdf"
    report = Report(
        experiment_id=body.experiment_id,
        report_type=body.report_type,
        file_path=file_path,
    )
    db.add(report)
    await db.commit()
    await db.refresh(report)
    return ReportOut.model_validate(report)


@router.get("", response_model=PaginatedResponse[ReportOut])
async def list_reports(
    db: DbSession,
    experiment_id: UUID | None = None,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
):
    query = select(Report)
    count_query = select(func.count(Report.id))
    if experiment_id is not None:
        query = query.where(Report.experiment_id == experiment_id)
        count_query = count_query.where(Report.experiment_id == experiment_id)
    total = (await db.execute(count_query)).scalar_one()
    pages = max(1, math.ceil(total / page_size))
    offset = (page - 1) * page_size
    result = await db.execute(
        query.order_by(Report.created_at.desc()).offset(offset).limit(page_size)
    )
    items = [ReportOut.model_validate(r) for r in result.scalars().all()]
    return PaginatedResponse(
        items=items, total=total, page=page, page_size=page_size, pages=pages
    )


@router.get(
    "/{report_id}",
    response_model=ReportOut,
    responses={404: {"model": ErrorResponse}},
)
async def get_report(report_id: UUID, db: DbSession):
    result = await db.execute(select(Report).where(Report.id == report_id))
    report = result.scalar_one_or_none()
    if report is None:
        raise HTTPException(status_code=404, detail="Report not found")
    return ReportOut.model_validate(report)


@router.get("/{report_id}/download", responses={404: {"model": ErrorResponse}})
async def download_report(report_id: UUID, db: DbSession):
    result = await db.execute(select(Report).where(Report.id == report_id))
    report = result.scalar_one_or_none()
    if report is None:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"file_path": report.file_path, "report_type": report.report_type}
