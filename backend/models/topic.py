from database import db

class Topic(db.Model):
    __tablename__ = 'topics'

    id = db.Column(db.Integer, primary_key=True)
    lesson_name = db.Column(db.String(50), nullable=False)  # Örn: Matematik
    topic_title = db.Column(db.String(100), nullable=False)  # Örn: Üslü Sayılar
    explanation = db.Column(db.Text)  # Ek açıklama, opsiyonel