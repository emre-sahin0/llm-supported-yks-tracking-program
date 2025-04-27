from database import db

class UserTopic(db.Model):
    __tablename__ = 'user_topics'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    topic_id = db.Column(db.Integer, db.ForeignKey('topics.id'), nullable=False)
    is_completed = db.Column(db.Boolean, default=False)
    date_marked = db.Column(db.Date)