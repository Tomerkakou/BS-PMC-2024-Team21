import uuid
from flask import Blueprint, request, jsonify
from models.User import User
from models.User import RoleEnum
from models.Token import Token, TokenTypeEnum
from models import db
from utils.emails.email import sendEmail
import os
from flask import redirect
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, current_user

jwt = JWTManager()

auth_blu = Blueprint('auth',__name__)

@jwt.user_identity_loader
def user_identity_lookup(user):
    return user.id

@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return User.query.filter_by(id=identity).one_or_404()

@auth_blu.post("/sign-up")
def signUp():
    data = request.get_json()
    email=data.get("email")
    password=data.get("password")
    firstName=data.get("firstName")
    lastName=data.get("lastName")
    role=data.get("role")
    avatar = data.get('avatar')
    newUser = User(email = email, password = password, firstName = firstName, lastName = lastName, role= role,avatar=avatar)
    newUser.hashPassword()
    try:
        
        db.session.add(newUser)
        db.session.commit()
        newToken=Token(token=str(uuid.uuid4())[0:49],user_id=newUser.id,type=TokenTypeEnum.VerifyEmail)
        db.session.add(newToken)
        db.session.commit()
        url=os.getenv("BASE_URL")+f"/auth/verify-email?token={newToken.token}"
        sendEmail(email,"Verify your account","verifyAccount",verify_url=url)
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
            return "Please Verify Your Email", 400
        if not user.active:
            return "Wait For Admin To Aprove Your Account", 400
        
        accessToken = create_access_token(identity=user)
        user.refresh_token = str(uuid.uuid4())[0:49]

        db.session.commit()
        return jsonify({'accessToken': accessToken , 'refreshToken': user.refresh_token}), 200
    else:    
        return "Invalid Email Or Password", 400


@auth_blu.post('/refresh-token')
@jwt_required()
def refreshToken():
    data = request.get_json()
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
    return jsonify({'id': current_user.id, 
                    'email': current_user.email, 
                    'firstName': current_user.firstName, 
                    'lastName': current_user.lastName,
                    'role': current_user.role.value, 
                    'avatar': current_user.avatar
                    })
    

@auth_blu.post('/forgot-password')   
def resetPassEmail():
    data = request.get_json()
    userEmail = data.get('email')
    user = User.query.filter_by(email = userEmail).first()
    if user:
        newToken=Token(token=str(uuid.uuid4())[0:49],user_id=user.id,type=TokenTypeEnum.ResetPassword)
        db.session.add(newToken)
        db.session.commit()
        front_url=os.getenv("FRONT_URL")
        reset_url=front_url+f"/auth/reset-password?token={newToken.token}"
        sendEmail(userEmail,"Reset your password","resetPassword",reset_url=reset_url)
        
    return "Email sent", 201



@auth_blu.post('/reset-password')   
def changepass():
    data = request.get_json()
    userPass = data.get('password')
    userToken=data.get('token')
    token = Token.query.get(userToken)
    if not token:
        return "Invalid token",400 
    
    user=token.user
    user.password=userPass
    user.hashPassword()
    db.session.delete(token)
    db.session.commit()     
    return "ok",200
        