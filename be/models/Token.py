import enum
import uuid
from be.models import db
from sqlalchemy.orm import backref

class TokenTypeEnum(enum.Enum):
    VerifyEmail = 'VerifyEmail'
    ResetPassword = 'ResetPassword'
    


class Token(db.Model):
    token = db.Column(db.String(50), primary_key=True,default=lambda : str(uuid.uuid4())[0:49])
    user_id = db.Column(db.String(50), db.ForeignKey("user.id", ondelete='CASCADE'), nullable=False)
    user = db.relationship('User', back_populates='tokens')
    type = db.Column(db.Enum(TokenTypeEnum))
    