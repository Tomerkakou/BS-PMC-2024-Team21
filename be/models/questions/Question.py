from datetime import datetime
from be.models import SubjectsEnum, db
from sqlalchemy import Enum
from be.models.questions import DificultyLevel, QuestionType
from abc import abstractmethod

class Question(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    shortDescription = db.Column(db.String(100),nullable=False)
    question=db.Column(db.Text,nullable=False)
    correct_answer =db.Column(db.Text, nullable=False)
    level = db.Column(Enum(DificultyLevel),nullable=False)
    subject = db.Column(Enum(SubjectsEnum), nullable=False)
    qtype=db.Column(Enum(QuestionType),nullable=False)
    createdAt = db.Column(db.DateTime, nullable=False,default=datetime.now())
    lecturer_id = db.Column(db.String(50), db.ForeignKey("lecturer.id", ondelete='CASCADE'), nullable=False)
    
    __mapper_args__ = {
        "polymorphic_on": qtype,
    }

    @abstractmethod
    def validate_answer(self,student_answer):
        pass
