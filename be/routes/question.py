import random
from flask import Blueprint, jsonify, request
from be.models import  db
from flask_jwt_extended import  current_user
from be.models.Notification import Notification, NotificationType
from be.models.questions import QuestionType
from be.models.questions.Question import Question
from be.models.questions.StudentQuestion import StudentQuestion
from be.utils.socketio import socketio
from be.utils.jwt import role
from sqlalchemy import select

question_blu = Blueprint('question',__name__)

@question_blu.post('/')
@role('Student')
def get_question():
    data = request.json
    subject_array= data.get('subject')
    qtype_array = data.get('qtype')
    level_array = data.get('level')

    if(len(current_user.lecturers)==0):
        return "Please Join To Lecturers First And Try Again!",404
    
    questions=db.session.scalars(select(Question)
               .where(Question.lecturer_id.in_([l.id for l in current_user.lecturers]))
               .where(Question.id.notin_(
                    select(StudentQuestion.question_id)
                    .where(StudentQuestion.student_id == current_user.id)
                )
               )
            ).all()
    if len(questions) == 0:
        questions = db.session.scalars(select(Question)
                     .join(StudentQuestion,Question.id==StudentQuestion.question_id)
                     .where(StudentQuestion.student_id==current_user.id)
                     .order_by(StudentQuestion.createdAt.desc())
                     .limit(20)
                    ).all()

    random.shuffle(questions)

    if subject_array:
        questions = [q for q in questions if q.subject.value in subject_array]
    if qtype_array:
        questions = [q for q in questions if q.qtype.value in qtype_array]
    if level_array:
        questions = [q for q in questions if q.level.value in level_array]
    
    if len(questions) == 0:
        return "No Questions Found For This Session!\nContact With Your Lecturers And Try Again Later :(s",404

    return jsonify(questions[0].to_json()),200


@question_blu.post('/validate-answer')
@role('Student')
def validate_answer():
    data = request.get_json()
    question_id = data.get('question_id')
    student_answer = data.get('answer')
    question = Question.query.get_or_404(question_id)
    try:
        result = question.validate_answer(student_answer)
        student_question = StudentQuestion(student_id=current_user.id,
                                           question_id=question_id,
                                           score=result["score"],
                                           auto_assessment=result["assessment"],
                                           answer=student_answer)
        db.session.add(student_question)
        db.session.commit()
        return jsonify(result) ,200
    except Exception as e:
        print(e)
        return "An Error Occured Please Try Again Later :(",400
    

@question_blu.get('/answered')
@role('Lecturer')
def answered_questions():
    query = (select(StudentQuestion)
                .join(Question,Question.id==StudentQuestion.question_id)
                .where(Question.lecturer_id==current_user.id)
                .where(Question.qtype!=QuestionType.SINGLE_CHOICE)
                .where(StudentQuestion.student_id.in_([s.id for s in current_user.students]))
            )
    
    id = request.args.get('id',None)
    by= request.args.get('by',None)
    if(by=="student" and id is not None):
        query = query.where(StudentQuestion.student_id==id)
    elif(by=="question" and id is not None):
        id=int(id)
        query = query.where(Question.id==id)
    elif by is not None:
        return "Invalid Request!",400
    

    questions = db.session.scalars(query.order_by(StudentQuestion.createdAt.desc())).all()

    return jsonify([{
        "answer_id":q.id,
        "student_name":q.student.fullName,
        "question":q.question.question,
        "answer":q.answer,
        "auto_assasment":q.auto_assessment,
        "score":q.score,
        "level":q.question.level.value,
        "subject":q.question.subject.value,
        "qtype":q.question.qtype.value,
        "assasment":q.lecturer_assessment or '',
        "createdAt":q.createdAt
    } for q in questions]),200

@question_blu.post('/assasment/<int:id>')
@role('Lecturer')
def assasment(id):
    data = request.get_json()
    student_question = db.session.get(StudentQuestion,id)
    if student_question is None:
        return "Question Not Found!",404
    student_question.lecturer_assessment = data.get('assasment')
    student_question.score = data.get('score')
    db.session.commit()

    nft=Notification(title="Assasment Updated",msg=f"Your Assasment For {student_question.question.shortDescription} has been updated by {current_user.fullName}!",type=NotificationType.Assasment,users=[student_question.student])
    db.session.add(nft)
    db.session.commit()
    socketio.emit('new-assasment',{"id":student_question.student.id,"nft":nft.to_json()})

    return "Assasment Updated Successfully!",200