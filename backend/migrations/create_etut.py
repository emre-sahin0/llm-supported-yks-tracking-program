from database import db
from app import app
from models.user import User
from utils.hash_utils import hash_password

def create_etut_user():
    with app.app_context():
        #  var olup olmama  kontrolü
        existing_user = User.query.filter_by(username='etut').first()
        if existing_user:
            print("Etüt merkezi kullanıcısı zaten mevcut.")
            return

        
        etut_user = User(
            username='etut',
            password_hash=hash_password('123456'),
            full_name='Etüt Merkezi',
            role='etut'
        )
        
        db.session.add(etut_user)
        db.session.commit()
        print("Etüt merkezi kullanıcısı oluşturuldu.")
        print("Kullanıcı adı: etut")
        print("Şifre: 123456")

if __name__ == "__main__":
    create_etut_user() 