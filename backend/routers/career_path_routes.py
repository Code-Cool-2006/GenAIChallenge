from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..schemas import CareerPathRequest, CareerPathResponse
from ..services import gemini_service
from ..database import get_db
from ..models import User
from .user import get_current_user

# --- Router Setup ---
router = APIRouter(
    prefix="/api/career",
    tags=["Career Path"]
)

# --- API Endpoints ---

@router.post("/generate-roadmap", response_model=CareerPathResponse)
def generate_user_career_roadmap(
    request: CareerPathRequest,
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """
    Generates a career roadmap for the logged-in user based on a job title.
    This endpoint is protected and requires authentication.
    """
    if not request.job_title or not request.job_title.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job title cannot be empty."
        )

    try:
        # Call the Gemini service to get the AI-generated content
        roadmap_text = gemini_service.generate_career_path(request.job_title)
        
        # Check if the service returned an error message
        if roadmap_text.startswith("Error:") or roadmap_text.startswith("Sorry,"):
             raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=roadmap_text
            )

        return {"roadmap": roadmap_text}
        
    except Exception as e:
        # Catch any other unexpected errors
        print(f"An unexpected error occurred: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An internal error occurred while generating the career path."
        )

