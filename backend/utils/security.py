import os
from datetime import datetime, timedelta, timezone
from typing import Optional

from dotenv import load_dotenv
from fastapi import HTTPException, status
from jose import JWTError, jwt
from passlib.context import CryptContext

# Load environment variables from .env file
load_dotenv()

# --- Configuration ---
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-here")  # Default for development
ALGORITHM = "HS256"  # The algorithm used to sign the JWT
ACCESS_TOKEN_EXPIRE_MINUTES = 60  # The token will be valid for 60 minutes

# --- Password Hashing Setup ---
# We use passlib to handle password hashing and verification.
# bcrypt is a strong and widely-used algorithm for this purpose.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """Hashes a plain-text password using bcrypt."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain-text password against its hashed version."""
    return pwd_context.verify(plain_password, hashed_password)


# --- JWT (Access Token) Functions ---

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Creates a new JWT access token.

    Args:
        data: The payload to encode into the token (e.g., user's email).
        expires_delta: An optional timedelta to set a custom expiration time.

    Returns:
        The encoded JWT as a string.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        # Default expiration time if none is provided
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str, credentials_exception: HTTPException) -> str:
    """
    Verifies a JWT access token.

    Args:
        token: The JWT string from the request's Authorization header.
        credentials_exception: The exception to raise if validation fails.

    Returns:
        The user's email (the 'sub' claim) if the token is valid.
    """
    try:
        # Decode the token using the secret key and algorithm
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        # Extract the email from the 'sub' (subject) claim
        email: str = payload.get("sub")
        if email is None:
            # If the 'sub' claim is missing, the token is invalid
            raise credentials_exception

        return email
    except JWTError:
        # If jose raises any decoding error, the token is invalid
        raise credentials_exception


def get_current_user(token: str, db):
    """
    Dependency to get the current authenticated user.
    It verifies the JWT token and fetches the user from the database.
    This function will be used to protect routes.
    """
    from fastapi import HTTPException, status
    from ..models import User

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

