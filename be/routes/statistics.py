from flask import Blueprint,jsonify
from be.models.PdfDocument import PdfDocument
from be.models.User import User
from be.models.questions.Question import Question
from be.models.questions.StudentQuestion import StudentQuestion
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


@stats_blu.get("/avg-usage")
@role('Admin')
def avgUsage():
    dates=[]
    today= datetime.combine(datetime.today().date(),time(0, 0, 0))
    for i in range(0,7):
        dates.append([today-timedelta(days=i+1),today-timedelta(days=i,seconds=1)])
    dates[0][1]=datetime.today()
    dates=dates[::-1]
    docs=[]
    questions=[]
    answers=[]
    days=[]
    for start,end in dates:
        days.append(start.strftime("%a"))
        count = db.session.query(db.func.count(PdfDocument.createdAt)).filter(PdfDocument.createdAt > start, PdfDocument.createdAt < end).scalar()
        docs.append(count)
        count = db.session.query(db.func.count(Question.createdAt)).filter(Question.createdAt > start, Question.createdAt < end).scalar()
        questions.append(count)
        count = db.session.query(db.func.count(StudentQuestion.createdAt)).filter(StudentQuestion.createdAt > start, StudentQuestion.createdAt < end).scalar()
        answers.append(count)

    return jsonify({'docs':docs,'questions':questions, 'answers':answers, 'days':days}), 200
    