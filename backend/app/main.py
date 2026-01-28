"""
Rewa Cab Booking API - FastAPI Application Entry Point
"""

from contextlib import asynccontextmanager
from collections.abc import AsyncGenerator

import sentry_sdk
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import get_settings
from app.database import close_db, init_db

# Import API routers
from app.api.v1 import auth, users, routes, scheduled_rides, bookings, payments
from app.api.v1 import ride_requests, quotes, agencies, drivers, vehicles, admin
from app.api.webhooks import instamojo

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan handler for startup/shutdown events."""
    # Startup
    if settings.is_development:
        await init_db()
    yield
    # Shutdown
    await close_db()


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""

    # Initialize Sentry in production
    if settings.sentry_dsn and settings.is_production:
        sentry_sdk.init(
            dsn=settings.sentry_dsn,
            environment=settings.environment,
            traces_sample_rate=0.1,
        )

    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description="API for Rewa Cab Booking Platform - Group and Individual Ride Bookings",
        docs_url="/docs" if settings.is_development else None,
        redoc_url="/redoc" if settings.is_development else None,
        openapi_url="/openapi.json" if settings.is_development else None,
        lifespan=lifespan,
    )

    # CORS Middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include API routers
    api_prefix = settings.api_prefix

    # Public routes
    app.include_router(auth.router, prefix=f"{api_prefix}/auth", tags=["Authentication"])
    app.include_router(routes.router, prefix=f"{api_prefix}/routes", tags=["Routes"])
    app.include_router(
        scheduled_rides.router, prefix=f"{api_prefix}/scheduled-rides", tags=["Scheduled Rides"]
    )

    # Authenticated routes
    app.include_router(users.router, prefix=f"{api_prefix}/users", tags=["Users"])
    app.include_router(bookings.router, prefix=f"{api_prefix}/bookings", tags=["Bookings"])
    app.include_router(payments.router, prefix=f"{api_prefix}/payments", tags=["Payments"])
    app.include_router(
        ride_requests.router, prefix=f"{api_prefix}/ride-requests", tags=["Ride Requests"]
    )
    app.include_router(quotes.router, prefix=f"{api_prefix}/quotes", tags=["Quotes"])

    # Agency routes
    app.include_router(agencies.router, prefix=f"{api_prefix}/agency", tags=["Agency Portal"])
    app.include_router(drivers.router, prefix=f"{api_prefix}/agency/drivers", tags=["Drivers"])
    app.include_router(vehicles.router, prefix=f"{api_prefix}/agency/vehicles", tags=["Vehicles"])

    # Admin routes
    app.include_router(admin.router, prefix=f"{api_prefix}/admin", tags=["Admin"])

    # Webhooks (no auth, verified by signature)
    app.include_router(instamojo.router, prefix="/webhooks", tags=["Webhooks"])

    return app


app = create_app()


@app.get("/", include_in_schema=False)
async def root() -> dict[str, str]:
    """Root endpoint - health check."""
    return {"status": "healthy", "service": settings.app_name}


@app.get("/health", include_in_schema=False)
async def health_check() -> dict[str, str]:
    """Health check endpoint for load balancers."""
    return {"status": "ok", "version": settings.app_version}


@app.exception_handler(Exception)
async def global_exception_handler(request, exc: Exception) -> JSONResponse:
    """Global exception handler for unhandled errors."""
    if settings.is_development:
        return JSONResponse(
            status_code=500,
            content={"error": {"code": "INTERNAL_ERROR", "message": str(exc)}},
        )
    return JSONResponse(
        status_code=500,
        content={"error": {"code": "INTERNAL_ERROR", "message": "An unexpected error occurred"}},
    )
