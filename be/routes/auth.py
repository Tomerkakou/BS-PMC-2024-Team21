import base64
import uuid
from flask import Blueprint, app, request, jsonify, abort
from models.User import User
from models.User import RoleEnum
from models.Token import Token, TokenTypeEnum
from models import db
from utils.emails.email import sendEmail
import os
from flask import redirect
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, current_user

jwt = JWTManager()

auth_blu = Blueprint('auth',__name__)

@jwt.user_identity_loader
def user_identity_lookup(user):
    return user.id

@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return User.query.filter_by(id=identity).one_or_none()

@auth_blu.post("/sign-up")
def signUp():
    data = request.get_json()
    email=data.get("email")
    password=data.get("password")
    firstName=data.get("firstName")
    lastName=data.get("lastName")
    role=data.get("role")
    avatar = data.get('avatar')
    print(avatar)
    newUser = User(email = email, password = password, firstName = firstName, lastName = lastName, role= role,avatar=avatar)
    newUser.hashPassword()
    try:
        
        db.session.add(newUser)
        db.session.commit()
        newToken=Token(Token=str(uuid.uuid4())[0:49],user_id=newUser.id,token_type=TokenTypeEnum.VerifyEmail)
        db.session.add(newToken)
        db.session.commit()
        url=os.getenv("BASE_URL")+f"/auth/verify-email?token={newToken.Token}"
        sendEmail(email,"Verify your account","verifyAccount",base_url=os.getenv("FRONT_URL"),verify_url=url)
        return "success", 201

    except Exception as e:
        print(e)
        return "Email already exist!", 400




@auth_blu.get("/verify-email")
def verifyEmail():
    token=request.args.get("token")
    token = Token.query.get(token)
    if token:
        user=token.user
        user.verifiedEmail=True
        if user.role==RoleEnum.Student:
            user.active=True
        db.session.delete(token)
        db.session.commit()
    return redirect(os.getenv("FRONT_URL"))

    
@auth_blu.post('/login')
def login():
    data = request.get_json()
    userEmail = data.get('email')
    userPassword = data.get('password')
    user = User.query.filter_by(email = userEmail).first()

    if user and user.checkPassword(userPassword):
        if not user.verifiedEmail:
            return "Please Verify Your Email", 401
        if not user.active:
            return "Wait For Admin To Aprove Your Account", 401
        
        accessToken = create_access_token(identity=user)
        user.refresh_token = str(uuid.uuid4())[0:49]

        db.session.commit()
        return jsonify({'accessToken': accessToken , 'refreshToken': user.refresh_token}), 200
    else:    
        return "Invalid Email Or Password", 401


@auth_blu.post('/refresh-token')
@jwt_required()
def refreshToken():
    data = request.get_json()
    access_token = data.get('accessToken')
    refresh_token = data.get('refreshToken')

    if current_user.refresh_token != refresh_token:
        return "TOKEN ERROR", 401

    accessToken = create_access_token(identity=current_user)
    current_user.refresh_token = str(uuid.uuid4())[0:49]

    db.session.commit()
    return jsonify({'accessToken': accessToken , 'refreshToken': current_user.refresh_token}), 200


@auth_blu.get('/get-user')
@jwt_required()
def getUser():
    return jsonify({'id': current_user.id, 'email': current_user.email, 'firstName': current_user.firstName, 'lastName': current_user.lastName, 'role': str(current_user.role), 'avatar': current_user.avatar})
    
