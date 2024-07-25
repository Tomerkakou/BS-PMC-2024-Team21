from flask import Blueprint,jsonify
from be.models.User import User
from flask_jwt_extended import jwt_required
from be.utils.jwt import role



stats_blu = Blueprint('statistics',__name__)

@stats_blu.get("/usercount")
@jwt_required()
@role('Admin')
def countusers():
    count =len(User.query.all())
    return jsonify({"count":count}),200