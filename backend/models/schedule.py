from database import db

class Schedule(db.Model):
    __tablename__ = 'schedules'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    lesson_name = db.Column(db.String(50), nullable=False)
   
    month = db.Column(db.String(20), nullable=False)  # Örn: Ocak
    week = db.Column(db.Integer, nullable=False)      # 1, 2,3, 4
    konu = db.Column(db.String(100), nullable=False)  # Konu adı
    sure = db.Column(db.String(20))                   # Süre (opsiyonel)
   
    day_of_week = db.Column(db.String(10))
    start_time = db.Column(db.Time)
    end_time = db.Column(db.Time)