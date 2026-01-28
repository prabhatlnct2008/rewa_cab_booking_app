"""Seat lock service to prevent race conditions during booking."""

from datetime import datetime, timedelta
from uuid import UUID

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.scheduled_ride import ScheduledRide
from app.models.seat_lock import SeatLock


class SeatLockService:
    """
    Service for managing seat locks during the payment flow.
    Prevents multiple users from booking the same seats simultaneously.
    """

    def __init__(self, db: AsyncSession):
        self.db = db

    async def lock_seats(
        self,
        scheduled_ride_id: UUID,
        user_id: UUID,
        seats_count: int,
        lock_duration_minutes: int = 10,
    ) -> dict:
        """
        Attempt to lock seats for a scheduled ride.

        Args:
            scheduled_ride_id: The scheduled ride UUID
            user_id: The user requesting the lock
            seats_count: Number of seats to lock
            lock_duration_minutes: How long to hold the lock

        Returns:
            dict with success status, lock_id, expires_at, and message
        """
        # Get scheduled ride with lock
        result = await self.db.execute(
            select(ScheduledRide)
            .where(ScheduledRide.id == scheduled_ride_id)
            .with_for_update()
        )
        ride = result.scalar_one_or_none()

        if not ride:
            return {"success": False, "message": "Scheduled ride not found"}

        # Calculate available seats (capacity - booked - active locks)
        available = ride.seats_available

        # Get active locks count
        lock_result = await self.db.execute(
            select(func.coalesce(func.sum(SeatLock.seats_locked), 0))
            .where(
                SeatLock.scheduled_ride_id == scheduled_ride_id,
                SeatLock.released == False,
                SeatLock.expires_at > datetime.utcnow(),
            )
        )
        locked_seats = lock_result.scalar() or 0

        available_for_lock = available - locked_seats

        if available_for_lock < seats_count:
            return {
                "success": False,
                "message": f"Only {available_for_lock} seats available, but {seats_count} requested",
            }

        # Release any existing locks by this user for this ride
        await self.db.execute(
            SeatLock.__table__.update()
            .where(
                SeatLock.scheduled_ride_id == scheduled_ride_id,
                SeatLock.user_id == user_id,
                SeatLock.released == False,
            )
            .values(released=True, released_at=datetime.utcnow())
        )

        # Create new lock
        expires_at = datetime.utcnow() + timedelta(minutes=lock_duration_minutes)
        lock = SeatLock(
            scheduled_ride_id=scheduled_ride_id,
            user_id=user_id,
            seats_locked=seats_count,
            expires_at=expires_at,
        )
        self.db.add(lock)
        await self.db.flush()

        return {
            "success": True,
            "lock_id": lock.id,
            "expires_at": expires_at,
            "message": "Seats locked successfully",
        }

    async def release_lock(self, lock_id: UUID, user_id: UUID) -> bool:
        """
        Release a seat lock.

        Args:
            lock_id: The lock UUID
            user_id: The user who owns the lock

        Returns:
            True if lock was released
        """
        result = await self.db.execute(
            select(SeatLock).where(
                SeatLock.id == lock_id,
                SeatLock.user_id == user_id,
                SeatLock.released == False,
            )
        )
        lock = result.scalar_one_or_none()

        if not lock:
            return False

        lock.released = True
        lock.released_at = datetime.utcnow()

        return True

    async def convert_lock_to_booking(
        self, lock_id: UUID, booking_id: UUID
    ) -> bool:
        """
        Convert a seat lock to a confirmed booking.

        Args:
            lock_id: The lock UUID
            booking_id: The booking UUID

        Returns:
            True if conversion was successful
        """
        result = await self.db.execute(
            select(SeatLock).where(
                SeatLock.id == lock_id,
                SeatLock.released == False,
                SeatLock.expires_at > datetime.utcnow(),
            )
        )
        lock = result.scalar_one_or_none()

        if not lock:
            return False

        lock.booking_id = booking_id
        lock.released = True
        lock.released_at = datetime.utcnow()

        return True

    async def cleanup_expired_locks(self) -> int:
        """
        Release all expired locks.
        Should be called periodically via background job.

        Returns:
            Number of locks released
        """
        result = await self.db.execute(
            SeatLock.__table__.update()
            .where(
                SeatLock.released == False,
                SeatLock.expires_at < datetime.utcnow(),
                SeatLock.booking_id.is_(None),
            )
            .values(released=True, released_at=datetime.utcnow())
        )
        return result.rowcount
