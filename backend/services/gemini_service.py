import os
import litellm
import google.generativeai as genai
from dotenv import load_dotenv
from langchain_litellm import ChatLiteLLM
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

# Load environment variables from .env file
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

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

# LangChain setup
llm = ChatLiteLLM(model="gemini/gemini-pro")

# --- Service Functions ---

def generate_career_path(job_title: str) -> str:
    """
    Generates a career path roadmap using LangChain for enhanced output.

    Args:
        job_title: The career title entered by the user.

    Returns:
        A formatted string containing the AI-generated career path.
    """
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an expert career coach providing structured career advice."),
        ("user", """
        A user wants to become a '{job_title}'.
        Provide a clear, encouraging, and structured career roadmap for them.
        The response must be in Markdown format and include these three sections exactly as titled below:

        ### 🚀 Potential Career Path
        List 3-5 potential roles, starting from an entry-level position and progressing upwards.

        ### 🔧 Key Skills to Master
        List 5-7 crucial technical and soft skills required for a '{job_title}'. Briefly explain why each is important.

        ### 🤔 Sample Interview Questions
        Provide 3 insightful interview questions for a '{job_title}' role: one behavioral, one technical, and one situational.
        """)
    ])

    try:
        chain = prompt | llm
        response = chain.invoke({"job_title": job_title})
        return response.content
    except Exception as e:
        print(f"An error occurred while calling the AI API: {e}")
        return "Sorry, there was an issue generating the career path. Please try again later."


def generate_interview_feedback(question: str, user_answer: str) -> str:
    """
    Generates feedback for a user's answer to an interview question using LangChain.

    Args:
        question: The interview question asked.
        user_answer: The user's answer to the question.

    Returns:
        A formatted string containing AI-generated feedback.
    """
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a friendly but professional FAANG interviewer providing constructive feedback."),
        ("user", """
        A candidate was asked the following question:
        **Question:** "{question}"

        Here is their answer:
        **Answer:** "{user_answer}"

        Please provide constructive feedback on their answer in Markdown format. The feedback should include:
        1.  **Overall Impression:** A brief summary of how they did.
        2.  **Strengths:** 2-3 bullet points on what was good about their answer.
        3.  **Areas for Improvement:** 2-3 bullet points with specific, actionable advice on how they could make their answer better.
        Keep the tone encouraging and helpful.
        """)
    ])

    try:
        chain = prompt | llm
        response = chain.invoke({"question": question, "user_answer": user_answer})
        return response.content
    except Exception as e:
        print(f"An error occurred while calling the AI API: {e}")
        return "Sorry, there was an issue generating feedback. Please try again later."


def analyze_resume(resume_text: str) -> dict:
    """
    Analyze a resume and provide insights using LangChain for structured JSON output.

    Args:
        resume_text (str): The text content of the resume.

    Returns:
        dict: Analysis results including strengths, weaknesses, and suggestions.
    """
    # Define the JSON structure we want
    parser = JsonOutputParser()
    format_instructions = parser.get_format_instructions()

    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a professional resume analyzer. Always respond with valid JSON."),
        ("user", f"""
        Analyze the following resume and provide a detailed analysis.

        Resume:
        {{resume_text}}

        {format_instructions}

        Provide the response in JSON format with the following structure:
        {{
            "overall_assessment": "string",
            "strengths": ["string"],
            "weaknesses": ["string"],
            "suggestions": ["string"],
            "ats_score": number
        }}
        """)
    ])

    try:
        # Create the chain
        chain = prompt | llm | parser

        # Run the chain
        result = chain.invoke({"resume_text": resume_text})

        return result
    except Exception as e:
        print(f"Error analyzing resume: {str(e)}")
        return {
            "overall_assessment": "Unable to analyze resume due to an error.",
            "strengths": [],
            "weaknesses": [],
            "suggestions": [],
            "ats_score": 0
        }


def generate_career_advice(user_profile: dict) -> str:
    """
    Generate personalized career advice based on user profile using LangChain.

    Args:
        user_profile (dict): User's profile information.

    Returns:
        str: Personalized career advice.
    """
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a career counselor providing personalized advice."),
        ("user", """
        Based on the following user profile, provide personalized career advice:

        Profile: {user_profile}

        Provide comprehensive career advice including:
        1. Career path recommendations
        2. Skill development suggestions
        3. Industry trends to watch
        4. Networking opportunities
        5. Short-term and long-term goals
        """)
    ])

    try:
        chain = prompt | llm
        response = chain.invoke({"user_profile": user_profile})
        return response.content
    except Exception as e:
        print(f"Error generating career advice: {str(e)}")
        return "Sorry, there was an issue generating career advice. Please try again later."
