"""Quotes API routes."""

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.database import get_db
from app.dependencies import get_current_user
from app.models.base import QuoteStatus
from app.models.quote import Quote
from app.models.ride_request import RideRequest
from app.models.user import User

router = APIRouter()


class SelectQuoteRequest(BaseModel):
    """Request to select a quote."""

    quote_id: UUID
    passenger_details: list[dict]


class SelectQuoteResponse(BaseModel):
    """Response after selecting quote."""

    booking: dict


@router.post(
    "/select",
    response_model=SelectQuoteResponse,
    summary="Select quote and create booking",
)
async def select_quote(
    request: SelectQuoteRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> SelectQuoteResponse:
    """Select a quote and create an individual booking."""
    # Get quote
    result = await db.execute(
        select(Quote)
        .options(joinedload(Quote.ride_request))
        .where(Quote.id == request.quote_id)
    )
    quote = result.scalar_one_or_none()

    if not quote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Quote not found"
        )

    # Verify quote belongs to user's request
    if quote.ride_request.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized"
        )

    # Check quote is still valid
    if not quote.is_valid:
        raise HTTPException(
            status_code=status.HTTP_410_GONE, detail="Quote has expired"
        )

    # Mark quote as accepted
    quote.status = QuoteStatus.ACCEPTED
    quote.selected_at = datetime.utcnow()

    # TODO: Create booking via BookingService

    return SelectQuoteResponse(
        booking={
            "id": "placeholder",
            "booking_number": "RWC-2024-00001",
            "status": "pending_advance",
            "quote": {
                "total_price": float(quote.total_price),
                "advance_amount": float(quote.advance_amount),
            },
        }
    )


from datetime import datetime
