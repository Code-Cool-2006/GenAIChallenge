from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import litellm

# --- Pydantic Models ---
class ChatRequest(BaseModel):
    message: str

# --- Router Setup ---
router = APIRouter(
    prefix="/api/chatbot",
    tags=["ChatBot"]
)

# --- API Endpoint ---
@router.post("/")
async def chat_with_bot(data: ChatRequest):
    """
    Chat with the career assistant bot.
    """
    try:
        system_instruction = """You are a career assistant. Only answer questions about careers, jobs, job market, and skills.
If the question is outside this scope, politely decline."""

        response = litellm.completion(
            model=litellm.model,
            messages=[
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": f"You are a career assistant. Only answer questions about careers, jobs, job market, and skills. If the question is outside this scope, politely decline. Question: {data.message}"}
            ]
        )

        bot_response = response.choices[0].message.content

        if bot_response and bot_response.strip():
            return {"response": bot_response}
        else:
            return {"error": "Could not get response from the AI model."}

    except Exception as e:
        print(f"Error during AI API call: {e}")
        return {"error": "An error occurred while processing your request."}
