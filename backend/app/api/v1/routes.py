"""Routes API endpoints for browsing travel routes."""

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.database import get_db
from app.models.place import Place
from app.models.route import Route

router = APIRouter()


# Schemas
class PlaceResponse(BaseModel):
    """Place data in response."""

    id: str
    name: str
    city: str | None
    latitude: float
    longitude: float


class RouteResponse(BaseModel):
    """Route data in response."""

    id: str
    slug: str
    from_place: PlaceResponse
    to_place: PlaceResponse
    distance_km: float
    duration_minutes: int
    base_price_per_seat: float | None
    is_popular: bool


class RouteDetailResponse(RouteResponse):
    """Detailed route response with SEO data."""

    polyline: str | None
    seo: dict


class RouteListResponse(BaseModel):
    """List of routes response."""

    routes: list[RouteResponse]


class PlaceAutocompleteResponse(BaseModel):
    """Place autocomplete response."""

    predictions: list[dict]


def place_to_response(place: Place) -> PlaceResponse:
    """Convert Place model to response."""
    return PlaceResponse(
        id=str(place.id),
        name=place.name,
        city=place.city,
        latitude=float(place.latitude),
        longitude=float(place.longitude),
    )


def route_to_response(route: Route) -> RouteResponse:
    """Convert Route model to response."""
    return RouteResponse(
        id=str(route.id),
        slug=route.slug,
        from_place=place_to_response(route.from_place),
        to_place=place_to_response(route.to_place),
        distance_km=float(route.distance_km),
        duration_minutes=route.duration_minutes,
        base_price_per_seat=float(route.base_price_per_seat) if route.base_price_per_seat else None,
        is_popular=route.is_popular,
    )


# Routes
@router.get(
    "",
    response_model=RouteListResponse,
    summary="List routes",
    description="Get list of available routes. Can filter by popular routes.",
)
async def list_routes(
    db: Annotated[AsyncSession, Depends(get_db)],
    popular: bool = Query(False, description="Filter to show only popular routes"),
) -> RouteListResponse:
    """List all active routes."""
    query = (
        select(Route)
        .options(joinedload(Route.from_place), joinedload(Route.to_place))
        .where(Route.is_active == True)
    )

    if popular:
        query = query.where(Route.is_popular == True)

    query = query.order_by(Route.is_popular.desc(), Route.slug)

    result = await db.execute(query)
    routes = result.scalars().unique().all()

    return RouteListResponse(routes=[route_to_response(r) for r in routes])


@router.get(
    "/{slug}",
    response_model=RouteDetailResponse,
    summary="Get route by slug",
    description="Get detailed route information by SEO-friendly slug.",
)
async def get_route_by_slug(
    slug: str,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> RouteDetailResponse:
    """Get route details by slug."""
    result = await db.execute(
        select(Route)
        .options(joinedload(Route.from_place), joinedload(Route.to_place))
        .where(Route.slug == slug, Route.is_active == True)
    )
    route = result.scalar_one_or_none()

    if not route:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Route not found")

    base_response = route_to_response(route)

    return RouteDetailResponse(
        **base_response.model_dump(),
        polyline=route.polyline,
        seo={
            "title": f"{route.from_place.name} to {route.to_place.name} Cab Booking | RewaCab",
            "description": f"Book affordable cab from {route.from_place.name} to {route.to_place.name}. "
            f"{route.distance_km} km, {route.duration_minutes // 60} hours. "
            f"Starting at ₹{route.base_price_per_seat}/seat.",
            "keywords": [
                f"{route.from_place.name.lower()} to {route.to_place.name.lower()} cab",
                f"{route.from_place.name.lower()} to {route.to_place.name.lower()} taxi",
            ],
        },
    )


@router.get(
    "/places/autocomplete",
    response_model=PlaceAutocompleteResponse,
    summary="Search places",
    description="Autocomplete search for places.",
)
async def autocomplete_places(
    db: Annotated[AsyncSession, Depends(get_db)],
    query: str = Query(..., min_length=2, description="Search query"),
) -> PlaceAutocompleteResponse:
    """Search places for autocomplete."""
    result = await db.execute(
        select(Place)
        .where(Place.name.ilike(f"%{query}%"))
        .order_by(Place.name)
        .limit(10)
    )
    places = result.scalars().all()

    return PlaceAutocompleteResponse(
        predictions=[
            {
                "place_id": place.google_place_id,
                "name": place.name,
                "formatted_address": place.formatted_address,
            }
            for place in places
        ]
    )
