from database import db
from app import app
from sqlalchemy import text

def reset_database():
    with app.app_context():
        try:
            # Tüm tablo sil (CASCADE ile)
            db.session.execute(text("""
                DROP TABLE IF EXISTS net_records CASCADE;
                DROP TABLE IF EXISTS questions CASCADE;
                DROP TABLE IF EXISTS user_topics CASCADE;
                DROP TABLE IF EXISTS topics CASCADE;
                DROP TABLE IF EXISTS net_entries CASCADE;
                DROP TABLE IF EXISTS users CASCADE;
            """))
            db.session.commit()
            print("Tüm tablolar silindi.")
            
            
            db.create_all()
            print("Tablolar yeniden oluşturuldu.")
            
        except Exception as e:
            print(f"Hata oluştu: {str(e)}")
            db.session.rollback()

if __name__ == "__main__":
    reset_database() 