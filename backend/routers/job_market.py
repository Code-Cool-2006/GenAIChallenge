import json
import litellm
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

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
    Provides job market insights for a specific job title using LiteLLM.
    """
    print(f"Received market insights request for: {request.jobTitle}")
    try:
        system_instruction = """
              You are a job market analyst.
              Provide key insights for a specific job title.
              Respond ONLY with valid JSON in this format:
              {
                "averageSalary": "string (e.g. '$120,000 USD')",
                "demand": "string (e.g. 'High' or 'Growing by 15%')",
                "topSkills": [
                  { "name": "string", "importance": number (1-100) }
                ]
              }
              Provide 5–10 top skills dynamically based on the role.
            """

        prompt = f'Provide job market insights for a "{request.jobTitle}".'

        print("Generating market insights from LiteLLM...")
        response = litellm.completion(
            model=litellm.model,
            messages=[
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": prompt}
            ]
        )

        result_text = response.choices[0].message.content

        if not result_text or not result_text.strip():
            raise HTTPException(status_code=500, detail="The model returned an empty response.")

        # Clean and parse the JSON response from the model
        cleaned_text = result_text.replace("```json", "").replace("```", "").strip()
        insights_data = json.loads(cleaned_text)

        print("Market insights generated successfully.")
        return insights_data

    except json.JSONDecodeError:
        print("Error decoding JSON from model response.")
        raise HTTPException(status_code=500, detail="Failed to parse the response from the AI model.")
    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
