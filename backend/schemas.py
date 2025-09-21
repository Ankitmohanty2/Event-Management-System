from typing import Optional, List
from datetime import date, time, datetime
from pydantic import BaseModel, EmailStr, Field, validator


class UserBase(BaseModel):
    name: str = Field(
        min_length=1, 
        max_length=100, 
        description="User's full name",
        example="John Doe"
    )
    email: EmailStr = Field(
        description="User's email address",
        example="john.doe@example.com"
    )


class UserCreate(UserBase):
    password: str = Field(
        min_length=6, 
        max_length=128, 
        description="User's password (minimum 6 characters)",
        example="securepassword123"
    )
    role: str = Field(
        default="normal", 
        description="User role (normal or admin)",
        example="normal"
    )
    
    @validator('role')
    def validate_role(cls, v):
        if v not in ['normal', 'admin']:
            raise ValueError('Role must be either "normal" or "admin"')
        return v


class UserLogin(BaseModel):
    email: EmailStr = Field(
        description="User's email address",
        example="john.doe@example.com"
    )
    password: str = Field(
        description="User's password",
        example="securepassword123"
    )


class UserOut(BaseModel):
    id: int = Field(description="User's unique identifier")
    name: str = Field(description="User's full name")
    email: EmailStr = Field(description="User's email address")
    role: str = Field(description="User's role")

    class Config:
        orm_mode = True


class EventBase(BaseModel):
    title: str = Field(
        min_length=1, 
        max_length=255, 
        description="Event title",
        example="Annual Company Meeting"
    )
    description: Optional[str] = Field(
        None, 
        description="Event description",
        example="Join us for our annual company meeting where we'll discuss the year's achievements and future plans."
    )
    date: date = Field(
        description="Event date",
        example="2024-12-25"
    )
    time: time = Field(
        description="Event time",
        example="14:30:00"
    )
    image_url: Optional[str] = Field(
        None, 
        description="URL of the event image",
        example="https://example.com/event-image.jpg"
    )


class EventCreate(EventBase):
    pass


class EventUpdate(BaseModel):
    title: Optional[str] = Field(
        None, 
        min_length=1, 
        max_length=255, 
        description="Event title"
    )
    description: Optional[str] = Field(
        None, 
        description="Event description"
    )
    date: Optional[date] = Field(
        None, 
        description="Event date"
    )
    time: Optional[time] = Field(
        None, 
        description="Event time"
    )
    image_url: Optional[str] = Field(
        None, 
        description="URL of the event image"
    )
    
    class Config:
        extra = "ignore"


class EventOut(EventBase):
    id: int = Field(description="Event's unique identifier")
    created_at: datetime = Field(description="Event creation timestamp")
    updated_at: datetime = Field(description="Event last update timestamp")

    class Config:
        orm_mode = True


class PaginationInfo(BaseModel):
    page: int = Field(description="Current page number")
    page_size: int = Field(description="Number of items per page")
    total_count: int = Field(description="Total number of items")
    total_pages: int = Field(description="Total number of pages")
    has_next: bool = Field(description="Whether there is a next page")
    has_prev: bool = Field(description="Whether there is a previous page")


class EventListResponse(BaseModel):
    events: List[EventOut] = Field(description="List of events")
    pagination: PaginationInfo = Field(description="Pagination information")


class Token(BaseModel):
    access_token: str = Field(description="JWT access token")
    token_type: str = Field(default="bearer", description="Token type")
    user: Optional[dict] = Field(None, description="User information")


class TokenData(BaseModel):
    user_id: int = Field(description="User ID from token")
    role: str = Field(description="User role from token")
