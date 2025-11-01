import os
from google.cloud import aiplatform
from google.oauth2 import service_account
from vertexai.generative_models import GenerativeModel
import vertexai
from typing import Optional, Dict, Any
import json

class VertexAIService:
    def __init__(self):
        # Initialize Vertex AI
        self.project_id = os.getenv("GOOGLE_CLOUD_PROJECT", "your-project-id")
        self.location = os.getenv("GOOGLE_CLOUD_LOCATION", "us-central1")

        # Initialize with service account if credentials are provided
        credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
        if credentials_path and os.path.exists(credentials_path):
            credentials = service_account.Credentials.from_service_account_file(credentials_path)
            vertexai.init(project=self.project_id, location=self.location, credentials=credentials)
        else:
            # Use default credentials (for deployed environments)
            vertexai.init(project=self.project_id, location=self.location)

        # Initialize the generative model
        self.model = GenerativeModel("gemini-1.5-pro")

    async def review_resume(self, resume_text: str, college_tier: str = "Tier 2/3",
                          character_profile: str = "Not specified",
                          skills: list = None) -> Dict[str, Any]:
        """
        Review resume using Google Cloud Vertex AI Gemini model
        """
        try:
            skills_str = ', '.join(skills) if skills else "Not specified"

            system_instruction = """You are an expert career coach and recruiter specializing in helping students from Tier 2/3 colleges land jobs at top companies.
Your feedback must be constructive, encouraging, and highly actionable.
Analyze the resume for ATS compatibility, impact metrics, action verbs, and clarity.
Provide feedback in simple markdown format."""

            prompt = f"""{system_instruction}

Please review the following resume for a student from a {college_tier} college.
Their self-identified character profile on CareerBridge is "{character_profile}".
Their target skills are: {skills_str}.

Resume Text:
---
{resume_text}
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

            # Generate content using Vertex AI
            response = self.model.generate_content(
                prompt,
                generation_config={
                    "temperature": 0.7,
                    "top_p": 0.8,
                    "top_k": 40,
                    "max_output_tokens": 2048,
                }
            )

            feedback = response.text.strip()

            if feedback:
                return {"feedback": feedback}
            else:
                return {"error": "Could not get feedback. The model returned an empty response."}

        except Exception as e:
            print(f"Error during Vertex AI API call: {e}")
            return {"error": f"An error occurred while generating feedback: {str(e)}"}

    async def generate_interview_questions(self, role: str, count: int = 8) -> list:
        """
        Generate interview questions for a specific role using Vertex AI
        """
        try:
            prompt = f"""Generate {count} interview questions for the role of {role} in a professional setting.
Number them 1-{count} and make each question on a new line.
Focus on behavioral, technical, and situational questions appropriate for this role."""

            response = self.model.generate_content(
                prompt,
                generation_config={
                    "temperature": 0.8,
                    "top_p": 0.9,
                    "top_k": 40,
                    "max_output_tokens": 1024,
                }
            )

            questions_text = response.text.strip()
            # Parse the numbered questions
            questions = []
            for line in questions_text.split('\n'):
                line = line.strip()
                if line and (line[0].isdigit() or line.startswith('-')):
                    # Remove numbering
                    question = line.lstrip('0123456789.- ').strip()
                    if question:
                        questions.append(question)

            return questions[:count] if questions else []

        except Exception as e:
            print(f"Error generating interview questions: {e}")
            return []

    async def analyze_job_market(self, skills: list, location: str = "global") -> Dict[str, Any]:
        """
        Analyze job market trends for given skills
        """
        try:
            skills_str = ', '.join(skills) if skills else "general skills"

            prompt = f"""Analyze the current job market for the following skills: {skills_str}
Location: {location}

Provide analysis in the following JSON format:
{{
    "demand_level": "High/Medium/Low",
    "salary_range": "approximate range",
    "top_companies": ["company1", "company2", "company3"],
    "emerging_trends": ["trend1", "trend2", "trend3"],
    "recommendations": ["rec1", "rec2", "rec3"]
}}"""

            response = self.model.generate_content(
                prompt,
                generation_config={
                    "temperature": 0.3,
                    "top_p": 0.8,
                    "top_k": 40,
                    "max_output_tokens": 1024,
                }
            )

            # Try to parse as JSON
            try:
                result = json.loads(response.text.strip())
                return result
            except json.JSONDecodeError:
                # If not valid JSON, return a structured response
                return {
                    "demand_level": "Medium",
                    "salary_range": "Varies by role and experience",
                    "top_companies": ["Tech companies", "Consulting firms", "Startups"],
                    "emerging_trends": ["AI integration", "Remote work", "Skill specialization"],
                    "recommendations": ["Continuous learning", "Build portfolio", "Network actively"],
                    "raw_analysis": response.text.strip()
                }

        except Exception as e:
            print(f"Error analyzing job market: {e}")
            return {
                "error": f"Could not analyze job market: {str(e)}",
                "demand_level": "Unknown",
                "salary_range": "Unknown",
                "top_companies": [],
                "emerging_trends": [],
                "recommendations": []
            }

# Global instance
vertex_ai_service = VertexAIService()
