from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from .. import schemas, models
from ..deps import get_current_user, require_admin


router = APIRouter(prefix="/events", tags=["events"])


@router.get("/", response_model=List[schemas.EventOut])
def list_events(db: Session = Depends(get_db)):
    return db.query(models.Event).order_by(models.Event.date, models.Event.time).all()


@router.get("/{event_id}", response_model=schemas.EventOut)
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.get(models.Event, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


@router.post("/", response_model=schemas.EventOut, status_code=status.HTTP_201_CREATED)
def create_event(event: schemas.EventCreate, db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    event_obj = models.Event(**event.model_dump())
    db.add(event_obj)
    db.commit()
    db.refresh(event_obj)
    return event_obj


@router.put("/{event_id}", response_model=schemas.EventOut)
def update_event(event_id: int, updates: schemas.EventUpdate, db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    event = db.get(models.Event, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    for key, value in updates.model_dump(exclude_unset=True).items():
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

