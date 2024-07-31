from datetime import datetime
from be.models import db

class StudentQuestion(db.Model):
    __tablename__ = 'student_question'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.String(50), db.ForeignKey('student.id', ondelete='CASCADE'))
    question_id = db.Column(db.Integer, db.ForeignKey('question.id', ondelete='CASCADE'))
    createdAt = db.Column(db.DateTime, nullable=False,default=datetime.now())
    score = db.Column(db.Float, nullable=False)
    auto_assessment = db.Column(db.Text, nullable=True)
    lecturer_assessment = db.Column(db.Text, nullable=True)

    student = db.relationship('Student', back_populates='students_questions', lazy=True)
    question = db.relationship('Question', back_populates='students_questions', lazy=True)
