"""RideRequest model for individual ride requests (leads for agencies)."""

from datetime import datetime
from uuid import UUID

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, Text
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.base import LeadStatus, TimestampMixin, UUIDMixin, VehicleType


class RideRequest(Base, UUIDMixin, TimestampMixin):
    """
    RideRequest model representing customer requests for individual rides.
    These become leads for agencies to accept and quote on.
    """

    __tablename__ = "ride_requests"

    # User reference
    user_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True
    )

    # Locations
    pickup_place_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("places.id"), nullable=False
    )
    drop_place_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("places.id"), nullable=False
    )
    pickup_address: Mapped[str | None] = mapped_column(Text, nullable=True)
    drop_address: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Request details
    requested_datetime: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, index=True
    )
    passengers_count: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    vehicle_preference: Mapped[VehicleType | None] = mapped_column(
        Enum(VehicleType, name="vehicle_type"), nullable=True
    )
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Status
    status: Mapped[LeadStatus] = mapped_column(
        Enum(LeadStatus, name="lead_status"),
        default=LeadStatus.NEW,
        nullable=False,
        index=True,
    )
    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, index=True
    )

    # Relationships
    user = relationship("User", back_populates="ride_requests", lazy="joined")
    pickup_place = relationship("Place", foreign_keys=[pickup_place_id], lazy="joined")
    drop_place = relationship("Place", foreign_keys=[drop_place_id], lazy="joined")
    lead_acceptances = relationship("LeadAcceptance", back_populates="ride_request", lazy="dynamic")
    quotes = relationship("Quote", back_populates="ride_request", lazy="dynamic")
    booking = relationship("Booking", back_populates="ride_request", uselist=False)

    def __repr__(self) -> str:
        return f"<RideRequest(id={self.id}, status={self.status})>"

    @property
    def is_expired(self) -> bool:
        """Check if the request has expired."""
        return datetime.now(self.expires_at.tzinfo) > self.expires_at

    @property
    def is_active(self) -> bool:
        """Check if the request is still active for quoting."""
        return self.status in [LeadStatus.NEW, LeadStatus.ACCEPTED, LeadStatus.QUOTED]
