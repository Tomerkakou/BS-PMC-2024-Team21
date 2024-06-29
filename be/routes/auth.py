from flask import Blueprint, request

from models.User import RoleEnum

auth_blu = Blueprint('auth',__name__)

@auth_blu.route("/sign-up")
def signUp():
    
    email=request.form.get(email)
    password=request.form.get(password)
    firstName=request.form.get(firstName)
    lastName=request.form.get(lastName)
    role=request.form.get(role,type=RoleEnum)

    
