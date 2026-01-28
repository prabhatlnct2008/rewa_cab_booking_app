"""SeatLock model for temporary seat reservations during payment."""

from datetime import datetime
from uuid import UUID

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.base import TimestampMixin, UUIDMixin


class SeatLock(Base, UUIDMixin, TimestampMixin):
    """
    SeatLock model for temporarily holding seats during payment flow.
    Prevents race conditions when multiple users try to book the same seats.
    """

    __tablename__ = "seat_locks"

    # References
    scheduled_ride_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("scheduled_rides.id"), nullable=False, index=True
    )
    user_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True
    )

    # Lock details
    seats_locked: Mapped[int] = mapped_column(Integer, nullable=False)
    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, index=True
    )

    # Release status
    released: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    released_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # Booking reference (set when booking is created)
    booking_id: Mapped[UUID | None] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("bookings.id"), nullable=True
    )

    # Relationships
    scheduled_ride = relationship("ScheduledRide", back_populates="seat_locks", lazy="joined")
    user = relationship("User", lazy="joined")
    booking = relationship("Booking", lazy="joined")

    def __repr__(self) -> str:
        return f"<SeatLock(id={self.id}, seats={self.seats_locked}, released={self.released})>"

    @property
    def is_expired(self) -> bool:
        """Check if the lock has expired."""
        if self.released:
            return True
        return datetime.now(self.expires_at.tzinfo) > self.expires_at

    @property
    def is_active(self) -> bool:
        """Check if the lock is still active."""
        return not self.released and not self.is_expired
