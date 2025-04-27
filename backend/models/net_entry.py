from database import db

class NetEntry(db.Model):
    __tablename__ = 'net_entries'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    exam_type = db.Column(db.String(10), nullable=False)  # 'TYT' veya 'AYT'
    lesson_name = db.Column(db.String(50), nullable=False)
    correct = db.Column(db.Integer, default=0)
    wrong = db.Column(db.Integer, default=0)