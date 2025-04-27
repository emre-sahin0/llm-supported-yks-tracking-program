from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from models.net import NetRecord
from database import db

net_bp = Blueprint('net', __name__)

@net_bp.route('/nets', methods=['POST'])
@login_required
def add_net():
    data = request.json
    new_record = NetRecord(
        user_id=current_user.id,
        tarih=data['tarih'],
        tyt_turkce=data['tyt']['turkce'],
        tyt_matematik=data['tyt']['matematik'],
        tyt_sosyal=data['tyt']['sosyal'],
        tyt_fen=data['tyt']['fen'],
        ayt_matematik=data['ayt']['matematik'],
        ayt_fizik=data['ayt']['fizik'],
        ayt_kimya=data['ayt']['kimya'],
        ayt_biyoloji=data['ayt']['biyoloji']
    )
    db.session.add(new_record)
    db.session.commit()
    return jsonify({'message': 'Net kaydedildi!'})

@net_bp.route('/nets', methods=['GET'])
@login_required
def get_nets():
    records = NetRecord.query.filter_by(user_id=current_user.id).order_by(NetRecord.created_at.desc()).all()
    result = []
    for r in records:
        result.append({
            'id': r.id,
            'tarih': r.tarih,
            'tyt': {
                'turkce': r.tyt_turkce,
                'matematik': r.tyt_matematik,
                'sosyal': r.tyt_sosyal,
                'fen': r.tyt_fen,
            },
            'ayt': {
                'matematik': r.ayt_matematik,
                'fizik': r.ayt_fizik,
                'kimya': r.ayt_kimya,
                'biyoloji': r.ayt_biyoloji,
            }
        })
    return jsonify(result)
