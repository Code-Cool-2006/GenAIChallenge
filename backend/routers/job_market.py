import json
import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from ..services.vertex_ai_service import vertex_ai_service

# --- Pydantic Model for Request Body ---
class MarketInsightsRequest(BaseModel):
    jobTitle: str = Field(..., min_length=2, description="The job title to get insights for.")

# Create a new router which will be imported into main.py
router = APIRouter(
    prefix="/api",
    tags=["Market Insights"]
)

# --- API Endpoint for Job Market Insights ---
@router.post("/market-insights")
async def get_market_insights(request: MarketInsightsRequest):
    """
    Provides job market insights for a specific job title using Vertex AI Gemini.
    """
    print(f"Received market insights request for: {request.jobTitle}")
    try:
        # Use Vertex AI service for job market analysis
        insights_data = await vertex_ai_service.analyze_job_market(
            skills=[request.jobTitle],  # Pass job title as primary skill
            location="global"
        )

        if "error" in insights_data:
            raise HTTPException(status_code=500, detail=insights_data["error"])

        # Transform the response to match the expected format
        formatted_response = {
            "averageSalary": insights_data.get("salary_range", "Not available"),
            "demand": insights_data.get("demand_level", "Medium"),
            "topSkills": [
                {"name": skill, "importance": 80} for skill in insights_data.get("emerging_trends", [])
            ]
        }

        print("Market insights generated successfully.")
        return formatted_response

    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
