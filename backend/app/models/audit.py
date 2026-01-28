"""AuditLog model for tracking all entity changes."""

from datetime import datetime
from uuid import UUID

from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import INET, JSONB, UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.base import UUIDMixin


class AuditLog(Base, UUIDMixin):
    """
    AuditLog model for immutable audit trail of all entity changes.
    Critical for compliance and debugging.
    """

    __tablename__ = "audit_logs"

    # Entity reference
    entity_type: Mapped[str] = mapped_column(
        String(50), nullable=False, index=True
    )  # booking, payment, quote
    entity_id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), nullable=False, index=True)

    # Action
    action: Mapped[str] = mapped_column(
        String(50), nullable=False
    )  # created, updated, status_changed, cancelled

    # Change data
    old_value: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    new_value: Mapped[dict | None] = mapped_column(JSONB, nullable=True)

    # Actor
    actor_id: Mapped[UUID | None] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True
    )
    actor_type: Mapped[str] = mapped_column(
        String(20), default="user"
    )  # user, system, webhook

    # Request metadata
    ip_address: Mapped[str | None] = mapped_column(INET, nullable=True)
    user_agent: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Timestamp
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False, index=True
    )

    # Relationships
    actor = relationship("User", lazy="joined")

    def __repr__(self) -> str:
        return f"<AuditLog(entity={self.entity_type}:{self.entity_id}, action={self.action})>"
