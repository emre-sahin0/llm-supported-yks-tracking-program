from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, login_required
from services.auth_service import register_user, authenticate_user
from flask_login import current_user, logout_user
from models.user import User

# Etüt merkezi kayıt anahtarı
ETUT_REGISTRATION_KEY = "ETUT2024KEY"  # Bu anahtarı güvenli bir yerde saklamalısınız

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        required_fields = ['username', 'password', 'full_name', 'role']
        
        # Gerekli alanların kontrolü
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

