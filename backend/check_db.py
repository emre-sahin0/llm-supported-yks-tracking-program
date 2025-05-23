from app import app, db
from models.user import User
from models.net_record import NetRecord
from models.topic import Topic
from models.schedule import Schedule

def print_table_contents():
    with app.app_context():
        print("\n=== KULLANICILAR ===")
        users = User.query.all()
        for user in users:
            print(f"ID: {user.id}, Kullanıcı Adı: {user.username}, Rol: {user.role}, Ad Soyad: {user.full_name}")

        print("\n=== NET KAYITLARI ===")
        net_records = NetRecord.query.all()
        for record in net_records:
            print(f"ID: {record.id}, Kullanıcı ID: {record.user_id}, Sınav Tipi: {record.exam_type}, Net: {record.total_net}, Tarih: {record.tarih}")

        print("\n=== KONULAR ===")
        topics = Topic.query.all()
        for topic in topics:
            print(f"ID: {topic.id}, Ders: {topic.lesson_name}, Konu: {topic.topic_title}, Açıklama: {topic.explanation}")

        print("\n=== PROGRAMLAR ===")
        schedules = Schedule.query.all()
        for schedule in schedules:
            print(f"ID: {schedule.id}, Kullanıcı ID: {schedule.user_id}, Tarih: {schedule.date}")

if __name__ == "__main__":
    print_table_contents() 