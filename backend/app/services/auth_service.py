"""Authentication service for JWT token management."""

from datetime import datetime, timedelta
from typing import Any

from jose import JWTError, jwt

from app.config import get_settings

settings = get_settings()


class AuthService:
    """Service for JWT token creation and verification."""

    def __init__(self):
        self.secret_key = settings.jwt_secret_key
        self.algorithm = settings.jwt_algorithm
        self.access_token_expire_minutes = settings.jwt_access_token_expire_minutes
        self.refresh_token_expire_days = settings.jwt_refresh_token_expire_days

    def create_access_token(self, user_id: str, role: str) -> str:
        """
        Create a new access token.

        Args:
            user_id: The user's UUID as string
            role: The user's role

        Returns:
            JWT access token string
        """
        expire = datetime.utcnow() + timedelta(minutes=self.access_token_expire_minutes)
        payload = {
            "sub": user_id,
            "role": role,
            "type": "access",
            "exp": expire,
            "iat": datetime.utcnow(),
        }
        return jwt.encode(payload, self.secret_key, algorithm=self.algorithm)

    def create_refresh_token(self, user_id: str) -> str:
        """
        Create a new refresh token.

        Args:
            user_id: The user's UUID as string

        Returns:
            JWT refresh token string
        """
        expire = datetime.utcnow() + timedelta(days=self.refresh_token_expire_days)
        payload = {
            "sub": user_id,
            "type": "refresh",
            "exp": expire,
            "iat": datetime.utcnow(),
        }
        return jwt.encode(payload, self.secret_key, algorithm=self.algorithm)

    def verify_token(self, token: str) -> dict[str, Any]:
        """
        Verify and decode a JWT token.

        Args:
            token: JWT token string

        Returns:
            Decoded token payload

        Raises:
            JWTError: If token is invalid or expired
        """
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return payload
        except JWTError:
            raise

    def get_user_id_from_token(self, token: str) -> str | None:
        """
        Extract user ID from token without full verification.
        Useful for logging/debugging.

        Args:
            token: JWT token string

        Returns:
            User ID string or None if extraction fails
        """
        try:
            payload = jwt.decode(
                token, self.secret_key, algorithms=[self.algorithm], options={"verify_exp": False}
            )
            return payload.get("sub")
        except JWTError:
            return None
