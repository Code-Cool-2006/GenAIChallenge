from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from backend.schemas import UserCreate, UserSchema
from backend.models import User, Student
from backend.database import get_db
from sqlalchemy.orm import Session
from backend.utils.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    oauth2_scheme,
    verify_token,
)
from datetime import datetime, timedelta
import logging
import traceback


# --- Logging Setup ---
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# --- Router Setup ---
router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

# --- API Endpoints ---

@router.post("/register", response_model=UserSchema, status_code=status.HTTP_201_CREATED)
def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    try:
        # Check if user exists
        db_user = db.query(User).filter(User.email == user_data.email).first()
        if db_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        logger.info(f"Password before hashing: {user_data.password} (type: {type(user_data.password)})")
        hashed_password = get_password_hash(user_data.password)
        logger.info(f"Hashed password: {hashed_password}")

        new_user = User(
            full_name=user_data.full_name,
            email=user_data.email,
            password_hash=hashed_password,
            role=user_data.role
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Registration error: {e}")
        logger.error(traceback.format_exc())  # 🧠 add this line
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {e}"
        )
    
@router.post("/login")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Log in a user.
    Verifies credentials and returns a JWT access token.
    """
    logger.info(f"Login attempt for user: {form_data.username}")
    
    # Find user by email
    user = db.query(User).filter(User.email == form_data.username).first()
    
    if not user or not user.password_hash:
        logger.warning(f"User not found or no password hash: {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate":"Bearer"}
        )

    # Verify password
    if not verify_password(form_data.password, user.password_hash):
        logger.warning(f"Invalid password for user: {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate":"Bearer"}
        )

    # Update last login
    try:
        user.last_login = datetime.utcnow()
        db.commit()
    except Exception as e:
        logger.error(f"Could not update last_login: {e}")
        db.rollback()

    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
        data={"sub": user.email},
        expires_delta=access_token_expires
    )

    return JSONResponse(content={
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role
        }
    })

@router.post("/token")
async def generate_jwt_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Token endpoint for other apps: POST application/x-www-form-urlencoded
    fields: username, password
    Response: {"access_token": "...", "token_type":"bearer"}
    """
    logger.info(f"Token request for user: {form_data.username}")

    # Find user
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not user.password_hash:
        logger.warning(f"User not found or no password hash: {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate":"Bearer"}
        )

    # Verify password
    if not verify_password(form_data.password, user.password_hash):
        logger.warning(f"Invalid password for token request: {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate":"Bearer"}
        )

    # Create token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(data={"sub": user.email}, expires_delta=access_token_expires)

    return {"access_token": token, "token_type": "bearer"}

# convenience dependency to protect other endpoints/apps
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = verify_token(token)
    email = payload.get("sub")
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate":"Bearer"}
        )
    return user