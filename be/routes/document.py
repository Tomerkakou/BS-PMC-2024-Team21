import base64
from flask import Blueprint, jsonify, request, send_file
from be.models import SubjectsEnum, db
from flask_jwt_extended import current_user, jwt_required
from be.models.Notification import Notification, NotificationType
from be.models.questions.Question import Question
from be.utils.socketio import socketio
from be.utils.jwt import role
from be.models.PdfDocument import PdfDocument
from be.models.questions.Coding import Coding
from be.models.questions.Open import Open
from be.models.questions.SingleChoice import SingleChoice
from be.models import StudentQuestion, Lecturer
from io import BytesIO

document_blu = Blueprint('document',__name__)
@document_blu.get('/<int:doc_id>')
@jwt_required()
def get_document(doc_id):
    pdf=db.session.get(PdfDocument,doc_id)
    if pdf is None:
        return "Document not found",404
    if pdf.lecturer_id!=current_user.id and (current_user not in pdf.lecturer.students):
        return "Permission denied",403
    
    pages_summarize=[page.summary for page in pdf.pagesSummarize]

    return jsonify({"id":pdf.id,"title":pdf.docName,"pages":pdf.pages,"pagesSummary":pages_summarize,"content":pdf.doc})

@document_blu.post('/new')
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
    

@document_blu.get('/get-lecturer')
@role("Lecturer")
def getdocuments():
    document_list = [{'id': doc.id, 'name': f'{doc.docName}', 'description': doc.description, 'subject': doc.subject.value, 'createdAt':doc.createdAt, 'pages': doc.pages} for doc in current_user.pdf_documents]
    return jsonify({'documents':document_list}), 200

@document_blu.post('/remove')
@role("Lecturer")
def remove_documents():
    docs_id = request.get_json()
    documents_to_delete=[doc for doc in current_user.pdf_documents if doc.id in docs_id]
    for doc in documents_to_delete:
        db.session.delete(doc)  
    db.session.commit()
    return 'Documents Removed Successfully!', 200

@document_blu.get('/get-student')
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

@document_blu.get('/download/<int:doc_id>')
def download_file(doc_id):
    doc=PdfDocument.query.get_or_404(doc_id)
    buffer = BytesIO(base64.b64decode(doc.doc.replace('data:application/pdf;base64,', '')))

    return send_file(buffer, as_attachment=True, download_name=f'{doc.docName}.pdf', mimetype='application/pdf')