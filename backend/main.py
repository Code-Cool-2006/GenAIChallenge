import logging
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base
from passlib.context import CryptContext
from jose import jwt
from pydantic import BaseModel # ✅ YAHAN TYPO THEEK KIYA GAYA HAI

# --- Logging Setup ---
# Isse terminal mein saaf messages dikhenge
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("main")

# ================== CONFIG ==================
DATABASE_URL = "mysql+pymysql://root:O-S-N-312@localhost/career_ai"
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

# ================== DB SETUP ==================
Base = declarative_base()
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Database ke column names ke saath model ko match kiya gaya hai
class User(Base):
    __tablename__ = "users"
    user_id = Column(Integer, primary_key=True, index=True) # id -> user_id
    full_name = Column(String(100))
    email = Column(String(100), unique=True, index=True)
    password_hash = Column(String(255)) # password -> password_hash

try:
    # Base.metadata.create_all(bind=engine) # Isko comment out kar rahe hain kyunki table pehle se hai
    logger.info("Database connection successful. Table sync skipped as it exists.")
except Exception as e:
    logger.error(f"Database connection failed: {e}")

# ================== PASSWORD HASH ==================
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# ================== PYDANTIC MODELS ==================
class UserCreate(BaseModel):
    full_name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

# ================== FASTAPI APP ==================
app = FastAPI()

origins = ["http://localhost", "http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ================== ROUTES ==================
@app.get("/")
def read_root():
    return {"message": "Welcome! Career AI API is running."}

@app.post("/api/auth/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    logger.info(f"Registration attempt for email: {user.email}")
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    hashed_pw = hash_password(user.password)
    # Sahi column 'password_hash' mein data save ho raha hai
    new_user = User(full_name=user.full_name, email=user.email, password_hash=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    logger.info(f"User {user.email} registered successfully.")
    return {"msg": "Registration successful. Please login."}

@app.post("/api/auth/login")
def login_user(user: UserLogin, db: Session = Depends(get_db)):
    logger.info(f"Login attempt for email: {user.email}")
    # Sahi column 'password_hash' se password check ho raha hai
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token_data = {"sub": db_user.email}
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
    logger.info(f"User {user.email} logged in successfully.")
    return {"access_token": token, "token_type": "bearer"}

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(status_code=exc.status_code, content={"msg": exc.detail})

