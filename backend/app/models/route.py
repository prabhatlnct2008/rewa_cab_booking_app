"""Route model for predefined routes between places."""

from decimal import Decimal
from uuid import UUID

from sqlalchemy import ARRAY, Boolean, DECIMAL, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.base import TimestampMixin, UUIDMixin, VehicleType


class Route(Base, UUIDMixin, TimestampMixin):
    """
    Route model representing a travel route between two places.
    Routes are predefined by admin with distance, duration, and pricing.
    """

    __tablename__ = "routes"

    # Route endpoints
    from_place_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("places.id"), nullable=False
    )
    to_place_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("places.id"), nullable=False
    )

    # SEO-friendly slug
    slug: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)

    # Route metrics
    distance_km: Mapped[Decimal] = mapped_column(DECIMAL(8, 2), nullable=False)
    duration_minutes: Mapped[int] = mapped_column(Integer, nullable=False)

    # Map data
    polyline: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Vehicle restrictions
    allowed_vehicle_types: Mapped[list[str]] = mapped_column(
        ARRAY(String(20)),
        default=["hatchback", "sedan", "suv"],
        nullable=False,
    )

    # Pricing
    base_price_per_seat: Mapped[Decimal | None] = mapped_column(DECIMAL(10, 2), nullable=True)

    # Status
    is_popular: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, index=True)

    # Relationships
    from_place = relationship("Place", foreign_keys=[from_place_id], lazy="joined")
    to_place = relationship("Place", foreign_keys=[to_place_id], lazy="joined")
    scheduled_rides = relationship("ScheduledRide", back_populates="route", lazy="dynamic")

    def __repr__(self) -> str:
        return f"<Route(id={self.id}, slug={self.slug})>"

    @property
    def duration_hours(self) -> float:
        """Return duration in hours."""
        return self.duration_minutes / 60
