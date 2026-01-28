"""Drivers API routes for agency driver management."""

from datetime import date
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_agency_user
from app.models.agency import Agency
from app.models.driver import Driver
from app.models.user import User

router = APIRouter()


class DriverResponse(BaseModel):
    """Driver response."""

    id: str
    full_name: str
    phone: str
    license_number: str
    status: str
    rating: float


class DriverListResponse(BaseModel):
    """List of drivers."""

    drivers: list[DriverResponse]


class CreateDriverRequest(BaseModel):
    """Request to create a driver."""

    full_name: str
    phone: str
    license_number: str
    license_expiry: date | None = None


@router.get("", response_model=DriverListResponse, summary="List agency drivers")
async def list_drivers(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_agency_user)],
) -> DriverListResponse:
    """List all drivers for the agency."""
    # Get agency
    result = await db.execute(
        select(Agency).where(Agency.user_id == current_user.id)
    )
    agency = result.scalar_one_or_none()

    if not agency:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Agency not found"
        )

    # Get drivers
    drivers_result = await db.execute(
        select(Driver).where(
            Driver.agency_id == agency.id, Driver.deleted_at.is_(None)
        )
    )
    drivers = drivers_result.scalars().all()

    return DriverListResponse(
        drivers=[
            DriverResponse(
                id=str(d.id),
                full_name=d.full_name,
                phone=d.phone,
                license_number=d.license_number,
                status=d.status.value,
                rating=float(d.rating),
            )
            for d in drivers
        ]
    )


@router.post(
    "",
    response_model=DriverResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add driver",
)
async def create_driver(
    request: CreateDriverRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_agency_user)],
) -> DriverResponse:
    """Add a new driver to the agency."""
    # Get agency
    result = await db.execute(
        select(Agency).where(Agency.user_id == current_user.id)
    )
    agency = result.scalar_one_or_none()

    if not agency:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Agency not found"
        )

    # Create driver
    driver = Driver(
        agency_id=agency.id,
        full_name=request.full_name,
        phone=request.phone,
        license_number=request.license_number,
        license_expiry=request.license_expiry,
    )
    db.add(driver)
    await db.flush()

    return DriverResponse(
        id=str(driver.id),
        full_name=driver.full_name,
        phone=driver.phone,
        license_number=driver.license_number,
        status=driver.status.value,
        rating=float(driver.rating),
    )
