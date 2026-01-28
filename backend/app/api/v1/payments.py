"""Payments API routes."""

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.models.payment import Payment
from app.models.user import User

router = APIRouter()


class PaymentResponse(BaseModel):
    """Payment response."""

    id: str
    booking_id: str
    amount: float
    status: str
    payment_type: str
    created_at: str


class PaymentListResponse(BaseModel):
    """List of payments."""

    payments: list[PaymentResponse]


@router.get("", response_model=PaymentListResponse, summary="List my payments")
async def list_my_payments(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> PaymentListResponse:
    """List all payments for current user."""
    result = await db.execute(
        select(Payment)
        .where(Payment.user_id == current_user.id)
        .order_by(Payment.created_at.desc())
    )
    payments = result.scalars().all()

    return PaymentListResponse(
        payments=[
            PaymentResponse(
                id=str(p.id),
                booking_id=str(p.booking_id),
                amount=float(p.amount),
                status=p.status.value,
                payment_type=p.payment_type.value,
                created_at=p.created_at.isoformat(),
            )
            for p in payments
        ]
    )
