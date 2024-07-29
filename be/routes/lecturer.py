from flask import Blueprint, jsonify, request
from be.models import SubjectsEnum, db
from flask_jwt_extended import  jwt_required, current_user
from be.utils.jwt import role
from be.models.PdfDocument import PdfDocument, PageSummarize

lecturer_blu = Blueprint('lecturer',__name__)


@lecturer_blu.get('/getstudents')
@jwt_required()
@role("Lecturer")
def getlecturer(): 
    signed_list = [{'id': user.id, 'name': f'{user.firstName} {user.lastName}', 'email': user.email, 'avatar': user.avatar} for user in current_user.students if user.active]
    return jsonify({'signed':signed_list}), 200

@lecturer_blu.post('/remove-students')
@jwt_required()
@role("Lecturer")
def remove_students():
    students_id = request.get_json()
    current_user.students=[student for student in current_user.students if student.id not in students_id]
    db.session.commit()
    return 'Students Removed Successfully!', 200

@lecturer_blu.post('/new-document')
@jwt_required()
@role("Lecturer")
def newPdf():
    data=request.get_json()
    subject=  SubjectsEnum.CSHARP if data['subject'] =="C#" else SubjectsEnum[data['subject']]
    pdf = PdfDocument(docName=data['docName'], description=data['description'], subject=subject, doc=data['doc'], lecturer_id=current_user.id,pages=0)
    try:
        pdf.init_pages_summarize()
        db.session.add(pdf)
        db.session.commit()
        return jsonify({"name":pdf.docName,
                        "description":pdf.description,
                        "subject":pdf.subject.value,}), 200
    except:
        db.session.rollback()
        return 'Invalid file please check you file and try again!', 400

@lecturer_blu.get('/getdocuments')
@jwt_required()
@role("Lecturer")
def getdocuments():
    document_list = [{'id': doc.id, 'name': f'{doc.docName}', 'description': doc.description, 'subject': doc.subject.value, 'createdAt':doc.createdAt, 'pages': doc.pages} for doc in current_user.pdf_documents]
    return jsonify({'documents':document_list}), 200

@lecturer_blu.post('/remove-documents')
@jwt_required()
@role("Lecturer")
def remove_documents():
    docs_id = request.get_json()
    documents_to_delete=[doc for doc in current_user.pdf_documents if doc.id in docs_id]
    for doc in documents_to_delete:
        db.session.delete(doc)  
    db.session.commit()
    return 'Documents Removed Successfully!', 200