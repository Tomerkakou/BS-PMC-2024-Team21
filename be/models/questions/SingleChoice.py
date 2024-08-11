from be.models import db
from be.models.questions import Question, QuestionType

class SingleChoice(Question.Question):
    id = db.Column(db.Integer, db.ForeignKey("question.id"), primary_key=True)

    option1 = db.Column(db.String(100), nullable=False)
    option2 = db.Column(db.String(100), nullable=False)
    option3 = db.Column(db.String(100), nullable=False)
    option4 = db.Column(db.String(100), nullable=False)

    def to_json(self):
        json= super().to_json()
        json["options"]= [self.option1,self.option2,self.option3,self.option4]
        return json

    __mapper_args__ = {
        "polymorphic_identity": QuestionType.SINGLE_CHOICE, 
    }


    def validate_answer(self, student_answer):
        return  {"score":(10 if self.correct_answer == student_answer else 1),"assessment":"","correct_answer":self.correct_answer}
    
    ai_schema="""
    { 
       short_description: (max 100 characters)
       question: 
       correct_answer: 
       option2 : 
       option3: 
       option4: 
    }
"""