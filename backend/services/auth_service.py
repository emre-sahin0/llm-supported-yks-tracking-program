from models.user import User
from database import db
from utils.hash_utils import hash_password, check_password

def register_user(username, password, full_name, role):
    user = User(
        username=username,
        password_hash=hash_password(password),
        full_name=full_name,
        role=role
    )
    db.session.add(user)
    db.session.commit()
    return user

def authenticate_user(username, password):
    user = User.query.filter_by(username=username).first()
    if user and check_password(user.password_hash, password):
        return user
    return None
