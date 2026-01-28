"""Driver model for agency drivers."""

from datetime import date
from decimal import Decimal
from uuid import UUID

from sqlalchemy import DECIMAL, Date, Enum, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import JSONB, UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.base import DriverStatus, SoftDeleteMixin, TimestampMixin, UUIDMixin


class Driver(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    """
    Driver model representing drivers working for agencies.
    """

    __tablename__ = "drivers"

    # User reference (optional - driver may not have app login)
    user_id: Mapped[UUID | None] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True
    )

    # Agency reference
    agency_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("agencies.id"), nullable=False, index=True
    )

    # Personal details
    full_name: Mapped[str] = mapped_column(String(100), nullable=False)
    phone: Mapped[str] = mapped_column(String(15), nullable=False, index=True)

    # License
    license_number: Mapped[str] = mapped_column(String(20), nullable=False)
    license_expiry: Mapped[date | None] = mapped_column(Date, nullable=True)

    # Status
    status: Mapped[DriverStatus] = mapped_column(
        Enum(DriverStatus, name="driver_status"),
        default=DriverStatus.AVAILABLE,
        nullable=False,
        index=True,
    )

    # Rating and stats
    rating: Mapped[Decimal] = mapped_column(DECIMAL(3, 2), default=5.00)
    total_trips: Mapped[int] = mapped_column(Integer, default=0)

    # Documents (License, Aadhaar, Photo)
    documents: Mapped[dict] = mapped_column(JSONB, default=list, nullable=False)

    # Relationships
    user = relationship("User", lazy="joined")
    agency = relationship("Agency", back_populates="drivers", lazy="joined")
    scheduled_rides = relationship("ScheduledRide", back_populates="driver", lazy="dynamic")
    bookings = relationship("Booking", back_populates="driver", lazy="dynamic")

    def __repr__(self) -> str:
        return f"<Driver(id={self.id}, name={self.full_name})>"

    @property
    def is_available(self) -> bool:
        return self.status == DriverStatus.AVAILABLE

    @property
    def license_valid(self) -> bool:
        if not self.license_expiry:
            return True
        return self.license_expiry >= date.today()
