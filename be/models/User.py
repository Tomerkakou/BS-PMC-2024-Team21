from sqlalchemy import Enum
import enum
from models import db
from flask_bcrypt import Bcrypt
from sqlalchemy import event
import uuid

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
    avatar = db.Column(db.Text,nullable=True)

    tokens = db.relationship('Token', backref='user', lazy=False)
    
    def checkPassword(self,password):
        return bcrypt.check_password_hash(self.password,password)
    
    
    def hashPassword(self):
        self.password = bcrypt.generate_password_hash(self.password).decode('utf-8')

@event.listens_for(User, 'before_insert')
def generate_uuid(mapper, connection, target):
    if not target.id:
        target.id = str(uuid.uuid4())[0:49]
