from flask import Blueprint, jsonify, request
from flask_jwt_extended import current_user, jwt_required
from be.models import db
from be.models.PdfDocument import PdfDocument

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

