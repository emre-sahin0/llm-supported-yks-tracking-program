import requests
import os
from dotenv import load_dotenv
load_dotenv()

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "defaultsecret")
    HUGGINGFACE_API_KEY = os.environ.get("HUGGINGFACE_API_KEY", "")
    GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
    GEMINI_MODEL = os.environ.get("GEMINI_MODEL", "gemini-1.5-flash")
    ETUT_REGISTRATION_KEY = os.environ.get("ETUT_REGISTRATION_KEY", "")
    
    # PostgreSQL Database configuration
    POSTGRES_USER = os.environ.get("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD = os.environ.get("POSTGRES_PASSWORD", "")
    POSTGRES_HOST = os.environ.get("POSTGRES_HOST", "localhost")
    POSTGRES_PORT = os.environ.get("POSTGRES_PORT", "5432")
    POSTGRES_DB = os.environ.get("POSTGRES_DB", "tez_proje")
    
    SQLALCHEMY_DATABASE_URI = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Application settings
    DEBUG = True
    TESTING = False
    
    # Session configuration
    SESSION_TYPE = 'filesystem'
    PERMANENT_SESSION_LIFETIME = 1800  # 30 minutes
    # Diğer config değişkenleri... 

def analyze_with_gemini(text):
    model = Config.GEMINI_MODEL
    api_key = Config.GEMINI_API_KEY
    api_url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"

    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0"
    }
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": text}
                ]
            }
        ]
    }
    print("API URL:", api_url)
    print("Payload:", payload)
    print("Headers:", headers)
    response = requests.post(api_url, headers=headers, json=payload)
    print("Gemini API response status:", response.status_code)
    print("Gemini API response text:", response.text)
    if not response.text.strip():
        return {"error": "Gemini API'dan boş yanıt geldi."}
    try:
        return response.json()
    except Exception as e:
        print("JSON parse hatası:", e)
        return {"error": "Yanıt JSON değil", "raw": response.text}

print("GEMINI_API_KEY:", Config.GEMINI_API_KEY) 