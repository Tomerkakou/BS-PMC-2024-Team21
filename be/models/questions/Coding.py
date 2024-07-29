from be.models import db
from be.models.questions import Question, QuestionType

class Coding(Question.Question):

    id = db.Column(db.Integer, db.ForeignKey("question.id"), primary_key=True)
    template = db.Column(db.Text, nullable=False)

    __mapper_args__ = {
        "polymorphic_identity": QuestionType.CODING, 
    }


    def validate_answer(self, student_answer):
        return True #TODO: Implement this method