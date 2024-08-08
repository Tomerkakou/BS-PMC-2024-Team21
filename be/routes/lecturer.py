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
    signed_list = [{'id': user.id, 'name': f'{user.firstName} {user.lastName}', 'email': user.email, 'avatar': user.avatar} for user in current_user.students if user.active]
    return jsonify({'signed':signed_list}), 200

@lecturer_blu.post('/remove-students')
@role("Lecturer")
def remove_students():
    students_id = request.get_json()
    current_user.students=[student for student in current_user.students if student.id not in students_id]
    db.session.commit()
    return 'Students Removed Successfully!', 200

@lecturer_blu.post('/new-document')
@role("Lecturer")
def newPdf():
    data=request.get_json()
    subject=  SubjectsEnum.CSHARP if data['subject'] =="C#" else SubjectsEnum[data['subject']]
    pdf = PdfDocument(docName=data['docName'], description=data['description'], subject=subject, doc=data['doc'], lecturer_id=current_user.id,pages=0)
    try:
        pdf.init_pages_summarize()
        db.session.add(pdf)
        db.session.commit()
        for student in current_user.students:
            notification = Notification(
                title=f'{current_user.fullName} Uploaded Document!',
                msg=f'{current_user.fullName} Uploaded a new document called {pdf.docName} in {pdf.subject.value} go and check it out!',
                users=[student],
                type=NotificationType.NewDocument,
            )
            db.session.add(notification)
            db.session.commit()
            socketio.emit('new-document',{"id":student.id,"nft":notification.to_json()})
        return jsonify({'id': pdf.id, 'name': f'{pdf.docName}', 'description': pdf.description, 'subject': pdf.subject.value, 'createdAt':pdf.createdAt, 'pages': pdf.pages}), 200
    except Exception as e:
        print(e)
        db.session.rollback()
        return 'Invalid file please check you file and try again!', 400


@lecturer_blu.get('/getdocuments')
@role("Lecturer")
def getdocuments():
    document_list = [{'id': doc.id, 'name': f'{doc.docName}', 'description': doc.description, 'subject': doc.subject.value, 'createdAt':doc.createdAt, 'pages': doc.pages} for doc in current_user.pdf_documents]
    return jsonify({'documents':document_list}), 200

@lecturer_blu.post('/remove-documents')
@role("Lecturer")
def remove_documents():
    docs_id = request.get_json()
    documents_to_delete=[doc for doc in current_user.pdf_documents if doc.id in docs_id]
    for doc in documents_to_delete:
        db.session.delete(doc)  
    db.session.commit()
    return 'Documents Removed Successfully!', 200
    
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
                                lecturer_id=current_user.id)
    elif data['qtype']=="Open":
        question = Open(question=data['question'], 
                        subject=subject[data['subject']], 
                        shortDescription=data['shortDescription'],
                        level=data['level'],
                        correct_answer=data['correct_answer'],
                        lecturer_id=current_user.id)
    
    elif data['qtype']=="Coding":
        question = Coding(question=data['question'], 
                          subject=subject[data['subject']], 
                          shortDescription=data['shortDescription'],
                          level=data['level'],
                          correct_answer=data['correct_answer'],
                          template=data['template'],
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
        questions_objects.append({'id':question.id, 'name':question.shortDescription,'subject':question.subject.value ,'type':question.qtype.value, 'level':question.level.value})
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


