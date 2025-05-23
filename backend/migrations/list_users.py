from app import app
from models.user import User

def list_users():
    with app.app_context():
        users = User.query.all()
        print("\nMevcut Kullanıcılar:")
        print("-" * 50)
        for user in users:
            print(f"ID: {user.id}")
            print(f"Kullanıcı Adı: {user.username}")
            print(f"Ad Soyad: {user.full_name}")
            print(f"Rol: {user.role}")
            print("-" * 50)

if __name__ == "__main__":
    list_users() 