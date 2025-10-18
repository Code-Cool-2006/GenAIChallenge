from fastapi import APIRouter
from pydantic import BaseModel
import litellm

# --- Pydantic Models ---
# Yeh define karta hai ki frontend se resume review ke liye kaisa data aayega
class ResumeRequest(BaseModel):
    resumeText: str
    collegeTier: str | None = "Tier 2/3"
    characterProfileKey: str | None = "Not specified"
    skills: list[str] | None = []

# --- Mock Data (For context, same as frontend) ---
character_profiles = {
    "Explorer": {"name": "The Explorer"},
    "Captain": {"name": "The Captain"},
    "Connector": {"name": "The Connector"},
    "Challenger": {"name": "The Challenger"},
    "DeepDiver": {"name": "The Deep Diver"},
}

# --- Router Setup ---
# Is feature ke saare endpoints "/api/resume" se start honge
router = APIRouter(
    prefix="/api/resume",
    tags=["Resume Review"]
)

# --- API Endpoint ---
@router.post("/review")
async def review_resume(data: ResumeRequest):
    """
    User ke resume text ko analyze karke AI-powered feedback deta hai.
    """
    try:
        system_instruction = """You are an expert career coach and recruiter specializing in helping students from Tier 2/3 colleges land jobs at top companies.
Your feedback must be constructive, encouraging, and highly actionable.
Analyze the resume for ATS compatibility, impact metrics, action verbs, and clarity.
Provide feedback in simple markdown format."""

        prompt = f"""{system_instruction}

Please review the following resume for a student from a {data.collegeTier} college.
Their self-identified character profile on CareerBridge is "{character_profiles.get(data.characterProfileKey, {}).get('name', 'Not specified')}".
Their target skills are: {', '.join(data.skills) if data.skills else "Not specified"}.

Resume Text:
---
{data.resumeText}
---

Provide a review with the following structure:
### Overall Impression
(A brief, encouraging summary)

### ATS Compatibility Score: [Give a score out of 10]
(Briefly explain why, mentioning keywords and formatting)

### Actionable Feedback (Bulleted List)
- Point 1
- Point 2
- Point 3"""

        response = litellm.completion(
            model=litellm.model,
            messages=[
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": prompt}
            ]
        )

        feedback = response.choices[0].message.content

        if feedback and feedback.strip():
            return {"feedback": feedback}
        else:
            return {"error": "Could not get feedback. The model returned an empty response."}

    except Exception as e:
        print(f"Error during AI API call: {e}")
        return {"error": "An error occurred while generating feedback."}
