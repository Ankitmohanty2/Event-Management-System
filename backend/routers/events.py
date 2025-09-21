import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Body, Request, Query
from datetime import date as date_type, time as time_type
from sqlalchemy.orm import Session
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError

from database import get_db
import schemas, models
from deps import get_current_user, require_admin

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/events", tags=["events"])


@router.get(
    "/", 
    response_model=schemas.EventListResponse,
    summary="List all events with pagination",
    description="Retrieve a paginated list of all events. Events are ordered by date and time."
)
def list_events(
    page: int = Query(1, ge=1, description="Page number (starts from 1)"),
    page_size: int = Query(10, ge=1, le=100, description="Number of events per page (max 100)"),
    db: Session = Depends(get_db)
):
    try:
        offset = (page - 1) * page_size
        total_count = db.query(func.count(models.Event.id)).scalar()
        
        events = db.query(models.Event)\
            .order_by(models.Event.date, models.Event.time)\
            .offset(offset)\
            .limit(page_size)\
            .all()
        
        total_pages = (total_count + page_size - 1) // page_size
        has_next = page < total_pages
        has_prev = page > 1
        
        logger.info(f"Events listed: page {page}, size {page_size}, total {total_count}")
        
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
    except Exception as e:
        logger.error(f"Error listing events: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve events. Please try again."
        )


@router.get(
    "/{event_id}", 
    response_model=schemas.EventOut,
    summary="Get event by ID",
    description="Retrieve a specific event by its ID."
)
def get_event(event_id: int, db: Session = Depends(get_db)):
    try:
        if event_id <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Event ID must be a positive integer."
            )
        
        event = db.get(models.Event, event_id)
        if not event:
            logger.warning(f"Event not found: ID {event_id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail=f"Event with ID {event_id} not found."
            )
        
        logger.info(f"Event retrieved: ID {event_id}")
        return event
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving event {event_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve event. Please try again."
        )


@router.post(
    "/", 
    response_model=schemas.EventOut, 
    status_code=status.HTTP_201_CREATED,
    summary="Create a new event",
    description="Create a new event. Requires admin authentication."
)
def create_event(
    event: schemas.EventCreate, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(require_admin)
):
    try:
        if not event.title or not event.title.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Event title is required and cannot be empty."
            )
        
        if not event.date:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Event date is required."
            )
        
        if not event.time:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Event time is required."
            )
        
        event_obj = models.Event(
            title=event.title.strip(),
            description=event.description.strip() if event.description else None,
            date=event.date,
            time=event.time,
            image_url=event.image_url.strip() if event.image_url else None
        )
        
        db.add(event_obj)
        db.commit()
        db.refresh(event_obj)
        
        logger.info(f"Event created: '{event_obj.title}' (ID: {event_obj.id}) by admin {current_user.email}")
        return event_obj
        
    except HTTPException:
        raise
    except IntegrityError as e:
        db.rollback()
        logger.error(f"Database integrity error during event creation: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create event due to data constraints."
        )
    except Exception as e:
        db.rollback()
        logger.error(f"Unexpected error during event creation: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create event. Please try again."
        )


@router.put(
    "/{event_id}", 
    response_model=schemas.EventOut,
    summary="Update an existing event",
    description="Update an existing event by ID. Requires admin authentication."
)
async def update_event(
    event_id: int, 
    request: Request, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(require_admin)
):
    try:
        if event_id <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Event ID must be a positive integer."
            )
        
        event = db.get(models.Event, event_id)
        if not event:
            logger.warning(f"Event not found for update: ID {event_id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail=f"Event with ID {event_id} not found."
            )
        
        try:
            payload: dict = await request.json()
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Invalid JSON body. Please provide valid JSON data."
            )

        if not payload:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No data provided for update."
            )

        normalized: dict = {}
        for key, value in payload.items():
            if value in (None, ""):
                continue
                
            if key == "title" and isinstance(value, str):
                value = value.strip()
                if not value:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Event title cannot be empty."
                    )
                    
            if key == "date":
                try:
                    if isinstance(value, str):
                        value = date_type.fromisoformat(value)
                except Exception:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST, 
                        detail="Invalid date format. Use YYYY-MM-DD"
                    )
                    
            if key == "time":
                try:
                    if isinstance(value, str):
                        value = time_type.fromisoformat(value)
                except Exception:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST, 
                        detail="Invalid time format. Use HH:MM or HH:MM:SS"
                    )
                    
            if key == "description" and isinstance(value, str):
                value = value.strip() if value.strip() else None
                
            if key == "image_url" and isinstance(value, str):
                value = value.strip() if value.strip() else None
                
            normalized[key] = value

        for key, value in normalized.items():
            if hasattr(event, key):
                setattr(event, key, value)
        
        db.add(event)
        db.commit()
        db.refresh(event)
        
        logger.info(f"Event updated: '{event.title}' (ID: {event.id}) by admin {current_user.email}")
        return event
        
    except HTTPException:
        raise
    except IntegrityError as e:
        db.rollback()
        logger.error(f"Database integrity error during event update: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update event due to data constraints."
        )
    except Exception as e:
        db.rollback()
        logger.error(f"Unexpected error during event update: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update event. Please try again."
        )


@router.delete(
    "/{event_id}", 
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete an event",
    description="Delete an event by ID. Requires admin authentication."
)
def delete_event(
    event_id: int, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(require_admin)
):
    try:
        if event_id <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Event ID must be a positive integer."
            )
        
        event = db.get(models.Event, event_id)
        if not event:
            logger.warning(f"Event not found for deletion: ID {event_id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail=f"Event with ID {event_id} not found."
            )
        
        event_title = event.title
        db.delete(event)
        db.commit()
        
        logger.info(f"Event deleted: '{event_title}' (ID: {event_id}) by admin {current_user.email}")
        return None
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Unexpected error during event deletion: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete event. Please try again."
        )

