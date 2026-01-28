"""Bookings API routes for creating and managing bookings."""

from datetime import datetime
from decimal import Decimal
from typing import Annotated, Literal
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.database import get_db
from app.dependencies import get_current_user
from app.models.booking import Booking
from app.models.base import BookingType, GroupBookingStatus
from app.models.scheduled_ride import ScheduledRide
from app.models.user import User
from app.services.booking_service import BookingService

router = APIRouter()


# Schemas
class PassengerDetail(BaseModel):
    """Passenger information."""

    name: str
    phone: str | None = None
    age: int | None = None


class CreateGroupBookingRequest(BaseModel):
    """Request to create a group booking."""

    scheduled_ride_id: UUID
    passengers_count: int = Field(..., ge=1, le=10)
    passenger_details: list[PassengerDetail]
    luggage_notes: str | None = None


class BookingResponse(BaseModel):
    """Booking response."""

    id: str
    booking_number: str
    booking_type: str
    status: str
    passengers_count: int
    total_amount: float
    created_at: str


class BookingDetailResponse(BookingResponse):
    """Detailed booking response."""

    scheduled_ride: dict | None
    passenger_details: list[dict]
    payment_status: str | None
    driver: dict | None
    vehicle: dict | None
    timeline: list[dict]


class BookingListResponse(BaseModel):
    """List of bookings response."""

    bookings: list[BookingResponse]
    pagination: dict


class InitiatePaymentRequest(BaseModel):
    """Request to initiate payment."""

    payment_type: Literal["full", "advance"] = "full"
    redirect_url: str


class InitiatePaymentResponse(BaseModel):
    """Response with payment URL."""

    payment_id: str
    payment_url: str
    amount: float
    expires_at: str


class CancelBookingRequest(BaseModel):
    """Request to cancel booking."""

    reason: str


class CancelBookingResponse(BaseModel):
    """Response after cancelling booking."""

    success: bool
    refund: dict | None


# Routes
@router.post(
    "/group",
    response_model=BookingResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create group booking",
    description="Create a new booking for a scheduled group ride.",
)
async def create_group_booking(
    request: CreateGroupBookingRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> BookingResponse:
    """Create a new group booking."""
    booking_service = BookingService(db)

    try:
        booking = await booking_service.create_group_booking(
            user_id=current_user.id,
            scheduled_ride_id=request.scheduled_ride_id,
            passengers_count=request.passengers_count,
            passenger_details=[p.model_dump() for p in request.passenger_details],
            luggage_notes=request.luggage_notes,
        )

        return BookingResponse(
            id=str(booking.id),
            booking_number=booking.booking_number,
            booking_type=booking.booking_type.value,
            status=booking.status,
            passengers_count=booking.passengers_count,
            total_amount=float(booking.total_amount),
            created_at=booking.created_at.isoformat(),
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get(
    "",
    response_model=BookingListResponse,
    summary="List my bookings",
    description="Get list of current user's bookings.",
)
async def list_my_bookings(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
    status_filter: Literal["upcoming", "past", "cancelled"] = Query(
        "upcoming", alias="status"
    ),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=50),
) -> BookingListResponse:
    """List bookings for current user."""
    query = (
        select(Booking)
        .where(Booking.user_id == current_user.id, Booking.deleted_at.is_(None))
        .order_by(Booking.created_at.desc())
    )

    now = datetime.utcnow()

    if status_filter == "upcoming":
        query = query.where(
            Booking.group_status.in_(
                [GroupBookingStatus.DRAFT, GroupBookingStatus.PENDING_PAYMENT, GroupBookingStatus.CONFIRMED]
            )
        )
    elif status_filter == "past":
        query = query.where(Booking.group_status == GroupBookingStatus.COMPLETED)
    elif status_filter == "cancelled":
        query = query.where(Booking.group_status == GroupBookingStatus.CANCELLED)

    # Pagination
    offset = (page - 1) * per_page
    query = query.offset(offset).limit(per_page)

    result = await db.execute(query)
    bookings = result.scalars().all()

    return BookingListResponse(
        bookings=[
            BookingResponse(
                id=str(b.id),
                booking_number=b.booking_number,
                booking_type=b.booking_type.value,
                status=b.status,
                passengers_count=b.passengers_count,
                total_amount=float(b.total_amount),
                created_at=b.created_at.isoformat(),
            )
            for b in bookings
        ],
        pagination={"page": page, "per_page": per_page, "total": len(bookings)},
    )


@router.get(
    "/{booking_id}",
    response_model=BookingDetailResponse,
    summary="Get booking details",
)
async def get_booking(
    booking_id: UUID,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> BookingDetailResponse:
    """Get details of a specific booking."""
    result = await db.execute(
        select(Booking)
        .options(
            joinedload(Booking.scheduled_ride),
            joinedload(Booking.driver),
            joinedload(Booking.vehicle),
        )
        .where(Booking.id == booking_id, Booking.user_id == current_user.id)
    )
    booking = result.scalar_one_or_none()

    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

    return BookingDetailResponse(
        id=str(booking.id),
        booking_number=booking.booking_number,
        booking_type=booking.booking_type.value,
        status=booking.status,
        passengers_count=booking.passengers_count,
        total_amount=float(booking.total_amount),
        created_at=booking.created_at.isoformat(),
        scheduled_ride={
            "id": str(booking.scheduled_ride.id),
            "departure_time": booking.scheduled_ride.departure_time.isoformat(),
        }
        if booking.scheduled_ride
        else None,
        passenger_details=booking.passenger_details,
        payment_status="completed" if booking.is_confirmed else "pending",
        driver={
            "name": booking.driver.full_name,
            "phone": booking.driver.phone,
            "rating": float(booking.driver.rating),
        }
        if booking.driver
        else None,
        vehicle={
            "registration": booking.vehicle.registration_number,
            "type": booking.vehicle.vehicle_type.value,
            "model": booking.vehicle.display_name,
        }
        if booking.vehicle
        else None,
        timeline=[
            {"status": "draft", "timestamp": booking.created_at.isoformat()},
        ],
    )


@router.post(
    "/{booking_id}/pay",
    response_model=InitiatePaymentResponse,
    summary="Initiate payment",
    description="Initiate payment for a booking via Instamojo.",
)
async def initiate_payment(
    booking_id: UUID,
    request: InitiatePaymentRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> InitiatePaymentResponse:
    """Initiate payment for a booking."""
    booking_service = BookingService(db)

    try:
        payment_info = await booking_service.initiate_payment(
            booking_id=booking_id,
            user_id=current_user.id,
            payment_type=request.payment_type,
            redirect_url=request.redirect_url,
        )

        return InitiatePaymentResponse(
            payment_id=str(payment_info["payment_id"]),
            payment_url=payment_info["payment_url"],
            amount=payment_info["amount"],
            expires_at=payment_info["expires_at"].isoformat(),
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post(
    "/{booking_id}/cancel",
    response_model=CancelBookingResponse,
    summary="Cancel booking",
)
async def cancel_booking(
    booking_id: UUID,
    request: CancelBookingRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> CancelBookingResponse:
    """Cancel a booking and initiate refund if applicable."""
    booking_service = BookingService(db)

    try:
        result = await booking_service.cancel_booking(
            booking_id=booking_id,
            user_id=current_user.id,
            reason=request.reason,
        )

        return CancelBookingResponse(
            success=True,
            refund=result.get("refund"),
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
