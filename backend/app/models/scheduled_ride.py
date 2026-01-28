"""ScheduledRide model for pre-defined group rides."""

from datetime import datetime
from decimal import Decimal
from uuid import UUID

from sqlalchemy import Boolean, DECIMAL, DateTime, Enum, ForeignKey, Integer, Text
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.base import SoftDeleteMixin, TimestampMixin, UUIDMixin, VehicleType


class ScheduledRide(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    """
    ScheduledRide model representing admin-created group rides.
    Users can book seats on these rides.
    """

    __tablename__ = "scheduled_rides"

    # Route reference
    route_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("routes.id"), nullable=False, index=True
    )

    # Agency (optional - admin can assign)
    agency_id: Mapped[UUID | None] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("agencies.id"), nullable=True, index=True
    )

    # Schedule
    departure_time: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, index=True
    )
    arrival_estimate: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    # Capacity
    seat_capacity: Mapped[int] = mapped_column(Integer, nullable=False)
    seats_booked: Mapped[int] = mapped_column(Integer, default=0)

    # Pricing
    price_per_seat: Mapped[Decimal] = mapped_column(DECIMAL(10, 2), nullable=False)

    # Vehicle
    vehicle_type: Mapped[VehicleType] = mapped_column(
        Enum(VehicleType, name="vehicle_type"), nullable=False
    )
    vehicle_id: Mapped[UUID | None] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("vehicles.id"), nullable=True
    )
    driver_id: Mapped[UUID | None] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("drivers.id"), nullable=True
    )

    # Status
    is_published: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Created by (admin)
    created_by: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )

    # Relationships
    route = relationship("Route", back_populates="scheduled_rides", lazy="joined")
    agency = relationship("Agency", lazy="joined")
    vehicle = relationship("Vehicle", back_populates="scheduled_rides", lazy="joined")
    driver = relationship("Driver", back_populates="scheduled_rides", lazy="joined")
    creator = relationship("User", foreign_keys=[created_by], lazy="joined")
    bookings = relationship("Booking", back_populates="scheduled_ride", lazy="dynamic")
    seat_locks = relationship("SeatLock", back_populates="scheduled_ride", lazy="dynamic")

    def __repr__(self) -> str:
        return f"<ScheduledRide(id={self.id}, departure={self.departure_time})>"

    @property
    def seats_available(self) -> int:
        """Number of available seats."""
        return max(0, self.seat_capacity - self.seats_booked)

    @property
    def is_full(self) -> bool:
        """Check if ride is fully booked."""
        return self.seats_available == 0

    @property
    def duration_minutes(self) -> int:
        """Calculate ride duration in minutes."""
        delta = self.arrival_estimate - self.departure_time
        return int(delta.total_seconds() / 60)
