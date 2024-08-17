from flask import Blueprint, jsonify, request
from be.models import SubjectsEnum, db
from flask_jwt_extended import current_user
from be.models.Notification import Notification, NotificationType
from be.models.questions.Question import Question
from be.utils.socketio import socketio
from be.utils.jwt import role
from be.models.PdfDocument import PdfDocument
from be.models.questions.Coding import Coding
from be.models.questions.Open import Open
from be.models.questions.SingleChoice import SingleChoice
from be.models import StudentQuestion, Lecturer



lecturer_blu = Blueprint('lecturer',__name__)

subject={
        "C#": SubjectsEnum.CSHARP,
        "Java": SubjectsEnum.Java,
        "Python": SubjectsEnum.Python,
        "JavaScript": SubjectsEnum.JavaScript,
        "SQL" : SubjectsEnum.SQL
    }

@lecturer_blu.get('/getstudents')
@role("Lecturer")
def getlecturer(): 
    signed_list = [{'id': user.id,
                    'name': user.fullName,
                    'email': user.email, 
                    'avatar': user.avatar,
                    'answers': (len(list(filter(lambda x: x.question.lecturer_id==current_user.id,user.students_questions))) > 0),
                } for user in current_user.students if user.active]
    return jsonify({'signed':signed_list}), 200

@lecturer_blu.post('/remove-students')
@role("Lecturer")
def remove_students():
    students_id = request.get_json()
    current_user.students=[student for student in current_user.students if student.id not in students_id]
    db.session.commit()
    return 'Students Removed Successfully!', 200
    
@lecturer_blu.post('/new-question')
@role("Lecturer")
def newQuestion():
    data=request.get_json()
    if data['qtype']=="Single Choice":
        question = SingleChoice(question=data['question'], 
                                subject=subject[data['subject']], 
                                shortDescription=data['shortDescription'],
                                level=data['level'],
                                correct_answer=data['correct_answer'], 
                                option1=data['correct_answer'],
                                option2=data['option2'],
                                option3=data['option3'],
                                option4=data['option4'],
                                using_ai=data['using_ai'],
                                lecturer_id=current_user.id)
    elif data['qtype']=="Open":
        question = Open(question=data['question'], 
                        subject=subject[data['subject']], 
                        shortDescription=data['shortDescription'],
                        level=data['level'],
                        correct_answer=data['correct_answer'],
                        using_ai=data['using_ai'],
                        lecturer_id=current_user.id)
    
    elif data['qtype']=="Coding":
        question = Coding(question=data['question'], 
                          subject=subject[data['subject']], 
                          shortDescription=data['shortDescription'],
                          level=data['level'],
                          correct_answer=data['correct_answer'],
                          template=data['template'],
                          using_ai=data['using_ai'],
                          lecturer_id=current_user.id)
        
    else:
        return 'Invalid question type!', 400
    
    db.session.add(question)
    db.session.commit()

    return "Question added successfully!", 200


@lecturer_blu.get('/questions')
@role("Lecturer")
def get_Questions():
    questions= current_user.questions
    questions_objects=[]
    for question in questions:
        questions_objects.append({'id':question.id, 'name':question.shortDescription,'subject':question.subject.value ,'type':question.qtype.value, 'level':question.level.value,"using_ai":question.using_ai})
    return jsonify(questions_objects),200
    
@lecturer_blu.post('/remove-questions')
@role("Lecturer")
def remove_questions():
    questions_id = request.get_json()
    questions_to_delete=[question for question in current_user.questions if question.id in questions_id]
    for question in questions_to_delete:
        db.session.delete(question)  
    db.session.commit()
    if (questions_to_delete.__len__() >1):
        return 'Questions Removed Successfully!', 200
    return 'Question Removed Successfully!', 200


@lecturer_blu.get('/question/<int:id>')
@role("Lecturer")
def get_question(id):
    question = Question.query.filter_by(id=id, lecturer_id=current_user.id).first()
    if question is None:
        return 'Question not found!', 404
    
    step1={
        "shortDescription":question.shortDescription,
        "level":question.level.value,
        "subject":question.subject.value,
        "qtype":question.qtype.value
    }
    if question.qtype.value=="Single Choice":
        step2={
            "question":question.question,
            "correct_answer":question.correct_answer,
            "option1":question.option1,
            "option2":question.option2,
            "option3":question.option3,
            "option4":question.option4
        }
    elif question.qtype.value=="Open":
        step2={
            "question":question.question,
            "correct_answer":question.correct_answer
        }
    else:
        step2={
            "question":question.question,
            "correct_answer":question.correct_answer,
            "template":question.template
        }

    return jsonify({"step1":step1,"step2":step2}), 200

