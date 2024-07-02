import base64
import uuid
from flask import Blueprint, request, jsonify, abort
from models.User import User
from models.User import RoleEnum
from models.Token import Token, TokenTypeEnum
from models import db
from utils.emails.email import sendEmail
import os
from flask import redirect

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

    



    



    
