import uuid
from flask import Blueprint, request, jsonify
from models.User import User, Student,Lecturer
from models.User import RoleEnum
from models.Token import Token, TokenTypeEnum
from models import db
from utils.emails.email import sendEmail
import os
from flask import redirect
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, current_user

jwt = JWTManager()

admin_blu = Blueprint('admin',__name__)

@admin_blu.get('/getusers')
@jwt_required()
def getusers(): 
    users = User.query.filter(User.id != current_user.id).all()
    if users:
        users_list = [{'id': user.id, 'name': f'{user.firstName} {user.lastName}', 'email': user.email
                       , 'role':user.role.value , 'verifiedEmail':user.verifiedEmail , 'avatar':user.avatar,
                          'status' : user.active} for user in users]
        return jsonify(users_list), 200
    else:
        return jsonify({'message': 'NO USERS'}), 200




@admin_blu.post('/deactivate-user')
@jwt_required()
def nonActiveUser():
    id_list = request.get_json()
    users = User.query.filter(User.id.in_(id_list),User.id != current_user.id).all()
    for user in users:
        user.active=False
    db.session.commit()
    if len(users)>1:
        return jsonify({'message':'Users Deleted','users_id':[user.id for user in users] }),200
    else :
        return jsonify({'message':f'{users[0].firstName} {users[0].lastName} Deleted','users_id': [user.id for user in users]}),200
    

        
@admin_blu.post('/activate-user')
@jwt_required()
def activeUser():
    id_list = request.get_json()
    users = User.query.filter(User.id.in_(id_list),User.id != current_user.id).all()
    for user in users:
        user.active=True
    db.session.commit()
    if len(users)>1:
        return jsonify({'message':'Users Activated','users_id':[user.id for user in users]}),200
    else :
        return jsonify({'message':f'{users[0].firstName} {users[0].lastName} Activated','users_id': [user.id for user in users]}),200
      