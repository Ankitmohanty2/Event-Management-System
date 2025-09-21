import logging
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from database import get_db
from models import User
from auth import decode_access_token

logger = logging.getLogger(__name__)

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login",
    scheme_name="JWT",
    description="Enter your JWT token"
)


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials. Please log in again.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        if not token:
            logger.warning("No token provided")
            raise credentials_exception
            
        payload = decode_access_token(token)
        if not payload:
            logger.warning("Invalid token payload")
            raise credentials_exception
            
        user_id = payload.get("sub")
        if not user_id:
            logger.warning("No user ID in token payload")
            raise credentials_exception
            
        user_id: int = int(user_id)
        
    except ValueError:
        logger.warning("Invalid user ID format in token")
        raise credentials_exception
    except Exception as e:
        logger.warning(f"Token validation error: {str(e)}")
        raise credentials_exception

    user = db.get(User, user_id)
    if not user:
        logger.warning(f"User not found for ID: {user_id}")
        raise credentials_exception
        
    logger.info(f"User authenticated: {user.email} (ID: {user.id})")
    return user


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "admin":
        logger.warning(f"Admin access denied for user: {current_user.email} (role: {current_user.role})")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Admin privileges required. You don't have permission to access this resource."
        )
    
    logger.info(f"Admin access granted to: {current_user.email}")
    return current_user

