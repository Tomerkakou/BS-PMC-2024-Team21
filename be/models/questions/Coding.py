from be.models import db
from be.models.questions import Question, QuestionType

class Coding(Question.Question):

    id = db.Column(db.Integer, db.ForeignKey("question.id"), primary_key=True)
    template = db.Column(db.Text, nullable=False)
    
    def to_json(self):
        json=super().to_json()
        json['template']=self.template
        return json

    __mapper_args__ = {
        "polymorphic_identity": QuestionType.CODING, 
    }