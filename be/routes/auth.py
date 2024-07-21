import uuid

from flask import Blueprint, jsonify, redirect, request,current_app
from flask_jwt_extended import (create_access_token,
                                create_refresh_token, current_user,jwt_required,
                                )
from models import db
from models.Notification import Notification, NotificationType
from models.Token import Token, TokenTypeEnum
from models.User import Lecturer, RoleEnum, Student, User
from routes.notification import generateNotification
from utils.socketio import socketio
from utils.emails.email import sendEmail

auth_blu = Blueprint('auth',__name__)


@auth_blu.post("/sign-up")
def signUp():
    data = request.get_json()
    email=data.get("email")
    password=data.get("password")
    firstName=data.get("firstName")
    lastName=data.get("lastName")
    role=data.get("role")
    avatar = data.get('avatar')
    if role=='Student' :
        newUser = Student(email = email, password = password, firstName = firstName, lastName = lastName, role=RoleEnum[role],avatar=avatar)
    elif role=='Lecturer' :
        newUser = Lecturer(email = email, password = password, firstName = firstName, lastName = lastName, role=RoleEnum[role],avatar=avatar)
    elif role=='Admin' :
        newUser = User(email = email, password = password, firstName = firstName, lastName = lastName, role=RoleEnum[role],avatar=avatar)
    newUser.hashPassword()
    try:
        
        db.session.add(newUser)
        db.session.commit()
        newToken=Token(user_id=newUser.id,type=TokenTypeEnum.VerifyEmail)
        db.session.add(newToken)
        db.session.commit()
        url=current_app.config['BASE_URL']+f"/auth/verify-email?token={newToken.token}"
        if not current_app.config['TESTING']:
            sendEmail(email,"Verify your account","verifyAccount",verify_url=url)
        return "success", 201

    except Exception as e:
        print(e)
        db.session.rollback()
        return "Email already exist!", 400




@auth_blu.get("/verify-email")
def verifyEmail():
    token=request.args.get("token")
    token = db.session.get(Token, token)
    if token:
        user=token.user
        user.verifiedEmail=True
        if user.role==RoleEnum.Student:
            user.active=True
        db.session.delete(token)
        db.session.commit()
        if user.role!=RoleEnum.Student:
            nft=Notification(
                title=f'New {user.role.value} Signed Up!',
                msg=F'{user.firstName} {user.lastName} just signed up and waiting for your approval!',
                type=NotificationType.VerifyUser,
                belongToId=user.id,
                users=User.query.filter_by(role=RoleEnum.Admin).all()
            )
            db.session.add(nft)
            db.session.commit()
            socketio.emit('verifyUser', generateNotification(nft))
    return redirect(current_app.config['FRONT_URL'])

    
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
        refresh_token = create_refresh_token(identity=user)
        return jsonify({'accessToken': accessToken , 'refreshToken': refresh_token}), 200
    else:    
        return "Invalid Email Or Password", 400


@auth_blu.post('/refresh-token')
@jwt_required(refresh=True)
def refreshToken():
    refresh_token = create_refresh_token(identity=current_user)
    access_token = create_access_token(identity=current_user)
    return jsonify({'accessToken': access_token , 'refreshToken': refresh_token}),200


@auth_blu.get('/get-user')
@jwt_required()
def getUser():
    return jsonify({'id': current_user.id, 
                    'email': current_user.email, 
                    'firstName': current_user.firstName, 
                    'lastName': current_user.lastName,
                    'avatar': current_user.avatar
                    })
    

@auth_blu.post('/forgot-password')   
def resetPassEmail():
    data = request.get_json()
    userEmail = data.get('email')
    user = User.query.filter_by(email = userEmail).first()
    if user:
        newToken=Token(user_id=user.id,type=TokenTypeEnum.ResetPassword)
        db.session.add(newToken)
        db.session.commit()
        front_url=current_app.config['FRONT_URL']
        reset_url=front_url+f"/auth/reset-password?token={newToken.token}"
        if not current_app.config['TESTING']:
            sendEmail(userEmail,"Reset your password","resetPassword",reset_url=reset_url)
        
    return "Email sent", 201



@auth_blu.post('/reset-password')   
def changepass():
    data = request.get_json()
    userPass = data.get('password')
    userToken=data.get('token')
    token = db.session.get(Token,userToken)
    if not token:
        return "Invalid token",400 
    
    user=token.user
    user.password=userPass
    user.hashPassword()
    db.session.delete(token)
    db.session.commit()     
    return "ok",200


@auth_blu.post('/change-profile')
@jwt_required()
def changeProfile():
    data = request.get_json()
    email=data.get("email")
    firstName=data.get("firstName")
    lastName=data.get("lastName")
    avatar=data.get("avatar")
    try :
        current_user.firstName=firstName
        current_user.lastName=lastName
        current_user.email=email
        current_user.avatar=avatar
        db.session.commit()
        return "Profile Updated",200
    except Exception as e:
        print(e)
        db.session.rollback()
        return "Email already exist!", 400


      
        