"""Notification and PushToken models for push notifications."""

from datetime import datetime
from uuid import UUID

from sqlalchemy import ARRAY, Boolean, DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.base import TimestampMixin, UUIDMixin


class Notification(Base, UUIDMixin, TimestampMixin):
    """
    Notification model for user notifications (push, SMS, email).
    """

    __tablename__ = "notifications"

    # User reference
    user_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True
    )

    # Notification content
    type: Mapped[str] = mapped_column(
        String(50), nullable=False
    )  # booking_confirmed, driver_assigned, etc.
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    data: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)

    # Delivery channels
    channels: Mapped[list[str]] = mapped_column(
        ARRAY(String(20)), default=["push"], nullable=False
    )

    # Status
    sent: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    read: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    read_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    user = relationship("User", back_populates="notifications", lazy="joined")

    def __repr__(self) -> str:
        return f"<Notification(id={self.id}, type={self.type}, sent={self.sent})>"

    def mark_as_read(self) -> None:
        """Mark notification as read."""
        if not self.read:
            self.read = True
            self.read_at = datetime.utcnow()


class PushToken(Base, UUIDMixin, TimestampMixin):
    """
    PushToken model for storing FCM tokens for push notifications.
    """

    __tablename__ = "push_tokens"

    # User reference
    user_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True
    )

    # Token details
    token: Mapped[str] = mapped_column(Text, nullable=False)
    platform: Mapped[str] = mapped_column(String(10), nullable=False)  # android, ios, web
    device_id: Mapped[str | None] = mapped_column(String(100), nullable=True)

    # Status
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, index=True)

    # Relationships
    user = relationship("User", back_populates="push_tokens", lazy="joined")

    def __repr__(self) -> str:
        return f"<PushToken(id={self.id}, platform={self.platform}, active={self.is_active})>"
