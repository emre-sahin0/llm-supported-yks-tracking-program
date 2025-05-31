from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from models.question import Question
from models.topic import Topic
from models.user_topic import UserTopic
from database import db
from datetime import datetime, timedelta
import os
import requests
from config import Config
from models.net_record import NetRecord
from collections import defaultdict

ai_bp = Blueprint('ai', __name__)

# Hugging Face API endpoint'i
API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2"
API_KEY = Config.HUGGINGFACE_API_KEY
headers = {"Authorization": f"Bearer {API_KEY}"}

GOOGLE_API_KEY = Config.GEMINI_API_KEY
MODEL = "gemini-1.5-flash"
API_URL_GOOGLE = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={GOOGLE_API_KEY}"

@ai_bp.route('/students/<int:student_id>/data', methods=['GET'])
def get_student_data(student_id):
    try:
        student_id = 8  # Geçici olarak user1'in id'si
        from models.net_record import NetRecord
        print('Student ID:', student_id)
        print('NetRecord count:', db.session.query(NetRecord).filter(NetRecord.user_id == student_id).count())
        print('Question count:', db.session.query(Question).filter(Question.user_id == student_id).count())
        print('All NetRecords:', db.session.query(NetRecord).filter(NetRecord.user_id == student_id).all())
        print('All Questions:', db.session.query(Question).filter(Question.user_id == student_id).all())
        # Son 30 günlük soru çözüm sayısı
        thirty_days_ago = datetime.now() - timedelta(days=30)
        monthly_questions = db.session.query(db.func.sum(Question.count)).filter(
            Question.user_id == student_id,
            Question.created_at >= thirty_days_ago
        ).scalar() or 0

        # Tüm net kayıtlarını çek
        net_records = db.session.query(NetRecord).filter(NetRecord.user_id == student_id).order_by(NetRecord.tarih).all()
        net_records_list = [
            {
                'exam_type': n.exam_type,
                'total_net': n.total_net,
                'tarih': n.tarih.isoformat() if n.tarih else ''
            } for n in net_records
        ]

        # Tamamlanan konular
        completed_topics = db.session.query(Topic).join(UserTopic).filter(
            UserTopic.user_id == student_id,
            UserTopic.is_completed == True
        ).all()

        # Son 7 günlük aktivite
        recent_activity = Question.query.filter(
            Question.user_id == student_id,
            Question.created_at >= datetime.now() - timedelta(days=7)
        ).order_by(Question.created_at.desc()).all()

        daily_questions = {}
        for question in recent_activity:
            date_str = question.created_at.strftime('%Y-%m-%d')
            if date_str not in daily_questions:
                daily_questions[date_str] = 0
            daily_questions[date_str] += question.count

        # Son 6 ay için aylık toplam soru sayısı
        monthly_question_counts = defaultdict(int)
        all_questions = Question.query.filter(Question.user_id == student_id).all()
        for q in all_questions:
            if q.created_at:
                month = q.created_at.strftime('%Y-%m')
                monthly_question_counts[month] += q.count

        return jsonify({
            'totalQuestions': db.session.query(db.func.sum(Question.count)).filter(Question.user_id == student_id).scalar() or 0,
            'monthlyQuestions': monthly_questions,
            'netRecords': net_records_list,
            'completedTopics': [getattr(topic, 'name', getattr(topic, 'topic_title', '')) for topic in completed_topics],
            'recentActivity': daily_questions,
            'monthlyQuestionCounts': dict(monthly_question_counts)
        })
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'message': 'Sunucu hatası', 'error': str(e)}), 500

@ai_bp.route('/analyze', methods=['POST'])
def analyze():
    try:
        data = request.json
        student_id = data.get('studentId')
        student_data = data.get('data')

        if not student_id or not student_data:
            return jsonify({'message': 'Geçersiz veri formatı'}), 400

        # Sadece bu ayın TYT ve AYT net kayıtlarını hazırla
        from datetime import datetime
        now = datetime.now()
        this_month = now.strftime('%Y-%m')
        this_month_records = [rec for rec in student_data.get('netRecords', []) if rec.get('tarih', '').startswith(this_month)]
        tyt_records = [rec for rec in this_month_records if 'tyt' in (rec.get('exam_type') or '').lower()]
        ayt_records = [rec for rec in this_month_records if 'ayt' in (rec.get('exam_type') or '').lower()]
        net_records_text = ''
        if tyt_records:
            net_records_text += '\nTYT Sınavları:\n' + '\n'.join([
                f"- {rec['tarih'][:10]} | {rec['exam_type']}: {rec['total_net']} net" for rec in tyt_records
            ])
        if ayt_records:
            net_records_text += '\nAYT Sınavları:\n' + '\n'.join([
                f"- {rec['tarih'][:10]} | {rec['exam_type']}: {rec['total_net']} net" for rec in ayt_records
            ])

        # Danışman promptu oluştur
        prompt = f"""
        Sen bir YKS hazırlık ve sınav danışmanısın. Aşağıdaki öğrenci verilerine ve bu ayın net kayıtlarına göre kısa ve öz bir analiz yap:

        Öğrenci Performans Verileri:
        - Bu Ay Çözülen Soru: {student_data['monthlyQuestions']}
        - Tamamlanan Konular: {', '.join(student_data['completedTopics'])}

        Net Kayıtları (Tarih, Sınav Türü, Net):
        {net_records_text}

        Lütfen aşağıdaki formatta yanıt ver:
        1. Kısa Değerlendirme (2-3 cümle)
        2. Öneriler (3-4 madde)
        3. Hedefler (2-3 madde)

        Not: Yanıtını Türkçe olarak ver ve çok kısa tut. Netlerdeki değişimi ve gelişimi özellikle vurgula.
        """
        print('AI PROMPT (Gemini):')
        print(prompt)

        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": prompt}
                    ]
                }
            ]
        }
        response = requests.post(API_URL_GOOGLE, headers=headers, json=payload)
        print('Google Gemini ANALYZE status:', response.status_code)
        print('Google Gemini ANALYZE response:', response.text)
        if response.status_code == 200:
            result = response.json()
            try:
                answer = result['candidates'][0]['content']['parts'][0]['text']
            except Exception:
                answer = str(result)
            return jsonify({'recommendations': answer})
        else:
            return jsonify({'message': 'AI analizi sırasında bir hata oluştu', 'error': response.text}), 500
    except Exception as e:
        return jsonify({'message': 'AI analizi sırasında bir hata oluştu', 'error': str(e)}), 500

@ai_bp.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        message = data.get('message')
        if not message:
            return jsonify({'error': True, 'message': 'Mesaj gerekli'}), 400
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": message}
                    ]
                }
            ]
        }
        response = requests.post(API_URL_GOOGLE, headers=headers, json=payload)
        print('Google Gemini API status:', response.status_code)
        print('Google Gemini API response:', response.text)
        if response.status_code == 200:
            result = response.json()
            # Yanıtı metin olarak çek
            try:
                answer = result['candidates'][0]['content']['parts'][0]['text']
            except Exception:
                answer = str(result)
            return jsonify({'error': False, 'answer': answer})
        else:
            return jsonify({'error': True, 'message': response.text}), 500
    except Exception as e:
        return jsonify({'error': True, 'message': str(e)}), 500 