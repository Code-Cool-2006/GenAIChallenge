import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# --- Database Configuration ---
# Get the database URL from environment variables, with a default value for local development.
# For local development, use SQLite. For production, use MySQL or PostgreSQL.
DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:O-S-N-312@localhost/careerbridge")

# The engine is the core interface to the database.
engine = create_engine(DATABASE_URL)

# A SessionLocal class is a factory for creating new database sessions.
# A session is the primary interface for all database operations.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base is a factory for creating declarative base classes for your models.
# All your database models (like User, Skill, etc.) will inherit from this class.
Base = declarative_base()

# --- Database Session Dependency ---
def get_db():
    """
    Dependency function for FastAPI to get a database session.
    This will be used in the API routers to inject a database session into the endpoints.
    It ensures that the database session is always closed after the request is finished.
    """
    db = SessionLocal()
    try:
        # 'yield' provides the session to the endpoint.
        yield db
    finally:
        # This block ensures the session is closed, even if errors occur.
        db.close()

