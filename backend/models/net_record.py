from database import db
from datetime import datetime

class NetRecord(db.Model):
    __tablename__ = 'net_records'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    exam_type = db.Column(db.String(50), nullable=False)  # TYT, AYT, vb.
    total_net = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    tarih = db.Column(db.Date, nullable=False)

    def __init__(self, user_id, exam_type, total_net, tarih):
        self.user_id = user_id
        self.exam_type = exam_type
        self.total_net = total_net
        self.tarih = tarih

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'exam_type': self.exam_type,
            'total_net': self.total_net,
            'created_at': self.created_at.isoformat(),
            'tarih': self.tarih.isoformat()
        } 