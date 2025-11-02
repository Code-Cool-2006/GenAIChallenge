from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta, datetime

from ..schemas import UserCreate, UserSchema
from ..database import get_db
from ..models import User, Student
from ..utils.security import hash_password, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES

# --- Router Setup ---
router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

# --- API Endpoints ---

@router.post("/register", response_model=UserSchema, status_code=status.HTTP_201_CREATED)
def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user.
    Hashes the password before storing it in the database.
    """
    # Check if user already exists
    db_user = db.query(User).filter(User.email == user_data.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Hash the password
    hashed_password = hash_password(user_data.password)

    # Create new user instance
    new_user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        password_hash=hashed_password,
        role=user_data.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create corresponding Student entry
    new_student = Student(
        fullname=user_data.full_name,
        email=user_data.email,
        password_hash=hashed_password,
        user_id=new_user.user_id
    )

    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    return new_user

@router.post("/login")
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Log in a user.
    Verifies credentials and returns a JWT access token.
    """
    # Find user by email
    user = db.query(User).filter(User.email == form_data.username).first()

    # Check if user exists and password is correct
    if not user or not verify_password(form_data.password, user.password_hash):
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"detail": "Incorrect email or password"},
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Update last_login in User table
    user.last_login = datetime.utcnow()
    db.commit()

    # Update last_login in Student table if exists
    student = db.query(Student).filter(Student.user_id == user.user_id).first()
    if student:
        student.last_login = datetime.utcnow()
        db.commit()

    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}

