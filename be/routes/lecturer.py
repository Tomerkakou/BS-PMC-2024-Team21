from flask import Blueprint, jsonify, request
from be.models import db
from flask_jwt_extended import  jwt_required, current_user
from be.utils.jwt import role


lecturer_blu = Blueprint('lecturer',__name__)


@lecturer_blu.get('/getstudents')
@jwt_required()
@role("Lecturer")
def getlecturer(): 
    signed_list = [{'id': user.id, 'name': f'{user.firstName} {user.lastName}', 'email': user.email, 'avatar': user.avatar} for user in current_user.students if user.active]
    return jsonify({'signed':signed_list}), 200

@lecturer_blu.post('/remove-students')
@jwt_required()
@role("Lecturer")
def remove_students():
    students_id = request.get_json()
    current_user.students=[student for student in current_user.students if student.id not in students_id]
    db.session.commit()
    return 'Students Removed Successfully!', 200