from flask import Blueprint, jsonify, request
from sqlalchemy import not_
from models.User import User
from models import db
from flask_jwt_extended import  jwt_required, current_user
from models.User import Lecturer
from utils.jwt import role

student_blu = Blueprint('student',__name__)

@student_blu.get('/getlecturer')
@jwt_required()
@role("Student")
def getlecturer(): 
    exclude_ids = [lecturer.id for lecturer in current_user.lecturers]
    other_lecturers = db.session.query(Lecturer).filter(not_(Lecturer.id.in_(exclude_ids))).filter_by(active=True).all()
    signed_list = [{'id': user.id, 'name': f'{user.firstName} {user.lastName}', 'email': user.email, 'avatar': user.avatar} for user in current_user.lecturers if user.active]
    other_list= [{'id': user.id, 'name': f'{user.firstName} {user.lastName}'} for user in other_lecturers]
    return jsonify({'signed':signed_list,'other':other_list}), 200

@student_blu.post('/add-lecturers')
@jwt_required()
@role("Student")
def add_lecturers():
    lecturer_ids = request.get_json()
    lecturers = db.session.query(Lecturer).filter(Lecturer.id.in_(lecturer_ids)).all()
    current_user.lecturers.extend(lecturers)
    db.session.commit()
    return jsonify([{'id': user.id, 'name': f'{user.firstName} {user.lastName}', 'email': user.email, 'avatar': user.avatar} for user in lecturers]), 200

@student_blu.post('/remove-lecturers')
@jwt_required()
@role("Student")
def remove_lecturers():
    lecturers_id = request.get_json()
    current_user.lecturers=[lecturer for lecturer in current_user.lecturers if lecturer.id not in lecturers_id]
    db.session.commit()
    
    return 'Lecturers Removed Successfully!', 200