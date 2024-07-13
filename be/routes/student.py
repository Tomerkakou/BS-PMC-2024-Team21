from flask import Blueprint, request, jsonify
from models.User import User
from models import db
from flask_jwt_extended import  jwt_required
from models.User import  RoleEnum , Lecturer

student_blu = Blueprint('student',__name__)

@student_blu.get('/getlecturer')
@jwt_required()
def getlecturer(): 
    lecturer = Lecturer.query.all()
    if lecturer:
        users_list = [{'id': user.id, 'name': f'{user.firstName} {user.lastName}'} for user in lecturer]
        return jsonify(users_list), 200
    else:
        return jsonify({'message': 'NO USERS'}), 200