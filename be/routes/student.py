import base64

import io
from flask import Blueprint, current_app, jsonify, request, send_file
from sqlalchemy import not_
from be.models import db
from flask_jwt_extended import  current_user
from be.models.PdfDocument import PdfDocument
from be.models.User import Lecturer
from be.models.questions.Question import Question
from be.utils.jwt import role
from be.models.Notification import Notification, NotificationType
from be.utils.socketio import socketio
from be.models.questions.StudentQuestion import StudentQuestion
from flask import send_file
from io import BytesIO
from xhtml2pdf import pisa
from datetime import datetime, timedelta
from be.models import StudentQuestion, Question, SubjectsEnum
from flask import render_template, make_response

student_blu = Blueprint('student',__name__)

@student_blu.get('/getlecturer')
@role("Student")
def getlecturer(): 
    exclude_ids = [lecturer.id for lecturer in current_user.lecturers]
    other_lecturers = db.session.query(Lecturer).filter(not_(Lecturer.id.in_(exclude_ids))).filter_by(active=True).all() 

    final_other_lecturers=[]
    for lecture in  other_lecturers:
        flag=0
        notification=lecture.notifications
        for n in notification:
            if n.belongToId == current_user.id :
                flag=1
        if flag==0:
            final_other_lecturers.append(lecture)
    signed_list = [{'id': user.id, 'name': f'{user.firstName} {user.lastName}', 'email': user.email, 'avatar': user.avatar} for user in current_user.lecturers if user.active]
    other_list= [{'id': user.id, 'name': f'{user.firstName} {user.lastName}'} for user in final_other_lecturers]
    return jsonify({'signed':signed_list,'other':other_list}), 200

@student_blu.post('/add-lecturers')
@role("Student")
def add_lecturers():
    lecturer_ids = request.get_json()
    lecturers = db.session.query(Lecturer).filter(Lecturer.id.in_(lecturer_ids)).all()
    for lecture in lecturers:
        nft=Notification(
                title=f'New {current_user.role.value} Request!',
                msg=F'{current_user.firstName} {current_user.lastName} just sent request and waiting for your approval!',
                type=NotificationType.VerifyStudent,
                belongToId=current_user.id,
                users=[lecture]
        )
        db.session.add(nft)
        db.session.commit()
        socketio.emit('VerifyStudent', {'id':lecture.id, 'nft': nft.to_json()})
    return jsonify({'ids':[user.id for user in lecturers], 'msg': 'Request Sent Successfully'}), 200

@student_blu.post('/remove-lecturers')
@role("Student")
def remove_lecturers():
    lecturers_id = request.get_json()
    current_user.lecturers=[lecturer for lecturer in current_user.lecturers if lecturer.id not in lecturers_id]
    db.session.commit()
    
    return 'Lecturers Removed Successfully!', 200

@student_blu.get('/documents')
@role("Student")
def get_documents():
    lecturers= current_user.lecturers
    documents=[]
    documents_objects=[]
    for lecturer in lecturers:
        documents+=lecturer.pdf_documents
    for doc in documents:
        documents_objects.append({'id':doc.id, 'name':doc.docName, 'description':doc.description, 'subject':doc.subject.value ,'date':doc.createdAt, 'lecturer':doc.lecturer.fullName})
    return jsonify(documents_objects),200

@student_blu.get('/document/<int:doc_id>')
def download_file(doc_id):
    doc=PdfDocument.query.get_or_404(doc_id)
    buffer = io.BytesIO(base64.b64decode(doc.doc.replace('data:application/pdf;base64,', '')))

    return send_file(buffer, as_attachment=True, download_name=f'{doc.docName}.pdf', mimetype='application/pdf')


@student_blu.get('/get-questions')
@role("Student")
def get_Questions():
    questions = StudentQuestion.query.filter_by(student_id=current_user.id).all()
    print(questions)
    questions_objects=[]
    for question in questions:
            questions_objects.append({'answer_id':question.id, 'score':question.score,'assessment':question.lecturer_assessment or  question.auto_assessment ,'answer':question.answer,'createdAt':question.createdAt,'question_description':question.question.shortDescription})
  
    return jsonify(questions_objects),200
    


# Define a mapping for user-friendly names
SUBJECT_NAME_MAP = {
    'CSHARP': 'C#',
    'Java': 'Java',
    'Python': 'Python',
    'JavaScript': 'JavaScript',
    'SQL': 'SQL'
}

