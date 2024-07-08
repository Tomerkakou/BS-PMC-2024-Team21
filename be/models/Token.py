import enum
from models import db
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

class TokenTypeEnum(enum.Enum):
    VerifyEmail = 'VerifyEmail'
    ResetPassword = 'ResetPassword'
    


class Token(db.Model):
    token = db.Column(db.String(50), primary_key=True)
    user_id = db.Column(db.String(50), db.ForeignKey("user.id"), nullable=False)
    type = db.Column(db.Enum(TokenTypeEnum))
    