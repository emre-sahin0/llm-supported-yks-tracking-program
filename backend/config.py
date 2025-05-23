import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'gizli_anahtar'
    host = 'db' if os.environ.get('DOCKER_ENV') else 'localhost'
    POSTGRES_PASSWORD = os.environ.get('POSTGRES_PASSWORD') or 'Admin.,.200101'
    SQLALCHEMY_DATABASE_URI = f'postgresql://postgres:{POSTGRES_PASSWORD}@{host}:5432/tez_proje'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    ETUT_REGISTRATION_KEY = os.environ.get('ETUT_REGISTRATION_KEY') or 'ETUT2024KEY'