@lecturer_blu.patch('/question/<int:id>')
@role("Lecturer")
def patch_question(id):
    question = Question.query.filter_by(id=id, lecturer_id=current_user.id).first()
    if question is None:
        return 'Question not found!', 404
    
    data=request.get_json()
    question.shortDescription=data['shortDescription']
    question.level=data['level']
    question.subject=subject[data['subject']]
    question.question=data['question']
    question.correct_answer=data['correct_answer']

    if question.qtype.value=="Single Choice":
        question.option1=data['correct_answer']
        question.option2=data['option2']
        question.option3=data['option3']
        question.option4=data['option4']
    elif question.qtype.value=="Coding":
        question.template=data['template']

    db.session.commit()
    return 'Question updated successfully!', 200


@lecturer_blu.get('/student-averages')
@role("Lecturer")
def get_students_avg_grades():
    lecturer_id = current_user.id

    # Get the current lecturer
    lecturer = db.session.query(Lecturer).filter_by(id=lecturer_id).first()

    if not lecturer:
        return jsonify({"error": "Lecturer not found"}), 404

    # Get the subjects the current lecturer has questions in
    subjects_taught = db.session.query(Question.subject).filter_by(lecturer_id=lecturer_id).distinct().all()
    subjects_taught = [subject for subject, in subjects_taught]  # Flatten the result

    student_avg_grades = []

    for student in lecturer.students:
        # Calculate average grade for each student in the subjects the lecturer has questions in
        total_score = 0
        total_questions = 0

        for subject in subjects_taught:
            student_questions = (
                db.session.query(StudentQuestion)
                .join(Question, StudentQuestion.question_id == Question.id)
                .filter(StudentQuestion.student_id == student.id, Question.subject == subject)
                .all()
            )
            
            subject_score = sum([sq.score for sq in student_questions])
            subject_questions_count = len(student_questions)

            total_score += subject_score
            total_questions += subject_questions_count

        # Calculate average
        avg_grade = total_score / total_questions if total_questions > 0 else 0

        student_avg_grades.append({
            'student_name': student.fullName,
            'average_grade': round(avg_grade, 2)
        })

    return jsonify(student_avg_grades)


@lecturer_blu.get('/student-subject-averages')
@role("Lecturer")
def get_student_subject_averages():
    lecturer_id = current_user.id

    # Get the current lecturer
    lecturer = db.session.query(Lecturer).filter_by(id=lecturer_id).first()

    if not lecturer:
        return jsonify({"error": "Lecturer not found"}), 404

    subjects_taught = [subject for subject in SubjectsEnum]  # Flatten the result
    student_subject_averages = []

    for student in lecturer.students:
        student_data = {'student_name': student.fullName, 'subjects': {}}

        for subject in subjects_taught:
            student_questions = (
                db.session.query(StudentQuestion)
                .join(Question, StudentQuestion.question_id == Question.id)
                .filter(StudentQuestion.student_id == student.id, Question.subject == subject)
                .all()
            )
            
            if student_questions:
                subject_score = sum([sq.score for sq in student_questions])
                subject_questions_count = len(student_questions)
                avg_grade = subject_score / subject_questions_count if subject_questions_count > 0 else 0
                student_data[subject.name] = round(avg_grade, 2)
            else:
                student_data[subject.name] = 0 

        student_subject_averages.append(student_data)

    return jsonify(student_subject_averages)

@lecturer_blu.get('/subject-question-counts')
@role("Lecturer")
def get_subject_question_counts():
    lecturer_id = current_user.id

    subject_counts = (
        db.session.query(Question.subject, db.func.count(Question.id))
        .filter(Question.lecturer_id == lecturer_id)
        .group_by(Question.subject)
        .all()
    )
    subject_counts_dict = {subject.name: count for subject, count in subject_counts}

    return jsonify(subject_counts_dict)