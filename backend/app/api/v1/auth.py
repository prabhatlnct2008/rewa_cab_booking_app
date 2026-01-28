"""Authentication API routes - OTP-based login."""

from datetime import datetime, timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.database import get_db
from app.models.user import User
from app.services.auth_service import AuthService
from app.services.otp_service import OTPService

router = APIRouter()
settings = get_settings()


# Request/Response Schemas
class SendOTPRequest(BaseModel):
    """Request schema for sending OTP."""

    phone: str = Field(..., pattern=r"^\+91[6-9]\d{9}$", examples=["+919876543210"])


class SendOTPResponse(BaseModel):
    """Response schema after sending OTP."""

    success: bool
    message: str
    expires_in_seconds: int


class VerifyOTPRequest(BaseModel):
    """Request schema for verifying OTP."""

    phone: str = Field(..., pattern=r"^\+91[6-9]\d{9}$", examples=["+919876543210"])
    otp: str = Field(..., min_length=6, max_length=6, examples=["123456"])


class UserResponse(BaseModel):
    """User data in response."""

    id: str
    phone: str
    role: str
    full_name: str | None
    is_new_user: bool


class TokenResponse(BaseModel):
    """Token data in response."""

    access_token: str
    refresh_token: str
    expires_in: int


class VerifyOTPResponse(BaseModel):
    """Response schema after OTP verification."""

    success: bool
    user: UserResponse
    tokens: TokenResponse


class RefreshTokenRequest(BaseModel):
    """Request schema for token refresh."""

    refresh_token: str


class RefreshTokenResponse(BaseModel):
    """Response schema for token refresh."""

    access_token: str
    expires_in: int


class LogoutResponse(BaseModel):
    """Response schema for logout."""

    success: bool


# Dependency injection
async def get_otp_service() -> OTPService:
    """Get OTP service instance."""
    return OTPService()


async def get_auth_service() -> AuthService:
    """Get Auth service instance."""
    return AuthService()


# Routes
@router.post(
    "/otp/send",
    response_model=SendOTPResponse,
    summary="Send OTP to phone number",
    description="Sends a 6-digit OTP to the provided phone number. Rate limited to 3 attempts per 5 minutes.",
)
async def send_otp(
    request: SendOTPRequest,
    otp_service: Annotated[OTPService, Depends(get_otp_service)],
) -> SendOTPResponse:
    """Send OTP to phone number for authentication."""
    try:
        await otp_service.send_otp(request.phone)
        return SendOTPResponse(
            success=True,
            message="OTP sent successfully",
            expires_in_seconds=settings.otp_expire_minutes * 60,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send OTP. Please try again.",
        )


@router.post(
    "/otp/verify",
    response_model=VerifyOTPResponse,
    summary="Verify OTP and authenticate",
    description="Verifies the OTP and returns JWT tokens. Creates a new user if phone is not registered.",
)
async def verify_otp(
    request: VerifyOTPRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
    otp_service: Annotated[OTPService, Depends(get_otp_service)],
    auth_service: Annotated[AuthService, Depends(get_auth_service)],
) -> VerifyOTPResponse:
    """Verify OTP and return authentication tokens."""
    # Verify OTP
    is_valid = await otp_service.verify_otp(request.phone, request.otp)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"code": "INVALID_OTP", "message": "Invalid or expired OTP"},
        )

    # Get or create user
    result = await db.execute(select(User).where(User.phone == request.phone))
    user = result.scalar_one_or_none()
    is_new_user = False

    if not user:
        # Create new user
        user = User(phone=request.phone, phone_verified=True)
        db.add(user)
        await db.flush()
        is_new_user = True
    else:
        # Update existing user
        user.phone_verified = True
        user.last_login_at = datetime.utcnow()

    # Generate tokens
    access_token = auth_service.create_access_token(user_id=str(user.id), role=user.role.value)
    refresh_token = auth_service.create_refresh_token(user_id=str(user.id))

    return VerifyOTPResponse(
        success=True,
        user=UserResponse(
            id=str(user.id),
            phone=user.phone,
            role=user.role.value,
            full_name=user.full_name,
            is_new_user=is_new_user,
        ),
        tokens=TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=settings.jwt_access_token_expire_minutes * 60,
        ),
    )


@router.post(
    "/refresh",
    response_model=RefreshTokenResponse,
    summary="Refresh access token",
    description="Exchange a valid refresh token for a new access token.",
)
async def refresh_token(
    request: RefreshTokenRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
    auth_service: Annotated[AuthService, Depends(get_auth_service)],
) -> RefreshTokenResponse:
    """Refresh access token using refresh token."""
    try:
        payload = auth_service.verify_token(request.refresh_token)
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid refresh token"
            )

        user_id = payload.get("sub")
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()

        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found or inactive"
            )

        access_token = auth_service.create_access_token(
            user_id=str(user.id), role=user.role.value
        )

        return RefreshTokenResponse(
            access_token=access_token,
            expires_in=settings.jwt_access_token_expire_minutes * 60,
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired refresh token"
        )


@router.post(
    "/logout",
    response_model=LogoutResponse,
    summary="Logout user",
    description="Invalidates the current session. Client should discard tokens.",
)
async def logout() -> LogoutResponse:
    """Logout user (client-side token removal)."""
    # In a stateless JWT system, logout is handled client-side
    # For a more secure implementation, we could add token to a blacklist
    return LogoutResponse(success=True)
