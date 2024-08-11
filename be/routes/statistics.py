from flask import Blueprint,jsonify
from be.models.User import User
from be.utils.jwt import role
from be.models.TokenCounter import TokenCounter


stats_blu = Blueprint('statistics',__name__)

@stats_blu.get("/usercount")
@role('Admin')
def countusers():
    count =len(User.query.all())
    return jsonify({"count":count}),200

@stats_blu.get("/tokenscount")
@role('Admin')
def countTokens():
    count =TokenCounter.query.first()
    return jsonify({"count":count.tokens}),200