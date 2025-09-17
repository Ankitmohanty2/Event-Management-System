import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .models import User, Event
from .routers import users, events


def create_app() -> FastAPI:
    Base.metadata.create_all(bind=engine)

    app = FastAPI(title="Event Management System API")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[os.getenv("CORS_ORIGINS", "*")],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(users.router)
    app.include_router(events.router)

    return app


app = create_app()

