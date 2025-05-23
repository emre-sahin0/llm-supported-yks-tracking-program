from app import app, db
from models.schedule import Schedule
from models.user import User

# Örnek konular 
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
with app.app_context():
    user = User.query.filter_by(username='emre1').first()  
    if not user:
        print('Kullanıcı bulunamadı!')
        exit(1)
    db.session.query(Schedule).filter_by(user_id=user.id, lesson_name=LESSON).delete()
    db.session.commit()
    topic_idx = 0
    for m in MONTHS:
        for w in WEEKS:
            if topic_idx < len(DEFAULT_TOPICS):
                konu = DEFAULT_TOPICS[topic_idx]
                s = Schedule(
                    user_id=user.id,
                    lesson_name=LESSON,
                    month=m,
                    week=w,
                    konu=konu,
                    sure='1 hafta'
                )
                db.session.add(s)
                topic_idx += 1
    db.session.commit()
    print('Default program başarıyla eklendi!') 