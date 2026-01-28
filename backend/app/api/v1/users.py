"""User profile API routes."""

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter()


# Schemas
class UserProfileResponse(BaseModel):
    """User profile response."""

    id: str
    phone: str
    full_name: str | None
    email: str | None
    role: str
    created_at: str


class UpdateProfileRequest(BaseModel):
    """Request to update user profile."""

    full_name: str | None = None
    email: EmailStr | None = None


class UpdateProfileResponse(BaseModel):
    """Response after updating profile."""

    id: str
    phone: str
    full_name: str | None
    email: str | None


# Routes
@router.get(
    "/me",
    response_model=UserProfileResponse,
    summary="Get current user profile",
)
async def get_current_user_profile(
    current_user: Annotated[User, Depends(get_current_user)],
) -> UserProfileResponse:
    """Get the current authenticated user's profile."""
    return UserProfileResponse(
        id=str(current_user.id),
        phone=current_user.phone,
        full_name=current_user.full_name,
        email=current_user.email,
        role=current_user.role.value,
        created_at=current_user.created_at.isoformat(),
    )


@router.patch(
    "/me",
    response_model=UpdateProfileResponse,
    summary="Update current user profile",
)
async def update_current_user_profile(
    request: UpdateProfileRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> UpdateProfileResponse:
    """Update the current authenticated user's profile."""
    if request.full_name is not None:
        current_user.full_name = request.full_name
    if request.email is not None:
        current_user.email = request.email

    await db.flush()

    return UpdateProfileResponse(
        id=str(current_user.id),
        phone=current_user.phone,
        full_name=current_user.full_name,
        email=current_user.email,
    )
