from sqlalchemy import Enum
import enum
from models import db
from flask_bcrypt import Bcrypt
from sqlalchemy import event
import uuid

bcrypt = Bcrypt()

class TokenTypeEnum(enum.Enum):
    VerifyEmail = 'VerifyEmail'
    ResetPass = 'ResetPass'
    


class Token(db.Model):
    Token = db.Column(db.String(50), primary_key=True)
    user_id = db.Column(db.String(50), db.ForeignKey("user.id"), nullable=False)
    token_type = db.Column(db.Enum(TokenTypeEnum))
    