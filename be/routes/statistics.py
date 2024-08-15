from flask import Blueprint,jsonify
from be.models.User import User
from be.utils.jwt import role
from be.models.TokenCounter import TokenCounter
from datetime import datetime,timedelta,time
from be.models import db
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

@stats_blu.get("/users-week")
@role('Admin')
def countNewUsers():
    dates=[]
    today= datetime.combine(datetime.today().date(),time(0, 0, 0))
    
    for i in range(0,8):
        dates.append([today-timedelta(days=7*(i+1)),today-timedelta(days=7*i,seconds=1)])
    dates[0][1]=datetime.today()
    userMonth=[]
    for first,last in dates:
        count = db.session.query(db.func.count(User.createdAt)).filter(User.createdAt > first, User.createdAt < last).scalar()
        userMonth.append({'label':first.strftime('%d/%m')+'-'+last.strftime('%d/%m'),'value':count})
    
    return jsonify(userMonth),200