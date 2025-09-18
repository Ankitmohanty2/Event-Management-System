from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Body, Request, Query
from datetime import date as date_type, time as time_type
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
import schemas, models
from deps import get_current_user, require_admin


router = APIRouter(prefix="/events", tags=["events"])


@router.get("/", response_model=schemas.EventListResponse)
def list_events(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Number of events per page"),
    db: Session = Depends(get_db)
):
    """List events with pagination (public access)"""
    # Calculate offset
    offset = (page - 1) * page_size
    
    # Get total count
    total_count = db.query(func.count(models.Event.id)).scalar()
    
    # Get paginated events
    events = db.query(models.Event)\
        .order_by(models.Event.date, models.Event.time)\
        .offset(offset)\
        .limit(page_size)\
        .all()
    
    # Calculate pagination info
    total_pages = (total_count + page_size - 1) // page_size
    has_next = page < total_pages
    has_prev = page > 1
    
    return {
        "events": events,
        "pagination": {
            "page": page,
            "page_size": page_size,
            "total_count": total_count,
            "total_pages": total_pages,
            "has_next": has_next,
            "has_prev": has_prev
        }
    }


@router.get("/{event_id}", response_model=schemas.EventOut)
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.get(models.Event, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


@router.post("/", response_model=schemas.EventOut, status_code=status.HTTP_201_CREATED)
def create_event(event: schemas.EventCreate, db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    # Pydantic v1
    event_obj = models.Event(**event.dict())
    db.add(event_obj)
    db.commit()
    db.refresh(event_obj)
    return event_obj


@router.put("/{event_id}", response_model=schemas.EventOut)
async def update_event(event_id: int, request: Request, db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    event = db.get(models.Event, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Read raw JSON to avoid strict validation
    try:
        payload: dict = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body")

    # Normalize/coerce inputs
    normalized: dict = {}
    for key, value in payload.items():
        if value in (None, ""):
            continue
        if key == "date":
            try:
                if isinstance(value, str):
                    value = date_type.fromisoformat(value)
            except Exception:
                raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
        if key == "time":
            try:
                if isinstance(value, str):
                    value = time_type.fromisoformat(value)
            except Exception:
                raise HTTPException(status_code=400, detail="Invalid time format. Use HH:MM or HH:MM:SS")
        normalized[key] = value

    # Update only valid attributes
    for key, value in normalized.items():
        if hasattr(event, key):
            setattr(event, key, value)
    
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(event_id: int, db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    event = db.get(models.Event, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    db.delete(event)
    db.commit()
    return None

