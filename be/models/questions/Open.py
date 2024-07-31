from be.models import db
from be.models.questions import Question, QuestionType

class Open(Question.Question):

    id = db.Column(db.Integer, db.ForeignKey("question.id"), primary_key=True)

    __mapper_args__ = {
        "polymorphic_identity": QuestionType.OPEN, 
    }