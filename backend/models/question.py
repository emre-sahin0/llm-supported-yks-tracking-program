from database import db
from datetime import datetime
from models.user import User

class Question(db.Model):
    __tablename__ = 'questions'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    count = db.Column(db.Integer, nullable=False)  # Çözülen soru sayısı
    correct = db.Column(db.Integer, nullable=False)  # Doğru sayısı
    lesson = db.Column(db.String(50), nullable=False)  # Ders adı
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, user_id, count, correct, lesson):
        self.user_id = user_id
        self.count = count
        self.correct = correct
        self.lesson = lesson

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'count': self.count,
            'correct': self.correct,
            'lesson': self.lesson,
            'created_at': self.created_at.isoformat()
        } 