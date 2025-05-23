from app import app
from database import db

def add_profile_photo_column():
    with app.app_context():
       
        db.session.execute('ALTER TABLE users ADD COLUMN profile_photo VARCHAR(255)')
        db.session.commit()
        print("profile_photo sütunu başarıyla eklendi.")

if __name__ == "__main__":
    add_profile_photo_column() 