"""Agency Portal API routes."""

from datetime import datetime
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.database import get_db
from app.dependencies import get_current_agency_user
from app.models.agency import Agency
from app.models.base import LeadStatus, QuoteStatus
from app.models.quote import Quote
from app.models.ride_request import RideRequest
from app.models.user import User

router = APIRouter()


class DashboardResponse(BaseModel):
    """Agency dashboard response."""

    stats: dict
    recent_leads: list[dict]
    upcoming_trips: list[dict]


class LeadResponse(BaseModel):
    """Lead response."""

    id: str
    status: str
    pickup: dict
    drop: dict
    requested_datetime: str
    passengers_count: int
    notes: str | None


class LeadListResponse(BaseModel):
    """List of leads."""

    leads: list[LeadResponse]


class SendQuoteRequest(BaseModel):
    """Request to send a quote."""

    total_price: float
    advance_amount: float
    vehicle_type: str
    estimated_pickup_time: datetime | None = None
    message: str | None = None
    valid_for_hours: int = 6


class QuoteResponse(BaseModel):
    """Quote response."""

    id: str
    status: str
    valid_until: str


@router.get("/dashboard", response_model=DashboardResponse, summary="Get agency dashboard")
async def get_dashboard(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_agency_user)],
) -> DashboardResponse:
    """Get agency dashboard with stats."""
    # Get agency
    result = await db.execute(
        select(Agency).where(Agency.user_id == current_user.id)
    )
    agency = result.scalar_one_or_none()

    if not agency:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Agency not found"
        )

    return DashboardResponse(
        stats={
            "new_leads": 5,
            "quotes_sent_today": 12,
            "confirmed_today": 3,
            "revenue_this_month": 45000.00,
        },
        recent_leads=[],
        upcoming_trips=[],
    )


@router.get("/leads", response_model=LeadListResponse, summary="List leads")
async def list_leads(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_agency_user)],
    status_filter: str = Query("new", alias="status"),
) -> LeadListResponse:
    """List available leads for agency."""
    query = (
        select(RideRequest)
        .options(
            joinedload(RideRequest.pickup_place),
            joinedload(RideRequest.drop_place),
        )
        .where(RideRequest.status == LeadStatus(status_filter))
        .order_by(RideRequest.created_at.desc())
    )

    result = await db.execute(query)
    leads = result.scalars().unique().all()

    return LeadListResponse(
        leads=[
            LeadResponse(
                id=str(lead.id),
                status=lead.status.value,
                pickup={"name": lead.pickup_place.name},
                drop={"name": lead.drop_place.name},
                requested_datetime=lead.requested_datetime.isoformat(),
                passengers_count=lead.passengers_count,
                notes=lead.notes,
            )
            for lead in leads
        ]
    )


@router.post(
    "/leads/{request_id}/accept",
    summary="Accept lead",
)
async def accept_lead(
    request_id: UUID,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_agency_user)],
) -> dict:
    """Accept a lead to send quotes."""
    # Get agency
    result = await db.execute(
        select(Agency).where(Agency.user_id == current_user.id)
    )
    agency = result.scalar_one_or_none()

    if not agency:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Agency not found"
        )

    # Update lead status
    lead_result = await db.execute(
        select(RideRequest).where(RideRequest.id == request_id)
    )
    lead = lead_result.scalar_one_or_none()

    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found"
        )

    lead.status = LeadStatus.ACCEPTED

    return {"success": True, "message": "Lead accepted. You can now send a quote."}


@router.post(
    "/leads/{request_id}/quote",
    response_model=QuoteResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Send quote",
)
async def send_quote(
    request_id: UUID,
    request: SendQuoteRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_agency_user)],
) -> QuoteResponse:
    """Send a quote for a lead."""
    from datetime import timedelta
    from app.models.base import VehicleType

    # Get agency
    result = await db.execute(
        select(Agency).where(Agency.user_id == current_user.id)
    )
    agency = result.scalar_one_or_none()

    if not agency:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Agency not found"
        )

    # Create quote
    quote = Quote(
        ride_request_id=request_id,
        agency_id=agency.id,
        total_price=request.total_price,
        advance_amount=request.advance_amount,
        vehicle_type=VehicleType(request.vehicle_type),
        estimated_pickup_time=request.estimated_pickup_time,
        message=request.message,
        status=QuoteStatus.SENT,
        valid_until=datetime.utcnow() + timedelta(hours=request.valid_for_hours),
    )
    db.add(quote)
    await db.flush()

    return QuoteResponse(
        id=str(quote.id),
        status=quote.status.value,
        valid_until=quote.valid_until.isoformat(),
    )
