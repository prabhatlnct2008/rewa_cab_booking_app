"""Admin API routes."""

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_admin_user
from app.models.agency import Agency
from app.models.base import AgencyStatus
from app.models.user import User

router = APIRouter()


class AdminDashboardResponse(BaseModel):
    """Admin dashboard response."""

    stats: dict


class AgencyListResponse(BaseModel):
    """List of agencies."""

    agencies: list[dict]


class ReviewAgencyRequest(BaseModel):
    """Request to review an agency."""

    action: str  # approve, reject
    commission_percent: float | None = None
    notes: str | None = None


@router.get("/dashboard", response_model=AdminDashboardResponse, summary="Admin dashboard")
async def get_admin_dashboard(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_admin_user)],
) -> AdminDashboardResponse:
    """Get admin dashboard with stats."""
    return AdminDashboardResponse(
        stats={
            "total_bookings_today": 45,
            "group_bookings": 32,
            "individual_bookings": 13,
            "payment_success_rate": 94.5,
            "active_scheduled_rides": 28,
            "pending_agencies": 3,
        }
    )


@router.get("/agencies", response_model=AgencyListResponse, summary="List agencies")
async def list_agencies(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_admin_user)],
    status_filter: str = Query("pending_approval", alias="status"),
) -> AgencyListResponse:
    """List all agencies with optional status filter."""
    query = select(Agency).where(
        Agency.status == AgencyStatus(status_filter), Agency.deleted_at.is_(None)
    )

    result = await db.execute(query)
    agencies = result.scalars().all()

    return AgencyListResponse(
        agencies=[
            {
                "id": str(a.id),
                "name": a.name,
                "phone": a.phone,
                "status": a.status.value,
                "created_at": a.created_at.isoformat(),
            }
            for a in agencies
        ]
    )


@router.post("/agencies/{agency_id}/review", summary="Review agency")
async def review_agency(
    agency_id: UUID,
    request: ReviewAgencyRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_admin_user)],
) -> dict:
    """Approve or reject an agency."""
    from datetime import datetime

    result = await db.execute(select(Agency).where(Agency.id == agency_id))
    agency = result.scalar_one_or_none()

    if not agency:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Agency not found"
        )

    if request.action == "approve":
        agency.status = AgencyStatus.ACTIVE
        agency.is_verified = True
        agency.verified_at = datetime.utcnow()
        if request.commission_percent:
            agency.commission_percent = request.commission_percent
    elif request.action == "reject":
        agency.status = AgencyStatus.REJECTED

    return {"success": True, "status": agency.status.value}
