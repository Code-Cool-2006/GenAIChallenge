import os
import re
import litellm
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# --- LiteLLM Configuration ---
# Set the model to use, e.g., 'openai/gpt-4o' for image support
litellm.model = os.getenv("LITELLM_MODEL", "openai/gpt-4o")

# Set API keys
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY", "")
os.environ["GEMINI_API_KEY"] = os.getenv("GEMINI_API_KEY", "")

# Fallback models if needed
litellm.fallbacks = [
    {"openai/gpt-4o": ["openai/gpt-4o-mini"]},
    {"gemini/gemini-1.5-flash": ["openai/gpt-4o"]}
]

# --- Service Functions ---

def generate_career_path(job_title: str) -> str:
    """
    Generates a career path roadmap using LiteLLM.

    Args:
        job_title: The career title entered by the user.

    Returns:
        A formatted string containing the AI-generated career path.
    """
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
        response = litellm.completion(
            model=litellm.model,
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"An error occurred while calling the AI API: {e}")
        return "Sorry, there was an issue generating the career path. Please try again later."


def generate_interview_questions(role: str) -> list[str]:
    """
    Generates 8 interview questions for a given role using LiteLLM.

    Args:
        role: The job role for which to generate questions.

    Returns:
        A list of 8 interview questions.
    """
    prompt = f"""
    Act as an expert interviewer. Generate 8 professional interview questions for the role of {role}.
    The questions should be diverse, covering behavioral, technical, and situational aspects.
    Number them 1-8 and make each question on a new line.
    Do not include any additional text or explanations.
    """
    try:
        response = litellm.completion(
            model=litellm.model,
            messages=[{"role": "user", "content": prompt}]
        )
        generated_text = response.choices[0].message.content
        # Split questions by new lines and filter out empty lines
        questions = generated_text.split("\n")
        questions = [q.strip() for q in questions if q.strip()]
        # Remove numbering if present
        questions = [re.sub(r"^\d+\.\s*", "", q) for q in questions]
        return questions[:8]  # Ensure we return exactly 8 questions
    except Exception as e:
        print(f"An error occurred while calling the AI API: {e}")
        return []

def generate_interview_feedback(question: str, user_answer: str) -> str:
    """
    Generates feedback for a user's answer to an interview question using LiteLLM.

    Args:
        question: The interview question asked.
        user_answer: The user's answer to the question.

    Returns:
        A formatted string containing AI-generated feedback.
    """
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
        response = litellm.completion(
            model=litellm.model,
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"An error occurred while calling the AI API: {e}")
        return "Sorry, there was an issue generating feedback. Please try again later."

