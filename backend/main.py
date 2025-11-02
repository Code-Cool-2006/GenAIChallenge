import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .database import engine, Base  # Assuming you have database.py
from .routers import auth, user, profile_routes, career_path_routes, interview_routes, job_market # Assuming all these router files exist

# Configure logging to see server status in the terminal
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Database Table Creation ---
# This function creates all the tables defined in your models.py
def create_db_and_tables():
    try:
        logger.info("Attempting to connect to the database and create tables...")
        Base.metadata.create_all(bind=engine)
        logger.info("Database connection successful and tables created/verified.")
    except Exception as e:
        logger.error(f"Error connecting to the database or creating tables: {e}")

# --- Lifespan Context Manager ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    create_db_and_tables()
    yield
    # Shutdown (if needed)

# --- FastAPI App Initialization ---
app = FastAPI(
    title="CareerUp AI API",
    description="Backend services for the CareerUp platform, handling user auth, profiles, and AI-powered career tools.",
    version="1.0.0",
    lifespan=lifespan
)

# --- CORS (Cross-Origin Resource Sharing) Middleware ---
# This allows your React frontend to communicate with this backend.
# IMPORTANT: For production, you should restrict this to your actual frontend domain.
origins = [
    "http://localhost:5173",  # Your React app
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Include All Routers ---
# This adds all the API endpoints from your different feature files to the main app.
logger.info("Including API routers...")
app.include_router(auth)
app.include_router(user)
app.include_router(profile_routes)
app.include_router(career_path_routes)
app.include_router(interview_routes)
app.include_router(job_market)
# app.include_router(review_resume) # Assuming you have a review_resume.py router
logger.info("All routers included successfully.")


# --- Root Endpoint (Health Check) ---
# A simple endpoint to confirm that the server is running.
@app.get("/", tags=["Health Check"])
def read_root():
    return {"message": "Welcome to the CareerUp AI Backend!"}

# --- Welcome Endpoint ---
# A new endpoint that logs request metadata and returns a welcome message.
@app.get("/welcome", tags=["Welcome"])
def get_welcome(request: Request):
    logger.info(f"Request received: {request.method} {request.url.path}")
    return {"message": "Welcome to the CareerUp AI Backend!"}

