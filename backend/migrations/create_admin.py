from app import app
from models.user import User
from utils.hash_utils import hash_password

def create_admin():
    with app.app_context():
       
        admin = User(
            username="admin",
            password_hash=hash_password("123456"),
            full_name="Admin User",
            role="etut"
        )
        
        from database import db
        db.session.add(admin)
        db.session.commit()
        print("Admin kullanıcısı başarıyla oluşturuldu.")

if __name__ == "__main__":
    create_admin() 