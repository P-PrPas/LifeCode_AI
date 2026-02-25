import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

# The system will pull the API key from GEMINI_API_KEY environment variable.
client = genai.Client()

def get_life_code_analysis(prompt_text: str) -> str:
    try:
        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=prompt_text
        )
        return response.text
    except Exception as e:
        return f"Error generating analysis from Gemini: {str(e)}"
