"""Agency model for cab service providers."""

from datetime import datetime
from decimal import Decimal
from uuid import UUID

from sqlalchemy import Boolean, DECIMAL, DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.base import AgencyStatus, SoftDeleteMixin, TimestampMixin, UUIDMixin


class Agency(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    """
    Agency model representing cab service providers.
    Agencies can have multiple drivers and vehicles.
    """

    __tablename__ = "agencies"

    # Owner reference
    user_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True
    )

    # Business details
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str] = mapped_column(String(15), nullable=False)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    address: Mapped[str | None] = mapped_column(Text, nullable=True)

    # KYC
    gst_number: Mapped[str | None] = mapped_column(String(20), nullable=True)
    pan_number: Mapped[str | None] = mapped_column(String(10), nullable=True)
    kyc_documents: Mapped[dict] = mapped_column(JSONB, default=list, nullable=False)

    # Status
    status: Mapped[AgencyStatus] = mapped_column(
        Enum(AgencyStatus, name="agency_status"),
        default=AgencyStatus.PENDING_APPROVAL,
        nullable=False,
        index=True,
    )
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    verified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # Commission
    commission_percent: Mapped[Decimal] = mapped_column(DECIMAL(5, 2), default=10.00)

    # Relationships
    user = relationship("User", lazy="joined")
    drivers = relationship("Driver", back_populates="agency", lazy="dynamic")
    vehicles = relationship("Vehicle", back_populates="agency", lazy="dynamic")
    quotes = relationship("Quote", back_populates="agency", lazy="dynamic")
    bookings = relationship("Booking", back_populates="agency", lazy="dynamic")

    def __repr__(self) -> str:
        return f"<Agency(id={self.id}, name={self.name}, status={self.status})>"

    @property
    def is_active(self) -> bool:
        return self.status == AgencyStatus.ACTIVE
