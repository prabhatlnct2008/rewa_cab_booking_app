"""Vehicles API routes for agency vehicle management."""

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_agency_user
from app.models.agency import Agency
from app.models.base import VehicleType
from app.models.vehicle import Vehicle
from app.models.user import User

router = APIRouter()


class VehicleResponse(BaseModel):
    """Vehicle response."""

    id: str
    registration_number: str
    vehicle_type: str
    make: str | None
    model: str | None
    seat_capacity: int
    status: str


class VehicleListResponse(BaseModel):
    """List of vehicles."""

    vehicles: list[VehicleResponse]


class CreateVehicleRequest(BaseModel):
    """Request to create a vehicle."""

    registration_number: str
    vehicle_type: str
    make: str | None = None
    model: str | None = None
    year: int | None = None
    seat_capacity: int
    color: str | None = None


@router.get("", response_model=VehicleListResponse, summary="List agency vehicles")
async def list_vehicles(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_agency_user)],
) -> VehicleListResponse:
    """List all vehicles for the agency."""
    # Get agency
    result = await db.execute(
        select(Agency).where(Agency.user_id == current_user.id)
    )
    agency = result.scalar_one_or_none()

    if not agency:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Agency not found"
        )

    # Get vehicles
    vehicles_result = await db.execute(
        select(Vehicle).where(
            Vehicle.agency_id == agency.id, Vehicle.deleted_at.is_(None)
        )
    )
    vehicles = vehicles_result.scalars().all()

    return VehicleListResponse(
        vehicles=[
            VehicleResponse(
                id=str(v.id),
                registration_number=v.registration_number,
                vehicle_type=v.vehicle_type.value,
                make=v.make,
                model=v.model,
                seat_capacity=v.seat_capacity,
                status=v.status.value,
            )
            for v in vehicles
        ]
    )


@router.post(
    "",
    response_model=VehicleResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add vehicle",
)
async def create_vehicle(
    request: CreateVehicleRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_agency_user)],
) -> VehicleResponse:
    """Add a new vehicle to the agency."""
    # Get agency
    result = await db.execute(
        select(Agency).where(Agency.user_id == current_user.id)
    )
    agency = result.scalar_one_or_none()

    if not agency:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Agency not found"
        )

    # Create vehicle
    vehicle = Vehicle(
        agency_id=agency.id,
        registration_number=request.registration_number,
        vehicle_type=VehicleType(request.vehicle_type),
        make=request.make,
        model=request.model,
        year=request.year,
        seat_capacity=request.seat_capacity,
        color=request.color,
    )
    db.add(vehicle)
    await db.flush()

    return VehicleResponse(
        id=str(vehicle.id),
        registration_number=vehicle.registration_number,
        vehicle_type=vehicle.vehicle_type.value,
        make=vehicle.make,
        model=vehicle.model,
        seat_capacity=vehicle.seat_capacity,
        status=vehicle.status.value,
    )
