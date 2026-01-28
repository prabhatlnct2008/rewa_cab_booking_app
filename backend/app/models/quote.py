"""Quote and LeadAcceptance models for individual ride quoting."""

from datetime import datetime
from decimal import Decimal
from uuid import UUID

from sqlalchemy import DECIMAL, DateTime, Enum, ForeignKey, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.base import QuoteStatus, TimestampMixin, UUIDMixin, VehicleType


class LeadAcceptance(Base, UUIDMixin):
    """
    LeadAcceptance model tracking which agencies have accepted a lead.
    An agency must accept a lead before sending a quote.
    """

    __tablename__ = "lead_acceptances"
    __table_args__ = (
        UniqueConstraint("ride_request_id", "agency_id", name="uq_lead_acceptance"),
    )

    # References
    ride_request_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("ride_requests.id"), nullable=False, index=True
    )
    agency_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("agencies.id"), nullable=False, index=True
    )

    # Timestamp
    accepted_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=datetime.utcnow
    )

    # Relationships
    ride_request = relationship("RideRequest", back_populates="lead_acceptances")
    agency = relationship("Agency", lazy="joined")

    def __repr__(self) -> str:
        return f"<LeadAcceptance(request={self.ride_request_id}, agency={self.agency_id})>"


class Quote(Base, UUIDMixin, TimestampMixin):
    """
    Quote model representing an agency's price quote for a ride request.
    """

    __tablename__ = "quotes"

    # References
    ride_request_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("ride_requests.id"), nullable=False, index=True
    )
    agency_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("agencies.id"), nullable=False, index=True
    )

    # Pricing
    total_price: Mapped[Decimal] = mapped_column(DECIMAL(10, 2), nullable=False)
    advance_amount: Mapped[Decimal] = mapped_column(DECIMAL(10, 2), nullable=False)

    # Details
    vehicle_type: Mapped[VehicleType] = mapped_column(
        Enum(VehicleType, name="vehicle_type"), nullable=False
    )
    estimated_pickup_time: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    message: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Status
    status: Mapped[QuoteStatus] = mapped_column(
        Enum(QuoteStatus, name="quote_status"),
        default=QuoteStatus.PENDING,
        nullable=False,
        index=True,
    )
    valid_until: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, index=True
    )
    selected_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    ride_request = relationship("RideRequest", back_populates="quotes", lazy="joined")
    agency = relationship("Agency", back_populates="quotes", lazy="joined")

    def __repr__(self) -> str:
        return f"<Quote(id={self.id}, price={self.total_price}, status={self.status})>"

    @property
    def is_expired(self) -> bool:
        """Check if the quote has expired."""
        return datetime.now(self.valid_until.tzinfo) > self.valid_until

    @property
    def is_valid(self) -> bool:
        """Check if the quote is still valid for selection."""
        return self.status == QuoteStatus.SENT and not self.is_expired

    @property
    def balance_amount(self) -> Decimal:
        """Calculate remaining balance after advance."""
        return self.total_price - self.advance_amount
