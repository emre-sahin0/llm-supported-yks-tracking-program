from database import db
from flask_login import UserMixin

class User(UserMixin, db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(10), nullable=False)
    full_name = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    # İlişkiler (cascade delete için)
    net_records = db.relationship('NetRecord', cascade='all, delete-orphan', backref='user')
    questions = db.relationship('Question', cascade='all, delete-orphan', backref='user')
    schedules = db.relationship('Schedule', cascade='all, delete-orphan', backref='user')
    user_topics = db.relationship('UserTopic', cascade='all, delete-orphan', backref='user')