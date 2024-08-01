import random
from flask import Blueprint, jsonify, request
from be.models import  db
from flask_jwt_extended import  jwt_required, current_user
from be.models.questions.Question import Question
from be.models.questions.StudentQuestion import StudentQuestion
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
        student_question = StudentQuestion(student_id=current_user.id,question_id=question_id,score=result["score"],auto_assessment=result["assessment"])
        db.session.add(student_question)
        db.session.commit()
        return jsonify(result) ,200
    except Exception as e:
        print(e)
        return "An Error Occured Please Try Again Later :(",400