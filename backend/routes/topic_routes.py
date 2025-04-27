from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from models.topic import Topic
from models.user_topic import UserTopic
from database import db
from datetime import date
from utils.quiz_data import quiz_bank

topic_bp = Blueprint('topics', __name__)

@topic_bp.route('/topics/<lesson>', methods=['GET'])
@login_required
def get_topics(lesson):
    topics = Topic.query.filter_by(lesson_name=lesson).all()
    user_topic_ids = {ut.topic_id: ut.is_completed for ut in UserTopic.query.filter_by(user_id=current_user.id).all()}

    topic_list = []
    for topic in topics:
        topic_list.append({
            'id': topic.id,
            'title': topic.topic_title,
            'completed': user_topic_ids.get(topic.id, False)
        })
    return jsonify(topic_list)

@topic_bp.route('/topics/<int:topic_id>/complete', methods=['POST'])
@login_required
def complete_topic(topic_id):
    user_topic = UserTopic.query.filter_by(user_id=current_user.id, topic_id=topic_id).first()
    if not user_topic:
        user_topic = UserTopic(user_id=current_user.id, topic_id=topic_id, is_completed=True, date_marked=date.today())
        db.session.add(user_topic)
    else:
        user_topic.is_completed = True
        user_topic.date_marked = date.today()
    db.session.commit()
    return jsonify({'message': 'Konu tamamlandı'})

@topic_bp.route('/topics/<int:topic_id>/quiz', methods=['GET'])
@login_required
def get_quiz(topic_id):
    quiz = quiz_bank.get(topic_id)
    if not quiz:
        return jsonify({'message': 'Bu konu için soru bulunamadı'}), 404
    return jsonify(quiz)