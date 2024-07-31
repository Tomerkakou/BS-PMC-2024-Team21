from datetime import datetime

from flask import json
from be.models import SubjectsEnum, db
from sqlalchemy import Enum
from be.models.questions import DificultyLevel, QuestionType

from be.utils.chatgpt import Assitant

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

    students_questions = db.relationship('StudentQuestion', back_populates='question', lazy=True)
    
    __mapper_args__ = {
        "polymorphic_on": qtype,
    }

    def validate_answer(self,student_answer):
        msg=f"""
        Subject: {self.subject.value}
        Question level according to the lecturer: {self.level.value}
        Question: {self.question}
        Correct Answer: {self.correct_answer}
        Student Answer: {student_answer}

        respond in json format {{score:number,assessment:string}}

        """
        validator=Assitant("question_validator")
        json_txt=validator.send_question(msg)
        result=json.loads(json_txt)
        if("score" not in result or "assessment" not in result):
            raise Exception("Invalid response from the model")
        result["correct_answer"]=self.correct_answer
        return result

    
    def to_json(self):
        return {
            'id': self.id,
            'description': self.shortDescription,
            'question': self.question,
            'level': self.level.value,
            'subject': self.subject.value,
            'qtype': self.qtype.value,
        }
