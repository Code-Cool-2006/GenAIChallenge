from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import User
from backend.schemas import UserSchema
from backend.utils.security import verify_token

# --- Router Setup ---
router = APIRouter(
    prefix="/api/users",
    tags=["Users"]
)

# --- Dependency for JWT Authentication ---
# This scheme will look for an "Authorization: Bearer <token>" header in requests.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    """
    Dependency to get the current authenticated user.
    It verifies the JWT token and fetches the user from the database.
    This function will be used to protect routes.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Verify the token to get the user's email
    email = verify_token(token, credentials_exception)
    
    # Fetch the user from the database
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        # If no user is found with that email, the token is invalid
        raise credentials_exception
        
    return user


# --- API Endpoints ---

@router.get("/me", response_model=UserSchema)
def read_users_me(current_user: User = Depends(get_current_user)):
    """
    Get profile information for the currently logged-in user.
    
    The `Depends(get_current_user)` part ensures that this endpoint is protected.
    Only requests with a valid JWT token will be able to access it.
    FastAPI automatically handles serializing the returned `current_user` object
    using the `UserSchema`, so the password hash is not exposed.
    """
    return current_user