@student_blu.get('/get-grades')
@role("Student")
def get_grades():
    student_name = f'{current_user.firstName} {current_user.lastName}'

    questions = StudentQuestion.query.filter_by(student_id=current_user.id).all()

    subject_scores = {}

    # Group questions by subject
    for question in questions:
        subject = question.question.subject
        score = question.score
        
        if subject not in subject_scores:
            subject_scores[subject] = {
                'scores': [],
                'count': 0
            }
        
        subject_scores[subject]['scores'].append(score)
        subject_scores[subject]['count'] += 1

    results = []
    total_scores = []
    
    for subject, details in subject_scores.items():
        avg_score = sum(details['scores']) / len(details['scores'])
        results.append({
            'subject': SUBJECT_NAME_MAP.get(subject.name, subject.name),
            'avg_score': round(avg_score, 2),
            'count': details['count']
        })
        total_scores.extend(details['scores'])
    # Calculate total average score
    total_avg_score = sum(total_scores) / len(total_scores) if total_scores else 0
    total_avg_score = round(total_avg_score, 2)

    result = BytesIO()
    date = datetime.now()
    date_str = date.strftime('%d/%m/%Y')
    rendered = render_template('grades.html', name=student_name,grades=results,total_avg=total_avg_score,front_url=current_app.config['FRONT_URL'],date=date_str,ranges=range(5-len(results)))
    pdf = pisa.pisaDocument(BytesIO(rendered.encode("ISO-8859-1")), result)
    response = make_response(result.getvalue())
    response.headers['Content-Type'] = 'application/pdf'
    response.headers['Content-Disposition'] = 'inline; attachment; filename=report.pdf'
    return response

@student_blu.get('/student-progress')
@role("Student")
def get_student_grades_by_subject():
    student_id = current_user.id
     # Calculate the date 30 days ago from today
    start_date = datetime.now() - timedelta(days=30)
    
    # Generate date ranges (brackets of 3 days) for the last 30 days
    date_ranges = [(start_date + timedelta(days=i*3)).strftime('%d/%m/%Y') for i in range(1, 11)]
    
    # Initialize dictionary to hold cumulative averages for each subject
    grades_by_subject = {subject.value: [0]*10 for subject in SubjectsEnum}

    # Query the student's answers to all questions within the last 30 days
    student_questions = (
        db.session.query(StudentQuestion)
        .join(Question)
        .filter(
            StudentQuestion.student_id == student_id,
            StudentQuestion.createdAt >= start_date
        )
        .order_by(StudentQuestion.createdAt)
        .all()
    )
    
    # Accumulate scores for each date range
    for i in range(10):
        current_end_date = start_date + timedelta(days=(i+1)*3)
        
        for sq in student_questions:
            if sq.createdAt <= current_end_date:
                subject = sq.question.subject.value
                grades_by_subject[subject][i] += sq.score

        # Calculate the average for each subject at the current date range
        for subject in grades_by_subject:
            count = sum(1 for sq in student_questions if sq.question.subject.value == subject and sq.createdAt <= current_end_date)
            if count > 0:
                grades_by_subject[subject][i] /= count
    
   # Format the date ranges in 'YYYY-MM-DD' format
    date_labels = [
        (start_date + timedelta(days=(i+1)*3)).strftime('%Y-%m-%d')
        for i in range(10)
    ]
    
    # Prepare the response data
    response_data = {
        'date_ranges': date_labels,
        'grades_by_subject': grades_by_subject
    }
    
    return jsonify(response_data)

@student_blu.get('/student-answer-count')
@role("Student")
def get_subject_answer_count():
    # Get the current student's ID
    student_id = current_user.id

    # Query to count answers per subject
    answer_counts = (
        db.session.query(Question.subject, db.func.count(StudentQuestion.id))
        .join(StudentQuestion, StudentQuestion.question_id == Question.id)
        .filter(StudentQuestion.student_id == student_id)
        .group_by(Question.subject)
        .all()
    )

    # Convert the query result into a dictionary
    subject_counts = {subject.value: count for subject, count in answer_counts}
    return jsonify(subject_counts)

@student_blu.get('/subject-averages')
@role("Student")
def get_student_subject_averages():
    student_id = current_user.id
    subject_averages = (
        db.session.query(
            Question.subject, 
            db.func.avg(StudentQuestion.score).label('average_score')
        )
        .join(Question, StudentQuestion.question_id == Question.id)
        .filter(StudentQuestion.student_id == student_id)
        .group_by(Question.subject)
        .all()
    )
    subject_avg_dict = {subject.name: round(avg, 2) for subject, avg in subject_averages}
    return jsonify(subject_avg_dict)

