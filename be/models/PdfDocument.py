from be.models import db, SubjectsEnum
from datetime import datetime
from sqlalchemy.dialects.mysql import LONGTEXT
import base64
import io
from pypdf import PdfReader
from sqlalchemy.orm import backref
from be.utils.chatgpt import Assitant


class PdfDocument(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    docName = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(100), nullable=True)
    subject = db.Column(db.Enum(SubjectsEnum), nullable=False)
    createdAt = db.Column(db.DateTime, nullable=False,default=datetime.now())
    pages=db.Column(db.Integer, nullable=False,default=0)
    doc = db.Column(LONGTEXT, nullable=False)
    lecturer_id = db.Column(db.String(50), db.ForeignKey("lecturer.id", ondelete='CASCADE'), nullable=False)
    lecturer = db.relationship('Lecturer', back_populates='pdf_documents')
    pagesSummarize = db.relationship('PageSummarize', back_populates='pdf_document',cascade='all, delete-orphan')
    
    def init_pages_summarize(self):
        pdf_file = io.BytesIO(base64.b64decode(self.doc.replace('data:application/pdf;base64,', '')))
        reader= PdfReader(pdf_file)  
        document_summarize=Assitant("document_summarization")     
        for i,page in enumerate(reader.pages):
            try:
                summarize=document_summarize.send_question(page.extract_text())
            except:
                summarize="Failed to summarize this page"
            page_summarize=PageSummarize(pdf_document_id=self.id, page=i+1, summary=summarize)
            self.pagesSummarize.append(page_summarize)
        self.pages=len(reader.pages)
        reader.close()
        pdf_file.close()


class PageSummarize(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pdf_document_id = db.Column(db.Integer, db.ForeignKey("pdf_document.id", ondelete='CASCADE'), nullable=False)
    pdf_document = db.relationship('PdfDocument', back_populates='pagesSummarize')
    page = db.Column(db.Integer, nullable=False)
    summary = db.Column(db.Text, nullable=False)
