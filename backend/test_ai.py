import requests

API_KEY = "AIzaSyDWab6-d508AEssTLRtbKLT2dcR5uCiHZk"  # Buraya kendi API anahtarını yaz
MODEL = "models/gemini-1.5-flash"  # veya "models/gemini-1.5-pro" da kullanabilirsin
API_URL = f"https://generativelanguage.googleapis.com/v1/{MODEL}:generateContent?key={API_KEY}"

headers = {
    "Content-Type": "application/json"
}

data = {
    "contents": [
        {
            "parts": [
                {"text": "Merhaba"}
            ]
        }
    ]
}

response = requests.post(API_URL, headers=headers, json=data)
if response.status_code == 200:
    print("Başarılı! Yanıt:")
    print(response.json())
else:
    print("Hata kodu:", response.status_code)
    print("Hata mesajı:", response.text) 