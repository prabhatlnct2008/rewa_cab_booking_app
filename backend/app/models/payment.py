"""Payment model for Instamojo transactions."""

from datetime import datetime
from decimal import Decimal
from uuid import UUID

from sqlalchemy import Boolean, DECIMAL, DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.base import PaymentStatus, PaymentType, TimestampMixin, UUIDMixin


class Payment(Base, UUIDMixin, TimestampMixin):
    """
    Payment model tracking all payment transactions.
    Integrates with Instamojo payment gateway.
    """

    __tablename__ = "payments"

    # References
    booking_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("bookings.id"), nullable=False, index=True
    )
    user_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True
    )

    # Payment details
    payment_type: Mapped[PaymentType] = mapped_column(
        Enum(PaymentType, name="payment_type"), nullable=False
    )
    amount: Mapped[Decimal] = mapped_column(DECIMAL(10, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="INR")

    # Status
    status: Mapped[PaymentStatus] = mapped_column(
        Enum(PaymentStatus, name="payment_status"),
        default=PaymentStatus.PENDING,
        nullable=False,
        index=True,
    )

    # Provider details (Instamojo)
    provider: Mapped[str] = mapped_column(String(20), default="instamojo")
    provider_payment_request_id: Mapped[str | None] = mapped_column(
        String(100), nullable=True, index=True
    )
    provider_payment_id: Mapped[str | None] = mapped_column(
        String(100), nullable=True, index=True
    )
    provider_order_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    payment_url: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Webhook verification
    webhook_received_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    webhook_payload: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    verified: Mapped[bool] = mapped_column(Boolean, default=False)
    verified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # Refund tracking
    refund_amount: Mapped[Decimal] = mapped_column(DECIMAL(10, 2), default=0)
    refund_reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    refunded_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    refund_id: Mapped[str | None] = mapped_column(String(100), nullable=True)

    # Metadata and errors
    metadata: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    failure_reason: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relationships
    booking = relationship("Booking", back_populates="payments", lazy="joined")
    user = relationship("User", back_populates="payments", lazy="joined")

    def __repr__(self) -> str:
        return f"<Payment(id={self.id}, amount={self.amount}, status={self.status})>"

    @property
    def is_successful(self) -> bool:
        """Check if payment was successful."""
        return self.status == PaymentStatus.COMPLETED

    @property
    def is_refundable(self) -> bool:
        """Check if payment can be refunded."""
        return self.is_successful and self.refund_amount < self.amount

    @property
    def remaining_refundable(self) -> Decimal:
        """Calculate remaining refundable amount."""
        return self.amount - self.refund_amount
