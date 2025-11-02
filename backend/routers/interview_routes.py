from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..schemas import InterviewFeedbackRequest, InterviewFeedbackResponse
from ..services import gemini_service
from ..database import get_db
from ..models import User, InterviewSession
from .user import get_current_user

# --- Router Setup ---
router = APIRouter(
    prefix="/api/interview",
    tags=["Interview"]
)

# --- API Endpoints ---

@router.post("/feedback", response_model=InterviewFeedbackResponse)
def get_interview_feedback(
    request: InterviewFeedbackRequest,
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

        # 3. Return the feedback to the user
        return {"feedback": ai_feedback_text}

    except Exception as e:
        # Catch any other unexpected errors during the process
        print(f"An unexpected error occurred in interview feedback: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An internal error occurred while processing your interview feedback."
        )

