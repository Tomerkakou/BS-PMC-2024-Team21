from sqlalchemy import Integer, String, column,Boolean,Enum
import enum
from models import db

class RoleEnum(enum.Enum):
    Student = 'Student'
    Lecturer = 'Lecturer'
    Admin = 'Admin'

class User(db.Model):
    id = db.Column(db.String(50), primary_key=True)
    email = db.Column(db.String(50),unique=True)
    password=db.Column(db.String(256),nullable=False)
    role = db.Column(Enum(RoleEnum))
    active = db.Column(db.Boolean,unique=False)

