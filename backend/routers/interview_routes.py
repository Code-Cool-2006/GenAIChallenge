from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

# Use package-relative imports
from ..database import get_db
from ..models import User, InterviewSession
from .. import schemas
from ..utils.security import get_current_user
from ..services import gemini_service
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
# --- Router Setup ---
router = APIRouter(
    prefix="/api/interview",
    tags=["Interview"]
)

# --- Pydantic Models ---
class GenerateQuestionsRequest(BaseModel):
    role: str

class GenerateQuestionsResponse(BaseModel):
    questions: List[str]

# --- API Endpoints ---

@router.post("/generate-questions", response_model=GenerateQuestionsResponse)
def generate_interview_questions(
    request: GenerateQuestionsRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Generates 8 interview questions for a given role using the Gemini API.
    """
    if not request.role:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role cannot be empty."
        )

    try:
        # 1. Get AI generated questions from the Gemini service
        questions = gemini_service.generate_interview_questions(role=request.role)

        # Check for errors from the service
        if not questions or len(questions) == 0:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Unable to generate questions at this time."
            )

        # 2. Return the questions to the user
        return {"questions": questions}

    except Exception as e:
        print(f"An unexpected error occurred in generating questions: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An internal error occurred while generating interview questions."
        )

@router.post("/feedback", response_model=schemas.InterviewFeedbackResponse)
def get_interview_feedback(
    request: schemas.InterviewFeedbackRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Receives an interview question and a user's answer, gets feedback from the Gemini API,
    and saves the session to the database.
    """
    if not request.question or not request.user_answer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Question and answer cannot be empty."
        )

    try:
        # 1. Get AI feedback from the Gemini service
        ai_feedback_text = gemini_service.generate_interview_feedback(
            question=request.question,
            user_answer=request.user_answer
        )

        # Check for errors from the service
        if ai_feedback_text.startswith("Error:") or ai_feedback_text.startswith("Sorry,"):
             raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=ai_feedback_text
            )

        # 2. Save the entire session to the database
        new_session = InterviewSession(
            user_id=current_user.user_id,
            question=request.question,
            user_answer=request.user_answer,
            ai_feedback=ai_feedback_text,
            score=0  # Placeholder for potential future scoring logic
        )
        db.add(new_session)
        db.commit()
        db.refresh(new_session)  # ensure the object has DB-generated fields populated

        # 3. Return the saved session (matches schemas.InterviewFeedbackResponse)
        return {"session": new_session}

    except HTTPException:
        raise
    except Exception as e:
        print(f"An unexpected error occurred in interview feedback: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An internal error occurred while processing your interview feedback."
        )

