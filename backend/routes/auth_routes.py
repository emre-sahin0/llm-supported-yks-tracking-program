from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from services.auth_service import register_user, authenticate_user
from flask_login import current_user, logout_user
from models.user import User
from database import db
from utils.hash_utils import hash_password, check_password
from models.net_record import NetRecord
from models.user_topic import UserTopic
from models.topic import Topic
from models.question import Question
from datetime import datetime, timedelta
from flask import session
from config import Config
from utils.default_schedule import add_default_schedule_for_user

# confige taşadı
ETUT_REGISTRATION_KEY = Config.ETUT_REGISTRATION_KEY

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        required_fields = ['username', 'password', 'full_name', 'role']
        
        # Gerekli alan kontrolü
        for field in required_fields:
            if field not in data:
                return jsonify({'message': f'{field} alanı gereklidir'}), 400
        
        # Rol kontrolü
        if data['role'] not in ['student', 'etut']:
            return jsonify({'message': 'Geçersiz rol. Sadece "student" veya "etut" olabilir'}), 400
        
        # Etüt merkezi kaydı için anahtar kontrolü
        if data['role'] == 'etut':
            if 'registration_key' not in data:
                return jsonify({'message': 'Etüt merkezi kaydı için özel anahtar gereklidir'}), 400
            if data['registration_key'] != ETUT_REGISTRATION_KEY:
                return jsonify({'message': 'Geçersiz kayıt anahtarı'}), 401
        
        # Kullanıcı adı kontrolü
        existing_user = User.query.filter_by(username=data['username']).first()
        if existing_user:
            return jsonify({'message': 'Bu kullanıcı adı zaten kullanılıyor'}), 400
        
        user = register_user(data['username'], data['password'], data['full_name'], data['role'])
        # Default pragra eklee
        add_default_schedule_for_user(user.id)
        return jsonify({
            'message': 'Kayıt başarılı',
            'username': user.username,
            'role': user.role
        })
    except Exception as e:
        return jsonify({'message': f'Kayıt sırasında bir hata oluştu: {str(e)}'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = authenticate_user(data['username'], data['password'])
    if user:
        login_user(user)
        return jsonify({
            'message': 'Giriş başarılı',
            'role': user.role,
            'username': user.username
        })
    return jsonify({'message': 'Hatalı giriş'}), 401

@auth_bp.route('/logout', methods=['GET'])
def logout():
    if current_user.is_authenticated:
        logout_user()
    return jsonify({'message': 'Çıkış yapıldı'})

@auth_bp.route('/settings', methods=['GET'])
@login_required
def get_settings():
    return jsonify({
        'username': current_user.username,
        'full_name': current_user.full_name,
        'role': current_user.role
    })

@auth_bp.route('/settings', methods=['PUT'])
@login_required
def update_settings():
    data = request.json
    user = User.query.get(current_user.id)
    
    if 'full_name' in data:
        user.full_name = data['full_name']
    
    if 'profile_photo' in data:
        user.profile_photo = data['profile_photo']
    
    if 'current_password' in data and 'new_password' in data:
        if not check_password(user.password_hash, data['current_password']):
            return jsonify({'message': 'Mevcut şifre yanlış'}), 400
        user.password_hash = hash_password(data['new_password'])
    
    db.session.commit()
    return jsonify({'message': 'Ayarlar güncellendi'})

@auth_bp.route('/students', methods=['GET'])
@login_required
def get_students():
    
    if current_user.role != 'etut':
        return jsonify({'message': 'Bu işlem için yetkiniz yok'}), 403
    
    students = User.query.filter_by(role='student').all()
    return jsonify([{
        'id': student.id,
        'username': student.username,
        'full_name': student.full_name,
        'created_at': student.created_at.isoformat()
    } for student in students])

@auth_bp.route('/students/<int:student_id>', methods=['DELETE'])
@login_required
def delete_student(student_id):
   
    if current_user.role != 'etut':
        return jsonify({'message': 'Bu işlem için yetkiniz yok'}), 403
    
    student = User.query.get_or_404(student_id)
    if student.role != 'student':
        return jsonify({'message': 'Sadece öğrenci hesapları silinebilir'}), 400
    
    db.session.delete(student)
    db.session.commit()
    return jsonify({'message': 'Öğrenci başarıyla silindi'})

@auth_bp.route('/students/<int:student_id>/details', methods=['GET'])
@login_required
def get_student_details(student_id):
    
    if current_user.role != 'etut':
        return jsonify({'message': 'Bu işlem için yetkiniz yok'}), 403
    
    student = User.query.get_or_404(student_id)
    if student.role != 'student':
        return jsonify({'message': 'Sadece öğrenci detayları görüntülenebilir'}), 400

   
    net_records = NetRecord.query.filter_by(user_id=student_id).all()
    total_net_records = len(net_records)
    last_net_date = net_records[-1].tarih if net_records else None

    # Konu istatistikleri
    user_topics = UserTopic.query.filter_by(user_id=student_id).all()
    completed_topics = len([ut for ut in user_topics if ut.is_completed])
    total_topics = Topic.query.count()
    completion_rate = round((completed_topics / total_topics * 100) if total_topics > 0 else 0, 2)

    # Soru istatistikleri (dinamik veritabanı sorgusu)
    solved_questions = Question.query.filter_by(user_id=student_id).count()
    correct_answers = db.session.query(db.func.sum(Question.correct)).filter_by(user_id=student_id).scalar() or 0
    success_rate = round((correct_answers / solved_questions * 100) if solved_questions > 0 else 0, 2)

    return jsonify({
        'total_net_records': total_net_records,
        'last_net_date': last_net_date,
        'completed_topics': completed_topics,
        'total_topics': total_topics,
        'completion_rate': completion_rate,
        'solved_questions': solved_questions,
        'correct_answers': correct_answers,
        'success_rate': success_rate
    })

@auth_bp.route('/activities', methods=['GET'])
@login_required
def get_activities():
   
    activities = []
    
    recent_topics = db.session.query(UserTopic, Topic).join(Topic).filter(
        UserTopic.user_id == current_user.id,
        UserTopic.is_completed == True,
        UserTopic.date_marked != None,
        UserTopic.date_marked >= (datetime.now() - timedelta(days=7)).date()
    ).order_by(UserTopic.date_marked.desc()).limit(5).all()
    
    for user_topic, topic in recent_topics:
        topic_name = getattr(topic, 'name', None) or getattr(topic, 'topic_title', '')
        activities.append({
            'type': 'topic',
            'title': 'Yeni Konu Tamamlandı',
            'description': topic_name,
            'timestamp': user_topic.date_marked.isoformat() if user_topic.date_marked else '',
            'icon': 'book'
        })
    

    recent_questions = db.session.query(Question).filter(
        Question.user_id == current_user.id,
        Question.created_at >= datetime.now() - timedelta(days=7)
    ).order_by(Question.created_at.desc()).limit(5).all()
    
    for question in recent_questions:
        activities.append({
            'type': 'question',
            'title': 'Yeni Soru Eklendi',
            'description': f'{question.count} soru çözüldü',
            'timestamp': question.created_at.isoformat(),
            'icon': 'question-circle'
        })
    
   
    recent_nets = db.session.query(NetRecord).filter(
        NetRecord.user_id == current_user.id,
        NetRecord.created_at >= datetime.now() - timedelta(days=7)
    ).order_by(NetRecord.created_at.desc()).limit(5).all()
    
    for net in recent_nets:
        activities.append({
            'type': 'net',
            'title': 'Yeni Net Kaydedildi',
            'description': f'{net.exam_type}: {net.total_net} net',
            'timestamp': net.created_at.isoformat(),
            'icon': 'chart-line'
        })
    
   
    activities.sort(key=lambda x: x['timestamp'], reverse=True)
    
    return jsonify(activities)

@auth_bp.route('/questions', methods=['GET'])
@login_required
def get_questions():
    questions = Question.query.filter_by(user_id=current_user.id).order_by(Question.created_at.desc()).all()
    return jsonify([q.to_dict() for q in questions])

@auth_bp.route('/questions', methods=['POST'])
@login_required
def add_question():
    data = request.json
    required_fields = ['lesson', 'count', 'correct']
    for field in required_fields:
        if field not in data:
            return jsonify({'message': f'{field} alanı gereklidir'}), 400
    try:
        question = Question(
            user_id=current_user.id,
            lesson=data['lesson'],
            count=int(data['count']),
            correct=int(data['correct'])
        )
        db.session.add(question)
        db.session.commit()
        return jsonify(question.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Soru kaydı eklenirken bir hata oluştu: {str(e)}'}), 500

