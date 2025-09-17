from typing import Optional
from datetime import date, time, datetime
from pydantic import BaseModel, EmailStr, Field


# User Schemas
class UserBase(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr


class UserCreate(UserBase):
    password: str = Field(min_length=6, max_length=128)
    role: str = Field(default="normal")


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str

    class Config:
        from_attributes = True


# Event Schemas
class EventBase(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = None
    date: date
    time: time
    image_url: Optional[str] = None


class EventCreate(EventBase):
    pass


class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    date: Optional[date] = None
    time: Optional[time] = None
    image_url: Optional[str] = None


class EventOut(EventBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: int
    role: str

