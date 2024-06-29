from sqlalchemy import Enum
import enum
from models import db
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

class RoleEnum(enum.Enum):
    Student = 'Student'
    Lecturer = 'Lecturer'
    Admin = 'Admin'

class User(db.Model):
    id = db.Column(db.String(50), primary_key=True)
    email = db.Column(db.String(50),nullable=False,unique=True)
    password=db.Column(db.String(256),nullable=False)
    firstName =db.Column(db.String(50), nullable=False)
    lastName =db.Column(db.String(50), nullable=False)
    role = db.Column(Enum(RoleEnum),default=RoleEnum.Student)
    verifiedEmail=db.Column(db.Boolean,nullable=False,default=False)
    active = db.Column(db.Boolean,nullable=False,default=False)
    refresh_token = db.Column(db.String(256),nullable=True)
    avatar = db.Column(db.String(256),nullable=True)

    def checkPassword(self,password):
        return bcrypt.check_password_hash(self.password,password)
    
    def hashPassword(self,password):
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

