from flask import Blueprint, request, jsonify
from models.User import User
from models import db
from flask_jwt_extended import  jwt_required, current_user
from models.User import  RoleEnum , Lecturer
from utils.jwt import role

student_blu = Blueprint('student',__name__)

@student_blu.get('/getlecturer')
@jwt_required()
@role("Student")
def getlecturer(): 
    users_list = [{'id': user.id, 'name': f'{user.firstName} {user.lastName}', 'email': user.email, 'avatar': user.avatar} for user in current_user.lecturers]
    return jsonify(users_list), 200