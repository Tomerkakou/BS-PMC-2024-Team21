import base64
import io
from flask import Blueprint, jsonify, request, send_file
from sqlalchemy import not_
from be.models import db
from flask_jwt_extended import  jwt_required, current_user
from be.models.PdfDocument import PdfDocument
from be.models.User import Lecturer
from be.utils.jwt import role
from be.models.Notification import Notification, NotificationType
from be.utils.socketio import socketio
from be.routes.notification import generateNotification

student_blu = Blueprint('student',__name__)

@student_blu.get('/getlecturer')
@jwt_required()
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
@jwt_required()
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
        socketio.emit('VerifyStudent', {'id':lecture.id, 'nft': generateNotification(nft)})
    return jsonify({'ids':[user.id for user in lecturers], 'msg': 'Request Sent Successfully'}), 200

@student_blu.post('/remove-lecturers')
@jwt_required()
@role("Student")
def remove_lecturers():
    lecturers_id = request.get_json()
    current_user.lecturers=[lecturer for lecturer in current_user.lecturers if lecturer.id not in lecturers_id]
    db.session.commit()
    
    return 'Lecturers Removed Successfully!', 200

@student_blu.get('/documents')
@jwt_required()
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



