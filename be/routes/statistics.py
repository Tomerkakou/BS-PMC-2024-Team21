from flask import Blueprint, app, request, jsonify, abort
from models.User import RoleEnum, User
from models import db
import os
from flask_jwt_extended import jwt_required, current_user



stats_blu = Blueprint('statistics',__name__)
@jwt_required()
@stats_blu.get("/usercount")
def countusers():
    if current_user.role!=RoleEnum.Admin:
        return "OnlyAdmin",401
    count =len(User.query.all())
    return jsonify({"count":count}),200