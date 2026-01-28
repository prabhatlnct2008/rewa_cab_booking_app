"""Instamojo payment webhook handler."""

import hashlib
import hmac
from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Header, Request, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.database import get_db
from app.models.base import GroupBookingStatus, PaymentStatus
from app.models.booking import Booking
from app.models.payment import Payment

router = APIRouter()
settings = get_settings()


class InstamojoWebhookPayload(BaseModel):
    """Instamojo webhook payload."""

    payment_id: str
    payment_request_id: str
    status: str
    amount: str
    buyer_name: str | None = None
    buyer_phone: str | None = None


def verify_signature(payload: bytes, signature: str) -> bool:
    """Verify Instamojo webhook signature."""
    if not settings.instamojo_webhook_secret:
        # Skip verification in development
        return settings.is_development

    expected = hmac.new(
        settings.instamojo_webhook_secret.encode(),
        payload,
        hashlib.sha256,
    ).hexdigest()

    return hmac.compare_digest(expected, signature)


@router.post("/instamojo", summary="Instamojo payment webhook")
async def handle_instamojo_webhook(
    request: Request,
    db: Annotated[AsyncSession, Depends(get_db)],
    x_instamojo_signature: str = Header(None),
) -> dict:
    """
    Handle Instamojo payment webhook.
    Updates payment and booking status based on payment result.
    """
    # Get raw body for signature verification
    body = await request.body()

    # Verify signature
    if x_instamojo_signature and not verify_signature(body, x_instamojo_signature):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid webhook signature",
        )

    # Parse payload
    try:
        payload = InstamojoWebhookPayload.model_validate_json(body)
    except Exception:
        # Try form data format
        form_data = await request.form()
        payload = InstamojoWebhookPayload(
            payment_id=form_data.get("payment_id", ""),
            payment_request_id=form_data.get("payment_request_id", ""),
            status=form_data.get("status", ""),
            amount=form_data.get("amount", "0"),
            buyer_name=form_data.get("buyer_name"),
            buyer_phone=form_data.get("buyer_phone"),
        )

    # Find payment by provider_payment_request_id
    result = await db.execute(
        select(Payment).where(
            Payment.provider_payment_request_id == payload.payment_request_id
        )
    )
    payment = result.scalar_one_or_none()

    if not payment:
        # Log but don't fail - might be duplicate or test
        return {"success": True, "message": "Payment not found, possibly duplicate"}

    # Update payment
    payment.provider_payment_id = payload.payment_id
    payment.webhook_received_at = datetime.utcnow()
    payment.webhook_payload = payload.model_dump()

    if payload.status.lower() == "credit":
        payment.status = PaymentStatus.COMPLETED
        payment.verified = True
        payment.verified_at = datetime.utcnow()

        # Update booking status
        booking_result = await db.execute(
            select(Booking).where(Booking.id == payment.booking_id)
        )
        booking = booking_result.scalar_one_or_none()

        if booking and booking.group_status == GroupBookingStatus.PENDING_PAYMENT:
            booking.group_status = GroupBookingStatus.CONFIRMED

            # Update scheduled ride seats
            if booking.scheduled_ride:
                booking.scheduled_ride.seats_booked += booking.passengers_count

        # TODO: Send confirmation notification
    else:
        payment.status = PaymentStatus.FAILED
        payment.failure_reason = f"Payment status: {payload.status}"

    return {"success": True}
