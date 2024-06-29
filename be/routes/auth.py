from flask import Blueprint, request, jsonify, abort
from models.User import User
from models.User import RoleEnum
from models import db
from utils.emails.email import sendEmail
import os

auth_blu = Blueprint('auth',__name__)

@auth_blu.post("/sign-up")
def signUp():
    data = request.get_json()
    email=data.get("email")
    password=data.get("password")
    firstName=data.get("firstName")
    lastName=data.get("lastName")
    role=data.get("role")

    newUser = User(email = email, password = password, firstName = firstName, lastName = lastName, role= role)
    newUser.hashPassword()

    try:
        db.session.add(newUser)
        db.session.commit()
        
        sendEmail(email,"Verify your account","verifyAccount",base_url=os.getenv("BASE_URL"),verify_url=os.getenv("BASE_URL"))
        return "success", 201

    except Exception as e:
        return "Email already exist!", 400


    



    
