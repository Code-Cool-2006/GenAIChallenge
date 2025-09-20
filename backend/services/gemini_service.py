import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# --- Gemini API Configuration ---
try:
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY not found in environment variables.")
    genai.configure(api_key=GEMINI_API_KEY)
    # Initialize the Generative Model
    model = genai.GenerativeModel('gemini-1.5-flash')
except Exception as e:
    print(f"Error configuring Gemini API: {e}")
    model = None

# --- Service Functions ---

def generate_career_path(job_title: str) -> str:
    """
    Generates a career path roadmap using the Gemini API.

    Args:
        job_title: The career title entered by the user.

    Returns:
        A formatted string containing the AI-generated career path.
    """
    if not model:
        return "Error: Gemini AI model is not configured. Please check the API key."

    prompt = f"""
    Act as an expert career coach. A user wants to become a '{job_title}'.
    Provide a clear, encouraging, and structured career roadmap for them.
    The response must be in Markdown format and include these three sections exactly as titled below:

    ### 🚀 Potential Career Path
    List 3-5 potential roles, starting from an entry-level position and progressing upwards.

    ### 🔧 Key Skills to Master
    List 5-7 crucial technical and soft skills required for a '{job_title}'. Briefly explain why each is important.

    ### 🤔 Sample Interview Questions
    Provide 3 insightful interview questions for a '{job_title}' role: one behavioral, one technical, and one situational.
    """
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"An error occurred while calling the Gemini API: {e}")
        return "Sorry, there was an issue generating the career path. Please try again later."


def generate_interview_feedback(question: str, user_answer: str) -> str:
    """
    Generates feedback for a user's answer to an interview question using the Gemini API.

    Args:
        question: The interview question asked.
        user_answer: The user's answer to the question.

    Returns:
        A formatted string containing AI-generated feedback.
    """
    if not model:
        return "Error: Gemini AI model is not configured. Please check the API key."

    prompt = f"""
    Act as a friendly but professional FAANG interviewer. A candidate was asked the following question:
    **Question:** "{question}"

    Here is their answer:
    **Answer:** "{user_answer}"

    Please provide constructive feedback on their answer in Markdown format. The feedback should include:
    1.  **Overall Impression:** A brief summary of how they did.
    2.  **Strengths:** 2-3 bullet points on what was good about their answer.
    3.  **Areas for Improvement:** 2-3 bullet points with specific, actionable advice on how they could make their answer better.
    Keep the tone encouraging and helpful.
    """
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"An error occurred while calling the Gemini API: {e}")
        return "Sorry, there was an issue generating feedback. Please try again later."

