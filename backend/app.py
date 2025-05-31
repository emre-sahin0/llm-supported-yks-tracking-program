## === app.py ===
from flask import Flask, jsonify
from dotenv import load_dotenv
from dotenv import load_dotenv
import os

from config import Config
from database import db
from flask_login import LoginManager
from models.user import User
from models.net_record import NetRecord
from utils.hash_utils import bcrypt
from routes.auth_routes import auth_bp
from routes.topic_routes import topic_bp
from flask_cors import CORS
from routes.net_routes import net_bp
from routes.schedule_routes import schedule_bp
from routes.ai_routes import ai_bp
from routes.ai_questions import ai_questions_bp


load_dotenv()
app = Flask(__name__)
app.config.from_object(Config)

# Session ve CORS ayarları
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['REMEMBER_COOKIE_HTTPONLY'] = True
app.config['REMEMBER_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_DOMAIN'] = None
app.config['SESSION_COOKIE_PATH'] = '/'

# CORS ayarları
CORS(app, 
     supports_credentials=True, 
     resources={r"/*": {"origins": ["http://localhost:3000"], "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"], "allow_headers": ["Content-Type", "Authorization"], "expose_headers": ["Content-Type", "Authorization"]}},
     allow_credentials=True)

# Load environment variables
print("POSTGRES_PASSWORD:", os.environ.get("POSTGRES_PASSWORD"))
print("GEMINI_API_KEY:", os.environ.get("GEMINI_API_KEY"))

# Init extensions
db.init_app(app)
bcrypt.init_app(app)
login_manager = LoginManager(app)
login_manager.login_view = 'auth.login'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))
@login_manager.unauthorized_handler
def unauthorized():
    return jsonify({'message': 'Yetkisiz erişim'}), 401

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(topic_bp, url_prefix='')
app.register_blueprint(net_bp, url_prefix='')
app.register_blueprint(schedule_bp, url_prefix='')
app.register_blueprint(ai_bp, url_prefix='/api/ai')
app.register_blueprint(ai_questions_bp, url_prefix='/api/ai-questions')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        print('--- ROUTES ---')
        for rule in app.url_map.iter_rules():
            print(rule)
    app.run(debug=True)