"""Booking service for managing ride bookings."""

from datetime import datetime, timedelta
from decimal import Decimal
from typing import Any
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.config import get_settings
from app.models.base import BookingType, GroupBookingStatus, PaymentStatus, PaymentType
from app.models.booking import Booking
from app.models.payment import Payment
from app.models.scheduled_ride import ScheduledRide
from app.services.payment_service import PaymentService

settings = get_settings()


class BookingService:
    """Service for managing bookings lifecycle."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def _generate_booking_number(self) -> str:
        """Generate a unique booking number."""
        year = datetime.utcnow().year
        prefix = f"RWC-{year}-"

        # Get last booking number for this year
        result = await self.db.execute(
            select(Booking.booking_number)
            .where(Booking.booking_number.like(f"{prefix}%"))
            .order_by(Booking.booking_number.desc())
            .limit(1)
        )
        last_number = result.scalar_one_or_none()

        if last_number:
            last_seq = int(last_number.split("-")[-1])
            new_seq = last_seq + 1
        else:
            new_seq = 1

        return f"{prefix}{new_seq:05d}"

    async def create_group_booking(
        self,
        user_id: UUID,
        scheduled_ride_id: UUID,
        passengers_count: int,
        passenger_details: list[dict],
        luggage_notes: str | None = None,
    ) -> Booking:
        """
        Create a new group booking (draft status).

        Args:
            user_id: The user making the booking
            scheduled_ride_id: The scheduled ride to book
            passengers_count: Number of passengers
            passenger_details: List of passenger info dicts
            luggage_notes: Optional luggage notes

        Returns:
            Created Booking object

        Raises:
            ValueError: If validation fails
        """
        # Get scheduled ride
        result = await self.db.execute(
            select(ScheduledRide)
            .options(joinedload(ScheduledRide.route))
            .where(ScheduledRide.id == scheduled_ride_id)
        )
        ride = result.scalar_one_or_none()

        if not ride:
            raise ValueError("Scheduled ride not found")

        if not ride.is_published:
            raise ValueError("This ride is not available for booking")

        if ride.seats_available < passengers_count:
            raise ValueError(
                f"Only {ride.seats_available} seats available, "
                f"but {passengers_count} requested"
            )

        # Calculate total amount
        total_amount = ride.price_per_seat * passengers_count

        # Generate booking number
        booking_number = await self._generate_booking_number()

        # Create booking
        booking = Booking(
            booking_number=booking_number,
            user_id=user_id,
            booking_type=BookingType.GROUP,
            scheduled_ride_id=scheduled_ride_id,
            group_status=GroupBookingStatus.DRAFT,
            passengers_count=passengers_count,
            passenger_details=passenger_details,
            luggage_notes=luggage_notes,
            total_amount=total_amount,
            pickup_time=ride.departure_time,
        )

        self.db.add(booking)
        await self.db.flush()

        return booking

    async def initiate_payment(
        self,
        booking_id: UUID,
        user_id: UUID,
        payment_type: str,
        redirect_url: str,
    ) -> dict[str, Any]:
        """
        Initiate payment for a booking via Instamojo.

        Args:
            booking_id: The booking UUID
            user_id: The user making the payment
            payment_type: 'full' or 'advance'
            redirect_url: URL to redirect after payment

        Returns:
            dict with payment_id, payment_url, amount, expires_at

        Raises:
            ValueError: If validation fails
        """
        # Get booking
        result = await self.db.execute(
            select(Booking)
            .options(joinedload(Booking.user))
            .where(Booking.id == booking_id, Booking.user_id == user_id)
        )
        booking = result.scalar_one_or_none()

        if not booking:
            raise ValueError("Booking not found")

        # Determine amount
        if payment_type == "full":
            amount = booking.total_amount
            ptype = PaymentType.FULL
        else:
            amount = booking.advance_amount or booking.total_amount
            ptype = PaymentType.ADVANCE

        # Update booking status
        if booking.booking_type == BookingType.GROUP:
            booking.group_status = GroupBookingStatus.PENDING_PAYMENT

        # Create payment record
        payment = Payment(
            booking_id=booking.id,
            user_id=user_id,
            payment_type=ptype,
            amount=amount,
            status=PaymentStatus.PENDING,
        )
        self.db.add(payment)
        await self.db.flush()

        # Create Instamojo payment request
        payment_service = PaymentService()
        try:
            instamojo_response = await payment_service.create_payment_request(
                amount=float(amount),
                purpose=f"Booking {booking.booking_number}",
                buyer_name=booking.user.full_name or "Customer",
                buyer_phone=booking.user.phone,
                redirect_url=redirect_url,
            )

            # Update payment with Instamojo details
            payment.provider_payment_request_id = instamojo_response["payment_request_id"]
            payment.payment_url = instamojo_response["payment_url"]

            expires_at = datetime.utcnow() + timedelta(minutes=settings.booking_timeout_minutes)

            return {
                "payment_id": payment.id,
                "payment_url": instamojo_response["payment_url"],
                "amount": float(amount),
                "expires_at": expires_at,
            }
        except Exception as e:
            payment.status = PaymentStatus.FAILED
            payment.failure_reason = str(e)
            raise ValueError(f"Failed to create payment: {str(e)}")

    async def cancel_booking(
        self,
        booking_id: UUID,
        user_id: UUID,
        reason: str,
    ) -> dict[str, Any]:
        """
        Cancel a booking and process refund if applicable.

        Args:
            booking_id: The booking UUID
            user_id: The user cancelling
            reason: Cancellation reason

        Returns:
            dict with success and refund info

        Raises:
            ValueError: If cancellation not allowed
        """
        # Get booking
        result = await self.db.execute(
            select(Booking)
            .options(joinedload(Booking.scheduled_ride))
            .where(Booking.id == booking_id, Booking.user_id == user_id)
        )
        booking = result.scalar_one_or_none()

        if not booking:
            raise ValueError("Booking not found")

        if booking.is_cancelled:
            raise ValueError("Booking is already cancelled")

        if booking.is_completed:
            raise ValueError("Cannot cancel a completed booking")

        # Calculate refund
        refund_info = None
        if booking.is_confirmed and booking.booking_type == BookingType.GROUP:
            refund_info = await self._calculate_refund(booking)

        # Update booking
        booking.group_status = GroupBookingStatus.CANCELLED
        booking.cancellation_reason = reason
        booking.cancelled_by = user_id
        booking.cancelled_at = datetime.utcnow()

        # Release seats if group booking
        if booking.scheduled_ride and booking.is_confirmed:
            booking.scheduled_ride.seats_booked = max(
                0, booking.scheduled_ride.seats_booked - booking.passengers_count
            )

        return {"refund": refund_info}

    async def _calculate_refund(self, booking: Booking) -> dict:
        """Calculate refund amount based on cancellation policy."""
        if not booking.scheduled_ride:
            return {"eligible": False, "amount": 0}

        now = datetime.utcnow()
        departure = booking.scheduled_ride.departure_time

        # Make departure timezone-naive for comparison
        if departure.tzinfo:
            departure = departure.replace(tzinfo=None)

        hours_until_departure = (departure - now).total_seconds() / 3600

        if hours_until_departure >= 24:
            percentage = 100
        elif hours_until_departure >= 12:
            percentage = 50
        else:
            percentage = 0

        refund_amount = float(booking.total_amount) * percentage / 100

        return {
            "eligible": percentage > 0,
            "amount": refund_amount,
            "percentage": percentage,
            "status": "processing" if refund_amount > 0 else "not_eligible",
            "expected_by": (now + timedelta(days=3)).isoformat() if refund_amount > 0 else None,
        }
