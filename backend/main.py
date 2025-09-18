import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from models import User, Event
from routers import users, events
from routers import upload


def create_app() -> FastAPI:
    Base.metadata.create_all(bind=engine)

    app = FastAPI(title="Event Management System API")

    cors_origins = os.getenv("CORS_ORIGINS", "*")
    allow_origins = [o.strip() for o in cors_origins.split(",") if o.strip()] if cors_origins else ["*"]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=allow_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(users.router)
    app.include_router(events.router)
    app.include_router(upload.router)

    return app


app = create_app()

