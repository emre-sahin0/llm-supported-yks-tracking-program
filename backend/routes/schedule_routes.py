## === routes/schedule_routes.py ===
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from models.schedule import Schedule
from database import db
from datetime import time

schedule_bp = Blueprint('schedule', __name__)

@schedule_bp.route('/schedule', methods=['POST'])
@login_required
def add_schedule():
    data = request.json
    new_entry = Schedule(
        user_id=current_user.id,
        day_of_week=data['day_of_week'],
        lesson_name=data['lesson_name'],
        start_time=time.fromisoformat(data['start_time']),
        end_time=time.fromisoformat(data['end_time'])
    )
    db.session.add(new_entry)
    db.session.commit()
    return jsonify({'message': 'Ders saati eklendi'})

@schedule_bp.route('/schedule', methods=['GET'])
@login_required
def get_schedule():
    schedule = Schedule.query.filter_by(user_id=current_user.id).all()
    return jsonify([
        {
            'day_of_week': item.day_of_week,
            'lesson_name': item.lesson_name,
            'start_time': item.start_time.strftime('%H:%M'),
            'end_time': item.end_time.strftime('%H:%M')
        } for item in schedule
    ])