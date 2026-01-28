"""
Application configuration using Pydantic Settings.
All configuration is loaded from environment variables.
"""

from functools import lru_cache
from typing import Literal

from pydantic import Field, PostgresDsn, RedisDsn
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # Application
    app_name: str = "Rewa Cab Booking API"
    app_version: str = "1.0.0"
    environment: Literal["development", "staging", "production"] = "development"
    debug: bool = Field(default=True)
    api_prefix: str = "/api/v1"

    # Server
    host: str = "0.0.0.0"
    port: int = 8000

    # Database (Supabase PostgreSQL)
    database_url: PostgresDsn = Field(
        default="postgresql+asyncpg://postgres:postgres@localhost:5432/rewa_cab"
    )
    database_pool_size: int = 5
    database_max_overflow: int = 10

    # Redis (for OTP, caching, rate limiting)
    redis_url: RedisDsn = Field(default="redis://localhost:6379/0")

    # JWT Authentication
    jwt_secret_key: str = Field(default="your-super-secret-key-change-in-production")
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 15
    jwt_refresh_token_expire_days: int = 7

    # OTP Settings
    otp_expire_minutes: int = 5
    otp_max_attempts: int = 3
    otp_rate_limit_minutes: int = 5
    otp_rate_limit_count: int = 3

    # SMS Gateway (MSG91 / 2Factor)
    sms_provider: Literal["msg91", "twofactor", "mock"] = "mock"
    sms_api_key: str = ""
    sms_sender_id: str = "REWACB"

    # Instamojo Payment Gateway
    instamojo_api_key: str = ""
    instamojo_auth_token: str = ""
    instamojo_base_url: str = "https://test.instamojo.com/api/1.1"
    instamojo_webhook_secret: str = ""

    # Google Maps
    google_maps_api_key: str = ""

    # Firebase (FCM for push notifications)
    firebase_credentials_path: str = ""

    # Sentry (Error Tracking)
    sentry_dsn: str = ""

    # CORS
    cors_origins: list[str] = Field(
        default=["http://localhost:3000", "http://localhost:3001", "http://localhost:8081"]
    )

    # Rate Limiting
    rate_limit_per_minute: int = 100

    # Booking Settings
    seat_lock_minutes: int = 10
    booking_timeout_minutes: int = 15
    quote_validity_hours: int = 6

    @property
    def is_production(self) -> bool:
        return self.environment == "production"

    @property
    def is_development(self) -> bool:
        return self.environment == "development"


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
