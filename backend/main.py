import os
import time
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from database import Base, engine
from models import User, Event
from routers import users, events, upload

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting Event Management System API")
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created successfully")
    yield
    logger.info("Shutting down Event Management System API")

def create_app() -> FastAPI:
    app = FastAPI(
        title="Event Management System API",
        description="A professional event management system with user authentication, role-based access control, and comprehensive event management features.",
        version="1.0.0",
        contact={
            "name": "Event Management System",
            "email": "support@eventmanagement.com",
        },
        license_info={
            "name": "MIT License",
            "url": "https://opensource.org/licenses/MIT",
        },
        lifespan=lifespan,
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json"
    )

    cors_origins = os.getenv("CORS_ORIGINS", "*")
    allow_origins = [o.strip() for o in cors_origins.split(",") if o.strip()] if cors_origins else ["*"]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=allow_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )

    trusted_hosts = os.getenv("TRUSTED_HOSTS", "*").split(",")
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=trusted_hosts
    )

    @app.middleware("http")
    async def log_requests(request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        
        logger.info(
            f"{request.method} {request.url.path} - "
            f"Status: {response.status_code} - "
            f"Time: {process_time:.4f}s"
        )
        return response

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        logger.warning(f"Validation error on {request.url.path}: {exc.errors()}")
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "detail": "Validation error",
                "errors": exc.errors(),
                "message": "Please check your input data and try again"
            }
        )

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException):
        logger.warning(f"HTTP error on {request.url.path}: {exc.detail}")
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "detail": exc.detail,
                "status_code": exc.status_code
            }
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        logger.error(f"Unexpected error on {request.url.path}: {str(exc)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "detail": "Internal server error",
                "message": "An unexpected error occurred. Please try again later."
            }
        )

    app.include_router(users.router, prefix="/api/v1")
    app.include_router(events.router, prefix="/api/v1")
    app.include_router(upload.router, prefix="/api/v1")

    @app.get("/health", tags=["health"])
    async def health_check():
        return {
            "status": "healthy",
            "service": "Event Management System API",
            "version": "1.0.0"
        }

    @app.get("/", tags=["root"])
    async def root():
        return {
            "message": "Welcome to Event Management System API",
            "version": "1.0.0",
            "docs": "/docs",
            "health": "/health"
        }

    return app

app = create_app()

