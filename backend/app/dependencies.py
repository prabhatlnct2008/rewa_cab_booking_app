"""FastAPI dependencies for authentication and authorization."""

from typing import Annotated
from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.database import get_db
from app.models.base import UserRole
from app.models.user import User
from app.services.auth_service import AuthService

settings = get_settings()
security = HTTPBearer()


async def get_auth_service() -> AuthService:
    """Get auth service instance."""
    return AuthService()


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)],
    db: Annotated[AsyncSession, Depends(get_db)],
    auth_service: Annotated[AuthService, Depends(get_auth_service)],
) -> User:
    """
    Dependency to get the current authenticated user.
    Validates JWT token and returns the user.
    """
    try:
        payload = auth_service.verify_token(credentials.credentials)
        user_id = payload.get("sub")

        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
            )

        result = await db.execute(select(User).where(User.id == UUID(user_id)))
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is disabled",
            )

        return user

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )


async def get_current_admin_user(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    """Dependency to ensure current user is an admin."""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user


async def get_current_agency_user(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    """Dependency to ensure current user is an agency owner."""
    if current_user.role != UserRole.AGENCY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Agency access required",
        )
    return current_user


async def get_current_driver_user(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    """Dependency to ensure current user is a driver."""
    if current_user.role != UserRole.DRIVER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Driver access required",
        )
    return current_user


def require_roles(*roles: UserRole):
    """
    Factory function to create a dependency that requires specific roles.

    Usage:
        @router.get("/", dependencies=[Depends(require_roles(UserRole.ADMIN, UserRole.AGENCY))])
    """

    async def role_checker(
        current_user: Annotated[User, Depends(get_current_user)],
    ) -> User:
        if current_user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access requires one of: {[r.value for r in roles]}",
            )
        return current_user

    return role_checker
