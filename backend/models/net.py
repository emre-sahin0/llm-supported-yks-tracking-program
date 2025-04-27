from database import db
from datetime import datetime

class NetRecord(db.Model):
    __tablename__ = 'net_records'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    tarih = db.Column(db.String(50), nullable=False)
    
    tyt_turkce = db.Column(db.Float, default=0)
    tyt_matematik = db.Column(db.Float, default=0)
    tyt_sosyal = db.Column(db.Float, default=0)
    tyt_fen = db.Column(db.Float, default=0)

    ayt_matematik = db.Column(db.Float, default=0)
    ayt_fizik = db.Column(db.Float, default=0)
    ayt_kimya = db.Column(db.Float, default=0)
    ayt_biyoloji = db.Column(db.Float, default=0)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
