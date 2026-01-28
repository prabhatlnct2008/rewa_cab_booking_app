"""User model for authentication and profiles."""

from datetime import datetime
from uuid import UUID

from sqlalchemy import Boolean, DateTime, Enum, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.base import SoftDeleteMixin, TimestampMixin, UUIDMixin, UserRole


class User(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    """
    User model representing all users in the system.
    Supports OTP-based authentication.
    """

    __tablename__ = "users"

    # Authentication
    phone: Mapped[str] = mapped_column(String(15), unique=True, nullable=False, index=True)
    phone_verified: Mapped[bool] = mapped_column(Boolean, default=False)

    # Profile
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole, name="user_role"), default=UserRole.CUSTOMER, nullable=False
    )
    full_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    avatar_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    # Status
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    last_login_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    bookings = relationship("Booking", back_populates="user", lazy="dynamic")
    ride_requests = relationship("RideRequest", back_populates="user", lazy="dynamic")
    payments = relationship("Payment", back_populates="user", lazy="dynamic")
    notifications = relationship("Notification", back_populates="user", lazy="dynamic")
    push_tokens = relationship("PushToken", back_populates="user", lazy="dynamic")

    def __repr__(self) -> str:
        return f"<User(id={self.id}, phone={self.phone}, role={self.role})>"

    @property
    def is_admin(self) -> bool:
        return self.role == UserRole.ADMIN

    @property
    def is_agency(self) -> bool:
        return self.role == UserRole.AGENCY

    @property
    def is_driver(self) -> bool:
        return self.role == UserRole.DRIVER

    @property
    def is_customer(self) -> bool:
        return self.role == UserRole.CUSTOMER
