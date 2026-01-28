"""Scheduled Rides API for group ride booking."""

from datetime import date, datetime, timedelta
from typing import Annotated, Literal
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.config import get_settings
from app.database import get_db
from app.dependencies import get_current_user
from app.models.agency import Agency
from app.models.route import Route
from app.models.scheduled_ride import ScheduledRide
from app.models.user import User
from app.services.seat_lock_service import SeatLockService

router = APIRouter()
settings = get_settings()


# Schemas
class AgencyBriefResponse(BaseModel):
    """Brief agency info in ride response."""

    name: str
    is_verified: bool


class ScheduledRideResponse(BaseModel):
    """Scheduled ride in list response."""

    id: str
    route: dict
    departure_time: str
    arrival_estimate: str
    duration_minutes: int
    seat_capacity: int
    seats_available: int
    price_per_seat: float
    vehicle_type: str
    agency: AgencyBriefResponse | None


class ScheduledRideDetailResponse(ScheduledRideResponse):
    """Detailed scheduled ride response."""

    policies: dict


class ScheduledRideListResponse(BaseModel):
    """List of scheduled rides."""

    rides: list[ScheduledRideResponse]
    pagination: dict


class LockSeatsRequest(BaseModel):
    """Request to lock seats."""

    passengers_count: int


class LockSeatsResponse(BaseModel):
    """Response after locking seats."""

    success: bool
    lock_id: str
    expires_at: str
    seats_locked: int


def ride_to_response(ride: ScheduledRide) -> ScheduledRideResponse:
    """Convert ScheduledRide model to response."""
    return ScheduledRideResponse(
        id=str(ride.id),
        route={
            "from": {"name": ride.route.from_place.name},
            "to": {"name": ride.route.to_place.name},
        },
        departure_time=ride.departure_time.isoformat(),
        arrival_estimate=ride.arrival_estimate.isoformat(),
        duration_minutes=ride.duration_minutes,
        seat_capacity=ride.seat_capacity,
        seats_available=ride.seats_available,
        price_per_seat=float(ride.price_per_seat),
        vehicle_type=ride.vehicle_type.value,
        agency=AgencyBriefResponse(
            name=ride.agency.name,
            is_verified=ride.agency.is_verified,
        )
        if ride.agency
        else None,
    )


# Routes
@router.get(
    "",
    response_model=ScheduledRideListResponse,
    summary="Search scheduled rides",
    description="Search for available scheduled group rides.",
)
async def search_scheduled_rides(
    db: Annotated[AsyncSession, Depends(get_db)],
    from_place_id: UUID = Query(..., description="Departure place ID"),
    to_place_id: UUID = Query(..., description="Destination place ID"),
    date: date = Query(..., description="Travel date"),
    passengers: int = Query(1, ge=1, le=10, description="Number of passengers"),
    vehicle_type: str | None = Query(None, description="Filter by vehicle type"),
    sort: Literal["cheapest", "earliest", "seats"] = Query("earliest", description="Sort order"),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=50),
) -> ScheduledRideListResponse:
    """Search for scheduled rides matching criteria."""
    # Find route
    route_result = await db.execute(
        select(Route).where(
            Route.from_place_id == from_place_id,
            Route.to_place_id == to_place_id,
            Route.is_active == True,
        )
    )
    route = route_result.scalar_one_or_none()

    if not route:
        return ScheduledRideListResponse(
            rides=[],
            pagination={"page": page, "per_page": per_page, "total": 0},
        )

    # Build query
    start_of_day = datetime.combine(date, datetime.min.time())
    end_of_day = datetime.combine(date, datetime.max.time())

    query = (
        select(ScheduledRide)
        .options(
            joinedload(ScheduledRide.route).joinedload(Route.from_place),
            joinedload(ScheduledRide.route).joinedload(Route.to_place),
            joinedload(ScheduledRide.agency),
        )
        .where(
            ScheduledRide.route_id == route.id,
            ScheduledRide.is_published == True,
            ScheduledRide.departure_time >= start_of_day,
            ScheduledRide.departure_time <= end_of_day,
            ScheduledRide.deleted_at.is_(None),
            # Ensure enough seats available
            (ScheduledRide.seat_capacity - ScheduledRide.seats_booked) >= passengers,
        )
    )

    if vehicle_type:
        query = query.where(ScheduledRide.vehicle_type == vehicle_type)

    # Sorting
    if sort == "cheapest":
        query = query.order_by(ScheduledRide.price_per_seat)
    elif sort == "earliest":
        query = query.order_by(ScheduledRide.departure_time)
    elif sort == "seats":
        query = query.order_by(
            (ScheduledRide.seat_capacity - ScheduledRide.seats_booked).desc()
        )

    # Pagination
    offset = (page - 1) * per_page
    query = query.offset(offset).limit(per_page)

    result = await db.execute(query)
    rides = result.scalars().unique().all()

    # Get total count
    count_result = await db.execute(
        select(ScheduledRide.id).where(
            ScheduledRide.route_id == route.id,
            ScheduledRide.is_published == True,
            ScheduledRide.departure_time >= start_of_day,
            ScheduledRide.departure_time <= end_of_day,
        )
    )
    total = len(count_result.all())

    return ScheduledRideListResponse(
        rides=[ride_to_response(r) for r in rides],
        pagination={"page": page, "per_page": per_page, "total": total},
    )


@router.get(
    "/{ride_id}",
    response_model=ScheduledRideDetailResponse,
    summary="Get scheduled ride details",
)
async def get_scheduled_ride(
    ride_id: UUID,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ScheduledRideDetailResponse:
    """Get details of a specific scheduled ride."""
    result = await db.execute(
        select(ScheduledRide)
        .options(
            joinedload(ScheduledRide.route).joinedload(Route.from_place),
            joinedload(ScheduledRide.route).joinedload(Route.to_place),
            joinedload(ScheduledRide.agency),
        )
        .where(ScheduledRide.id == ride_id, ScheduledRide.is_published == True)
    )
    ride = result.scalar_one_or_none()

    if not ride:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ride not found")

    base = ride_to_response(ride)
    return ScheduledRideDetailResponse(
        **base.model_dump(),
        policies={
            "cancellation": "Full refund if cancelled 24+ hours before departure. "
            "50% refund for 12-24 hours. No refund within 12 hours.",
            "payment": "Full payment required to confirm booking.",
        },
    )


@router.post(
    "/{ride_id}/lock-seats",
    response_model=LockSeatsResponse,
    summary="Lock seats for payment",
    description="Temporarily lock seats while completing payment.",
)
async def lock_seats(
    ride_id: UUID,
    request: LockSeatsRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> LockSeatsResponse:
    """Lock seats for a scheduled ride during payment flow."""
    seat_lock_service = SeatLockService(db)

    result = await seat_lock_service.lock_seats(
        scheduled_ride_id=ride_id,
        user_id=current_user.id,
        seats_count=request.passengers_count,
        lock_duration_minutes=settings.seat_lock_minutes,
    )

    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"code": "INSUFFICIENT_SEATS", "message": result["message"]},
        )

    return LockSeatsResponse(
        success=True,
        lock_id=str(result["lock_id"]),
        expires_at=result["expires_at"].isoformat(),
        seats_locked=request.passengers_count,
    )
