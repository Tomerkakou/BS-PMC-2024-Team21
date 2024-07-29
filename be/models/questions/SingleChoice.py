from be.models import db
from be.models.questions import Question, QuestionType

class SingleChoice(Question.Question):
    id = db.Column(db.Integer, db.ForeignKey("question.id"), primary_key=True)

    option1 = db.Column(db.String(100), nullable=False)
    option2 = db.Column(db.String(100), nullable=False)
    option3 = db.Column(db.String(100), nullable=False)
    option4 = db.Column(db.String(100), nullable=False)

    __mapper_args__ = {
        "polymorphic_identity": QuestionType.SINGLE_CHOICE, 
    }


    def validate_answer(self, student_answer):
        return  (10 if self.answer == student_answer else 0)