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
        lesson_name=data['lesson_name'],
        month=data['month'],
        week=data['week'],
        konu=data['konu'],
        sure=data.get('sure', None)
    )
    db.session.add(new_entry)
    db.session.commit()
    return jsonify({'message': 'Konu eklendi', 'id': new_entry.id})

@schedule_bp.route('/schedule', methods=['GET'])
@login_required
def get_schedule():
    schedule = Schedule.query.filter_by(user_id=current_user.id).all()
    return jsonify([
        {
            'id': item.id,
            'lesson_name': item.lesson_name,
            'month': item.month,
            'week': item.week,
            'konu': item.konu,
            'sure': item.sure
        } for item in schedule
    ])

@schedule_bp.route('/schedule/<int:schedule_id>', methods=['PUT'])
@login_required
def update_schedule(schedule_id):
    data = request.json
    schedule = Schedule.query.get_or_404(schedule_id)
    if schedule.user_id != current_user.id:
        return jsonify({'message': 'Bu programı güncelleme yetkiniz yok'}), 403
    if 'day_of_week' in data:
        schedule.day_of_week = data['day_of_week']
    if 'lesson_name' in data:
        schedule.lesson_name = data['lesson_name']
    if 'start_time' in data:
        schedule.start_time = time.fromisoformat(data['start_time'])
    if 'end_time' in data:
        schedule.end_time = time.fromisoformat(data['end_time'])
    db.session.commit()
    return jsonify({'message': 'Program güncellendi'})

@schedule_bp.route('/schedule/<int:schedule_id>', methods=['DELETE'])
@login_required
def delete_schedule(schedule_id):
    schedule = Schedule.query.get_or_404(schedule_id)
    if schedule.user_id != current_user.id:
        return jsonify({'message': 'Bu programı silme yetkiniz yok'}), 403
    db.session.delete(schedule)
    db.session.commit()
    return jsonify({'message': 'Konu silindi'})