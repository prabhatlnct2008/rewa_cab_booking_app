"""Booking model for all ride bookings (group and individual)."""

from datetime import datetime
from decimal import Decimal
from uuid import UUID

from sqlalchemy import Boolean, DECIMAL, DateTime, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.base import (
    BookingType,
    GroupBookingStatus,
    IndividualBookingStatus,
    SoftDeleteMixin,
    TimestampMixin,
    UUIDMixin,
)


class Booking(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    """
    Central booking model for both group and individual rides.
    Tracks the entire booking lifecycle from creation to completion.
    """

    __tablename__ = "bookings"

    # Booking identifier
    booking_number: Mapped[str] = mapped_column(
        String(20), unique=True, nullable=False, index=True
    )

    # User reference
    user_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True
    )

    # Booking type
    booking_type: Mapped[BookingType] = mapped_column(
        Enum(BookingType, name="booking_type"), nullable=False
    )

    # Group booking fields
    scheduled_ride_id: Mapped[UUID | None] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("scheduled_rides.id"), nullable=True, index=True
    )
    group_status: Mapped[GroupBookingStatus | None] = mapped_column(
        Enum(GroupBookingStatus, name="group_booking_status"), nullable=True, index=True
    )

    # Individual booking fields
    ride_request_id: Mapped[UUID | None] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("ride_requests.id"), nullable=True
    )
    individual_status: Mapped[IndividualBookingStatus | None] = mapped_column(
        Enum(IndividualBookingStatus, name="individual_booking_status"), nullable=True, index=True
    )

    # Passenger details
    passengers_count: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    passenger_details: Mapped[dict] = mapped_column(
        JSONB, default=list, nullable=False
    )  # [{name, phone, age}]
    luggage_notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Pricing
    total_amount: Mapped[Decimal] = mapped_column(DECIMAL(10, 2), nullable=False)
    advance_amount: Mapped[Decimal] = mapped_column(DECIMAL(10, 2), default=0)
    advance_paid: Mapped[bool] = mapped_column(Boolean, default=False)
    balance_amount: Mapped[Decimal] = mapped_column(DECIMAL(10, 2), default=0)

    # Assignment (for individual rides)
    agency_id: Mapped[UUID | None] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("agencies.id"), nullable=True, index=True
    )
    driver_id: Mapped[UUID | None] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("drivers.id"), nullable=True
    )
    vehicle_id: Mapped[UUID | None] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("vehicles.id"), nullable=True
    )

    # Timestamps
    pickup_time: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    actual_pickup_time: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    drop_time: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # Cancellation
    cancellation_reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    cancelled_by: Mapped[UUID | None] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("users.id"), nullable=True
    )
    cancelled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    user = relationship("User", back_populates="bookings", foreign_keys=[user_id], lazy="joined")
    scheduled_ride = relationship("ScheduledRide", back_populates="bookings", lazy="joined")
    ride_request = relationship("RideRequest", back_populates="booking", lazy="joined")
    agency = relationship("Agency", back_populates="bookings", lazy="joined")
    driver = relationship("Driver", back_populates="bookings", lazy="joined")
    vehicle = relationship("Vehicle", back_populates="bookings", lazy="joined")
    cancelled_by_user = relationship("User", foreign_keys=[cancelled_by], lazy="joined")
    payments = relationship("Payment", back_populates="booking", lazy="dynamic")

    def __repr__(self) -> str:
        return f"<Booking(id={self.id}, number={self.booking_number}, type={self.booking_type})>"

    @property
    def status(self) -> str:
        """Return the current status based on booking type."""
        if self.booking_type == BookingType.GROUP:
            return self.group_status.value if self.group_status else "unknown"
        return self.individual_status.value if self.individual_status else "unknown"

    @property
    def is_confirmed(self) -> bool:
        """Check if booking is confirmed."""
        if self.booking_type == BookingType.GROUP:
            return self.group_status == GroupBookingStatus.CONFIRMED
        return self.individual_status in [
            IndividualBookingStatus.CONFIRMED,
            IndividualBookingStatus.DRIVER_ASSIGNED,
        ]

    @property
    def is_cancelled(self) -> bool:
        """Check if booking is cancelled."""
        if self.booking_type == BookingType.GROUP:
            return self.group_status == GroupBookingStatus.CANCELLED
        return self.individual_status == IndividualBookingStatus.CANCELLED

    @property
    def is_completed(self) -> bool:
        """Check if booking is completed."""
        if self.booking_type == BookingType.GROUP:
            return self.group_status == GroupBookingStatus.COMPLETED
        return self.individual_status == IndividualBookingStatus.COMPLETED
