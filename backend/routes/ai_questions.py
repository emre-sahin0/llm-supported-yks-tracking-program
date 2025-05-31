from flask import Blueprint, request, jsonify
from config import analyze_with_gemini

ai_questions_bp = Blueprint('ai_questions', __name__)

@ai_questions_bp.route('/generate_questions', methods=['POST'])
def generate_questions():
    data = request.get_json()
    konu_adi = data.get('konu_adi')
    if not konu_adi:
        return jsonify({'error': 'Konu adı gerekli!'}), 400

    prompt = f"""
Lütfen '{konu_adi}' konusunda 2 adet çoktan seçmeli soru üret. Her soru için 4 şık (A, B, C, D) ve doğru cevabı belirt. Sonucu sadece JSON array olarak döndür:
[
  {{
    "soru": "...",
    "secenekler": ["A) ...", "B) ...", "C) ...", "D) ..."],
    "dogru": "A"
  }},
  ...
]
"""
    try:
        ai_response = analyze_with_gemini(prompt)
        print('Gemini Soru Yanıtı:', ai_response)
        if not ai_response or (isinstance(ai_response, dict) and ai_response.get('error')):
            return jsonify({'error': 'AI yanıtı alınamadı veya boş döndü.', 'raw': ai_response}), 500
        # Gemini'den dönen cevaptan JSON kısmını ayıkla
        import re, json
        match = re.search(r'\[.*\]', ai_response['candidates'][0]['content']['parts'][0]['text'], re.DOTALL)
        if match:
            questions = json.loads(match.group(0))
            return jsonify({'sorular': questions})
        else:
            print('AI yanıtı (format hatası):', ai_response)
            return jsonify({'error': 'AI yanıtı beklenen formatta değil.', 'raw': ai_response}), 500
    except Exception as e:
        import traceback
        print('AI soru üretiminde hata:', traceback.format_exc())
        return jsonify({'error': str(e)}), 500

@ai_questions_bp.route('/evaluate_answers', methods=['POST'])
def evaluate_answers():
    data = request.get_json()
    user_answers = data.get('user_answers')  # ör: ['A', 'B', 'C', 'D', 'A']
    correct_answers = data.get('correct_answers')  # ör: ['A', 'C', 'C', 'B', 'A']
    if not user_answers or not correct_answers or len(user_answers) != len(correct_answers):
        return jsonify({'error': 'Cevaplar eksik veya uzunluklar eşleşmiyor!'}), 400

    correct_count = sum([u == c for u, c in zip(user_answers, correct_answers)])
    if correct_count == len(correct_answers):
        feedback = 'Çok iyisin!'
    elif correct_count >= len(correct_answers) - 1:
        feedback = 'Gayet iyi gidiyorsun!'
    else:
        feedback = 'Biraz daha çalışmalısın!'
    return jsonify({'dogru_sayisi': correct_count, 'toplam': len(correct_answers), 'feedback': feedback}) 