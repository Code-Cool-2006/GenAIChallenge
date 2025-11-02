# TODO: Fix Import Errors in Backend Package

## Steps to Complete
- [x] Update backend/main.py to use relative imports for routers (e.g., from .routers import auth)
- [x] Fix backend/routers/interview_routes.py: Add missing imports (BaseModel, List, InterviewSession, gemini_service), remove faulty logger line
- [ ] Update backend/routers/career_path_routes.py to use relative imports (e.g., from ..models import User)
- [ ] Update backend/routers/user.py to use relative imports (e.g., from ..database import get_db)
- [ ] Check and update other router files (auth.py, profile_routes.py, chatbot.py, job_market.py, review_resume.py) for consistent relative imports
- [x] Force backend to use SQLite by hardcoding DATABASE_URL in database.py
- [x] Test the server by running uvicorn backend.main:app to ensure no import errors
