from models.schedule import Schedule
from models.user import User
from database import db

DEFAULT_TOPICS = [
    'Temel Kavramlar', 'Sayılar', 'Bölme ve Bölünebilme', 'Asal Çarpanlar',
    'EBOB-EKOK', 'Rasyonel Sayılar', 'Ondalık Sayılar', 'Basit Eşitsizlikler',
    'Mutlak Değer', 'Üslü Sayılar', 'Köklü Sayılar', 'Çarpanlara Ayırma',
    'Oran-Orantı', 'Problemler', 'Kümeler', 'Fonksiyonlar'
]
MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
          'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
WEEKS = [1, 2, 3, 4]
LESSON = 'Matematik'

def add_default_schedule_for_user(user_id):
    # Önce eski programı sil
    db.session.query(Schedule).filter_by(user_id=user_id, lesson_name=LESSON).delete()
    db.session.commit()
    topic_idx = 0
    for m in MONTHS:
        for w in WEEKS:
            if topic_idx < len(DEFAULT_TOPICS):
                konu = DEFAULT_TOPICS[topic_idx]
                s = Schedule(
                    user_id=user_id,
                    lesson_name=LESSON,
                    month=m,
                    week=w,
                    konu=konu,
                    sure='1 hafta'
                )
                db.session.add(s)
                topic_idx += 1
    db.session.commit() 