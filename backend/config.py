import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'gizli_anahtar'
    SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:Admin.,.200101@localhost:5432/tez_proje'

    SQLALCHEMY_TRACK_MODIFICATIONS = False