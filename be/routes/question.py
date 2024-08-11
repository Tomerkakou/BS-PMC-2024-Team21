import random
from flask import Blueprint, jsonify, request
from be.models import  SubjectsEnum, db
from flask_jwt_extended import  current_user
from be.models.Notification import Notification, NotificationType
from be.models.questions import DificultyLevel, QuestionType
from be.models.questions.Open import Open
from be.models.questions.Coding import Coding
from be.models.questions.Question import Question
from be.models.questions.SingleChoice import SingleChoice
from be.models.questions.StudentQuestion import StudentQuestion
from be.utils.chatgpt import Assitant
from be.utils.socketio import socketio
from be.utils.jwt import role
from sqlalchemy import select
from flask import json

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

@question_blu.get('/generate')
@role('Lecturer')
def generate_ai_question():
    subject= ["C#",'Python','Java','JavaScript','SQL'][random.randint(0,4)]
    level=["Easy",'Medium','Hard'][random.randint(0,2)]
    qtype=["Single Choice","Open","Coding"][random.randint(0,2)]

    old_questions = Question.query.filter_by(qtype=qtype,level=level,subject=subject).all()
    old_questions="\n".join([f"{index}. {q.question}" for index,q in enumerate(old_questions)])
    query_msg=f"""
        old questions:
        {old_questions}

        New Question Data:

        Subject: {subject}
        Level: {level}
        Question Type: {qtype}

        please make sure to stick with the below schema in your json response
        schema : 

    """
    assistant=Assitant("question_generator")
    try:
        if qtype == "Open":
            json_txt=assistant.send_question(query_msg+Open.ai_schema)
            result=json.loads(json_txt)
            result={
                "step1":{
                    "shortDescription":result["short_description"],
                    "qtype":qtype,
                    "level":level,
                    "subject":subject,
                },
                "step2":{
                    "question":result["question"],
                    "correct_answer":result["correct_answer"]
                }
            }
        elif qtype == "Coding":
            json_txt=assistant.send_question(query_msg+Coding.ai_schema)
            result=json.loads(json_txt)
            result={
                "step1":{
                    "shortDescription":result["short_description"],
                    "qtype":qtype,
                    "level":level,
                    "subject":subject,
                },
                "step2":{
                    "question":result["question"],
                    "correct_answer":result["correct_answer"],
                    "template":result["template"]
                }
            }
        elif qtype == "Single Choice":
            json_txt=assistant.send_question(query_msg+SingleChoice.ai_schema)
            result=json.loads(json_txt)
            result={
                "step1":{
                    "shortDescription":result["short_description"],
                    "qtype":qtype,
                    "level":level,
                    "subject":subject,
                },
                "step2":{
                    "question":result["question"],
                    "correct_answer":result["correct_answer"],
                    "option2":result["option2"],
                    "option3":result["option3"],
                    "option4":result["option4"]
                }
            }
        
        return jsonify(result),200
    except:
        return "An Error Occured Please Try Again Later :(",400