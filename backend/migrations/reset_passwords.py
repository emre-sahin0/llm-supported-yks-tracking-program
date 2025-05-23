from database import db
from models.user import User
from utils.hash_utils import hash_password

def reset_all_passwords():
    
    users = User.query.all()
    
    # Her kullanıcı için şifreyi 123456 olarak sıfırla
    for user in users:
        user.password_hash = hash_password("123456")
    
    # Değişikkaydet
    db.session.commit()
    
    print("Tüm kullanıcıların şifreleri '123456' olarak sıfırlandı.")

if __name__ == "__main__":
    from app import app
    with app.app_context():
        reset_all_passwords() 