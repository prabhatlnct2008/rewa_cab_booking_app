"""Vehicle model for agency fleet management."""

from uuid import UUID

from sqlalchemy import Enum, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import JSONB, UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.base import SoftDeleteMixin, TimestampMixin, UUIDMixin, VehicleStatus, VehicleType


class Vehicle(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    """
    Vehicle model representing a cab/vehicle in an agency's fleet.
    """

    __tablename__ = "vehicles"

    # Agency reference
    agency_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("agencies.id"), nullable=False, index=True
    )

    # Registration
    registration_number: Mapped[str] = mapped_column(
        String(20), unique=True, nullable=False, index=True
    )

    # Vehicle details
    vehicle_type: Mapped[VehicleType] = mapped_column(
        Enum(VehicleType, name="vehicle_type"), nullable=False, index=True
    )
    make: Mapped[str | None] = mapped_column(String(50), nullable=True)  # Maruti, Toyota
    model: Mapped[str | None] = mapped_column(String(50), nullable=True)  # Swift, Innova
    year: Mapped[int | None] = mapped_column(Integer, nullable=True)
    color: Mapped[str | None] = mapped_column(String(30), nullable=True)

    # Capacity
    seat_capacity: Mapped[int] = mapped_column(Integer, nullable=False)

    # Status
    status: Mapped[VehicleStatus] = mapped_column(
        Enum(VehicleStatus, name="vehicle_status"),
        default=VehicleStatus.ACTIVE,
        nullable=False,
    )

    # Documents (RC, Insurance, Permit)
    documents: Mapped[dict] = mapped_column(JSONB, default=list, nullable=False)

    # Relationships
    agency = relationship("Agency", back_populates="vehicles", lazy="joined")
    scheduled_rides = relationship("ScheduledRide", back_populates="vehicle", lazy="dynamic")
    bookings = relationship("Booking", back_populates="vehicle", lazy="dynamic")

    def __repr__(self) -> str:
        return f"<Vehicle(id={self.id}, registration={self.registration_number})>"

    @property
    def display_name(self) -> str:
        """User-friendly vehicle name."""
        parts = [self.make, self.model]
        return " ".join(p for p in parts if p) or self.registration_number
