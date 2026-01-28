"""Base model mixins and enums for all SQLAlchemy models."""

import enum
from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import DateTime, func
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column


class UserRole(str, enum.Enum):
    """User roles in the system."""

    CUSTOMER = "customer"
    DRIVER = "driver"
    AGENCY = "agency"
    ADMIN = "admin"


class VehicleType(str, enum.Enum):
    """Types of vehicles available."""

    HATCHBACK = "hatchback"
    SEDAN = "sedan"
    SUV = "suv"
    TEMPO_TRAVELLER = "tempo_traveller"


class BookingType(str, enum.Enum):
    """Types of bookings."""

    GROUP = "group"
    INDIVIDUAL = "individual"


class GroupBookingStatus(str, enum.Enum):
    """Status for group ride bookings."""

    DRAFT = "draft"
    PENDING_PAYMENT = "pending_payment"
    CONFIRMED = "confirmed"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class IndividualBookingStatus(str, enum.Enum):
    """Status for individual ride bookings."""

    REQUEST_CREATED = "request_created"
    QUOTES_RECEIVED = "quotes_received"
    QUOTE_SELECTED = "quote_selected"
    PENDING_ADVANCE = "pending_advance"
    CONFIRMED = "confirmed"
    DRIVER_ASSIGNED = "driver_assigned"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class QuoteStatus(str, enum.Enum):
    """Status for agency quotes."""

    PENDING = "pending"
    SENT = "sent"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    EXPIRED = "expired"


class PaymentStatus(str, enum.Enum):
    """Payment transaction status."""

    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"
    PARTIALLY_REFUNDED = "partially_refunded"


class PaymentType(str, enum.Enum):
    """Type of payment."""

    FULL = "full"
    ADVANCE = "advance"
    REMAINING = "remaining"


class AgencyStatus(str, enum.Enum):
    """Agency verification status."""

    PENDING_APPROVAL = "pending_approval"
    ACTIVE = "active"
    SUSPENDED = "suspended"
    REJECTED = "rejected"


class DriverStatus(str, enum.Enum):
    """Driver availability status."""

    AVAILABLE = "available"
    ON_TRIP = "on_trip"
    OFFLINE = "offline"
    SUSPENDED = "suspended"


class VehicleStatus(str, enum.Enum):
    """Vehicle operational status."""

    ACTIVE = "active"
    MAINTENANCE = "maintenance"
    RETIRED = "retired"


class LeadStatus(str, enum.Enum):
    """Status of a ride request lead."""

    NEW = "new"
    ACCEPTED = "accepted"
    QUOTED = "quoted"
    EXPIRED = "expired"
    CONVERTED = "converted"


class TimestampMixin:
    """Mixin that adds created_at and updated_at columns."""

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )


class SoftDeleteMixin:
    """Mixin that adds soft delete capability."""

    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    @property
    def is_deleted(self) -> bool:
        return self.deleted_at is not None


class UUIDMixin:
    """Mixin that adds UUID primary key."""

    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), primary_key=True, default=uuid4, nullable=False
    )
