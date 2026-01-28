"""Place model for storing location data from Google Places."""

from decimal import Decimal

from sqlalchemy import DECIMAL, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base
from app.models.base import TimestampMixin, UUIDMixin


class Place(Base, UUIDMixin, TimestampMixin):
    """
    Place model representing a location.
    Stores Google Place IDs and coordinates for route endpoints.
    """

    __tablename__ = "places"

    # Google Maps data
    google_place_id: Mapped[str] = mapped_column(
        String(255), unique=True, nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    formatted_address: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Location details
    city: Mapped[str | None] = mapped_column(String(100), nullable=True, index=True)
    state: Mapped[str | None] = mapped_column(String(100), nullable=True)

    # Coordinates
    latitude: Mapped[Decimal] = mapped_column(DECIMAL(10, 8), nullable=False)
    longitude: Mapped[Decimal] = mapped_column(DECIMAL(11, 8), nullable=False)

    def __repr__(self) -> str:
        return f"<Place(id={self.id}, name={self.name}, city={self.city})>"
