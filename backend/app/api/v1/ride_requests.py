"""Ride Request API routes for individual ride bookings."""

from datetime import datetime, timedelta
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.config import get_settings
from app.database import get_db
from app.dependencies import get_current_user
from app.models.base import LeadStatus, VehicleType
from app.models.place import Place
from app.models.ride_request import RideRequest
from app.models.user import User

router = APIRouter()
settings = get_settings()


class CreateRideRequestInput(BaseModel):
    """Request to create a ride request."""

    pickup_place_id: UUID
    drop_place_id: UUID
    pickup_address: str | None = None
    drop_address: str | None = None
    requested_datetime: datetime
    passengers_count: int = Field(1, ge=1, le=10)
    vehicle_preference: str | None = None
    notes: str | None = None


class RideRequestResponse(BaseModel):
    """Ride request response."""

    id: str
    status: str
    pickup: dict
    drop: dict
    requested_datetime: str
    passengers_count: int
    expires_at: str
    created_at: str


class RideRequestDetailResponse(RideRequestResponse):
    """Detailed ride request with quotes."""

    quotes: list[dict]


@router.post(
    "",
    response_model=RideRequestResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create ride request",
)
async def create_ride_request(
    request: CreateRideRequestInput,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> RideRequestResponse:
    """Create a new individual ride request."""
    # Validate places exist
    pickup = await db.get(Place, request.pickup_place_id)
    drop = await db.get(Place, request.drop_place_id)

    if not pickup or not drop:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid place ID"
        )

    # Create request
    ride_request = RideRequest(
        user_id=current_user.id,
        pickup_place_id=request.pickup_place_id,
        drop_place_id=request.drop_place_id,
        pickup_address=request.pickup_address,
        drop_address=request.drop_address,
        requested_datetime=request.requested_datetime,
        passengers_count=request.passengers_count,
        vehicle_preference=VehicleType(request.vehicle_preference)
        if request.vehicle_preference
        else None,
        notes=request.notes,
        status=LeadStatus.NEW,
        expires_at=datetime.utcnow() + timedelta(hours=6),
    )
    db.add(ride_request)
    await db.flush()

    return RideRequestResponse(
        id=str(ride_request.id),
        status=ride_request.status.value,
        pickup={"name": pickup.name, "address": request.pickup_address},
        drop={"name": drop.name, "address": request.drop_address},
        requested_datetime=ride_request.requested_datetime.isoformat(),
        passengers_count=ride_request.passengers_count,
        expires_at=ride_request.expires_at.isoformat(),
        created_at=ride_request.created_at.isoformat(),
    )


@router.get(
    "/{request_id}",
    response_model=RideRequestDetailResponse,
    summary="Get ride request with quotes",
)
async def get_ride_request(
    request_id: UUID,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> RideRequestDetailResponse:
    """Get ride request details with quotes."""
    result = await db.execute(
        select(RideRequest)
        .options(
            joinedload(RideRequest.pickup_place),
            joinedload(RideRequest.drop_place),
            joinedload(RideRequest.quotes),
        )
        .where(RideRequest.id == request_id, RideRequest.user_id == current_user.id)
    )
    ride_request = result.scalar_one_or_none()

    if not ride_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Ride request not found"
        )

    return RideRequestDetailResponse(
        id=str(ride_request.id),
        status=ride_request.status.value,
        pickup={"name": ride_request.pickup_place.name},
        drop={"name": ride_request.drop_place.name},
        requested_datetime=ride_request.requested_datetime.isoformat(),
        passengers_count=ride_request.passengers_count,
        expires_at=ride_request.expires_at.isoformat(),
        created_at=ride_request.created_at.isoformat(),
        quotes=[
            {
                "id": str(q.id),
                "agency": {"name": q.agency.name if q.agency else "Unknown"},
                "total_price": float(q.total_price),
                "advance_amount": float(q.advance_amount),
                "valid_until": q.valid_until.isoformat(),
            }
            for q in ride_request.quotes
        ],
    )
