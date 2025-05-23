from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from models.net_record import NetRecord
from database import db
from datetime import datetime

net_bp = Blueprint('net', __name__)

@net_bp.route('/nets', methods=['GET'])
@login_required
def get_nets():
    nets = NetRecord.query.filter_by(user_id=current_user.id).order_by(NetRecord.tarih.desc()).all()
    return jsonify([net.to_dict() for net in nets])

@net_bp.route('/nets', methods=['POST'])
@login_required
def add_net():
    data = request.json
    
    # Gerekli alanların kontrolü
    required_fields = ['exam_type', 'total_net', 'tarih']
    for field in required_fields:
        if field not in data:
            return jsonify({'message': f'{field} alanı gereklidir'}), 400
    
    try:
        # Tarih string'ini datetime.date objesine çevir
        tarih = datetime.strptime(data['tarih'], '%Y-%m-%d').date()
        
        net = NetRecord(
            user_id=current_user.id,
            exam_type=data['exam_type'],
            total_net=float(data['total_net']),
            tarih=tarih
        )
        
        db.session.add(net)
        db.session.commit()
        
        return jsonify(net.to_dict()), 201
    except ValueError:
        return jsonify({'message': 'Geçersiz tarih formatı. YYYY-MM-DD formatında olmalıdır.'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Net kaydı eklenirken bir hata oluştu: {str(e)}'}), 500

@net_bp.route('/nets/<int:net_id>', methods=['DELETE'])
@login_required
def delete_net(net_id):
    net = NetRecord.query.get_or_404(net_id)
    
    # Sadece kendi netlerini silebilir
    if net.user_id != current_user.id:
        return jsonify({'message': 'Bu işlem için yetkiniz yok'}), 403
    
    try:
        db.session.delete(net)
        db.session.commit()
        return jsonify({'message': 'Net kaydı başarıyla silindi'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Net kaydı silinirken bir hata oluştu: {str(e)}'}), 500
