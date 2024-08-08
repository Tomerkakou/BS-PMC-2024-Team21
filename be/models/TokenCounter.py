from be.models import db

class TokenCounter(db.Model):
    tokens = db.Column(db.Integer, nullable=False, default=0,primary_key=True)