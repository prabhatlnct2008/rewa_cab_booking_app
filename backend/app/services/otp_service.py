"""OTP service for phone verification."""

import random
import hashlib
from datetime import datetime, timedelta

import redis.asyncio as redis

from app.config import get_settings

settings = get_settings()


class OTPService:
    """
    Service for OTP generation, storage, and verification.
    Uses Redis for OTP storage with TTL.
    """

    def __init__(self):
        self.redis_url = str(settings.redis_url)
        self.expire_minutes = settings.otp_expire_minutes
        self.max_attempts = settings.otp_max_attempts
        self.rate_limit_minutes = settings.otp_rate_limit_minutes
        self.rate_limit_count = settings.otp_rate_limit_count

    async def _get_redis(self) -> redis.Redis:
        """Get Redis connection."""
        return redis.from_url(self.redis_url, decode_responses=True)

    def _generate_otp(self) -> str:
        """Generate a 6-digit OTP."""
        return str(random.randint(100000, 999999))

    def _hash_otp(self, otp: str) -> str:
        """Hash OTP for secure storage."""
        return hashlib.sha256(otp.encode()).hexdigest()

    async def _check_rate_limit(self, phone: str) -> bool:
        """
        Check if phone has exceeded rate limit.

        Returns:
            True if within rate limit, False if exceeded
        """
        r = await self._get_redis()
        key = f"otp_rate:{phone}"

        try:
            count = await r.get(key)
            if count and int(count) >= self.rate_limit_count:
                return False
            return True
        finally:
            await r.close()

    async def _increment_rate_limit(self, phone: str) -> None:
        """Increment rate limit counter for phone."""
        r = await self._get_redis()
        key = f"otp_rate:{phone}"

        try:
            pipe = r.pipeline()
            await pipe.incr(key)
            await pipe.expire(key, self.rate_limit_minutes * 60)
            await pipe.execute()
        finally:
            await r.close()

    async def send_otp(self, phone: str) -> bool:
        """
        Generate and send OTP to phone number.

        Args:
            phone: Phone number in format +91XXXXXXXXXX

        Returns:
            True if OTP sent successfully

        Raises:
            ValueError: If rate limit exceeded
        """
        # Check rate limit
        if not await self._check_rate_limit(phone):
            raise ValueError(
                f"Rate limit exceeded. Try again after {self.rate_limit_minutes} minutes."
            )

        # Generate OTP
        otp = self._generate_otp()
        otp_hash = self._hash_otp(otp)

        # Store in Redis
        r = await self._get_redis()
        key = f"otp:{phone}"

        try:
            # Store hashed OTP with expiry
            await r.setex(key, self.expire_minutes * 60, otp_hash)

            # Reset attempt counter
            await r.delete(f"otp_attempts:{phone}")

            # Increment rate limit
            await self._increment_rate_limit(phone)

            # Send OTP via SMS
            await self._send_sms(phone, otp)

            return True
        finally:
            await r.close()

    async def _send_sms(self, phone: str, otp: str) -> None:
        """
        Send OTP via SMS gateway.

        Args:
            phone: Phone number
            otp: OTP to send
        """
        if settings.sms_provider == "mock":
            # Development mode - log OTP
            print(f"[MOCK SMS] Sending OTP {otp} to {phone}")
            return

        # TODO: Implement actual SMS sending via MSG91/2Factor
        # For now, just log
        print(f"[SMS] Sending OTP to {phone}")

    async def verify_otp(self, phone: str, otp: str) -> bool:
        """
        Verify OTP for phone number.

        Args:
            phone: Phone number
            otp: OTP to verify

        Returns:
            True if OTP is valid
        """
        r = await self._get_redis()
        key = f"otp:{phone}"
        attempts_key = f"otp_attempts:{phone}"

        try:
            # Check attempts
            attempts = await r.get(attempts_key)
            if attempts and int(attempts) >= self.max_attempts:
                return False

            # Get stored OTP hash
            stored_hash = await r.get(key)
            if not stored_hash:
                return False

            # Verify OTP
            otp_hash = self._hash_otp(otp)
            if otp_hash == stored_hash:
                # OTP valid - delete it
                await r.delete(key)
                await r.delete(attempts_key)
                return True
            else:
                # Increment attempts
                await r.incr(attempts_key)
                await r.expire(attempts_key, self.expire_minutes * 60)
                return False
        finally:
            await r.close()
