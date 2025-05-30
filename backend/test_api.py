import requests

# 1. Login gerektirmeyen endpoint
url_settings = "http://localhost:5000/auth/settings"
resp_settings = requests.get(url_settings)
print("/auth/settings status:", resp_settings.status_code)
print("/auth/settings response:", resp_settings.text)

# 2. AI endpointi (login gerektirir, büyük ihtimalle 401 döner)
url_ai = "http://localhost:5000/api/ai/students/1/data"
resp_ai = requests.get(url_ai)
print("/api/ai/students/1/data status:", resp_ai.status_code)
print("/api/ai/students/1/data response:", resp_ai.text) 