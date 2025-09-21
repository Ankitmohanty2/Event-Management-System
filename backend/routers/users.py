import logging
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from database import get_db
import schemas, models
from auth import get_password_hash, verify_password, create_access_token
from deps import get_current_user, require_admin

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post(
    "/signup", 
    response_model=schemas.UserOut,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new user account",
    description="Register a new user with email, password, name, and role. Email must be unique."
)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    try:
        existing = db.query(models.User).filter(models.User.email == user.email).first()
        if existing:
            logger.warning(f"Signup attempt with existing email: {user.email}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Email address is already registered. Please use a different email or try logging in."
            )
        
        if user.role not in ["normal", "admin"]:
            logger.warning(f"Invalid role provided: {user.role}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid role. Must be 'normal' or 'admin'."
            )
        
        user_obj = models.User(
            name=user.name.strip(),
            email=user.email.lower().strip(),
            password_hash=get_password_hash(user.password),
            role=user.role or "normal",
        )
        
        db.add(user_obj)
        db.commit()
        db.refresh(user_obj)
        
        logger.info(f"New user created successfully: {user.email} (ID: {user_obj.id})")
        return user_obj
        
    except IntegrityError as e:
        db.rollback()
        logger.error(f"Database integrity error during signup: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email address is already registered."
        )
    except Exception as e:
        db.rollback()
        logger.error(f"Unexpected error during signup: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating your account. Please try again."
        )

@router.post(
    "/login", 
    response_model=schemas.Token,
    summary="Authenticate user and get access token",
    description="Login with email and password to receive an access token for API authentication."
)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    try:
        email = form_data.username.lower().strip()
        user = db.query(models.User).filter(models.User.email == email).first()
        
        if not user:
            logger.warning(f"Login attempt with non-existent email: {email}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Invalid email or password. Please check your credentials and try again."
            )
        
        if not verify_password(form_data.password, user.password_hash):
            logger.warning(f"Failed login attempt for user: {email}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Invalid email or password. Please check your credentials and try again."
            )
        
        token = create_access_token({"sub": str(user.id), "role": user.role})
        logger.info(f"Successful login for user: {email} (ID: {user.id})")
        
        return {
            "access_token": token, 
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error during login: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during login. Please try again."
        )

@router.get(
    "/me", 
    response_model=schemas.UserOut,
    summary="Get current user information",
    description="Retrieve the authenticated user's profile information."
)
def get_me(current_user: models.User = Depends(get_current_user)):
    logger.info(f"User profile accessed: {current_user.email} (ID: {current_user.id})")
    return current_user

@router.post(
    "/logout",
    summary="Logout user",
    description="Logout the current user (client should discard the access token)."
)
def logout(current_user: models.User = Depends(get_current_user)):
    logger.info(f"User logged out: {current_user.email} (ID: {current_user.id})")
    return {"message": "Successfully logged out"}

