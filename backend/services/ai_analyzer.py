import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

def get_life_code_analysis(prompt_text: str, api_key: str = None) -> str:
    try:
        # Use provided API key or fall back to environment variable
        if api_key:
            client = genai.Client(api_key=api_key)
        else:
            client = genai.Client()  # Uses GEMINI_API_KEY env var
        
        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=prompt_text
        )
        return response.text
    except Exception as e:
        return f"Error generating analysis from Gemini: {str(e)}"
