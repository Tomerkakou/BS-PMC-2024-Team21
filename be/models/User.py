from sqlalchemy import Enum
from sqlalchemy.dialects.mysql import LONGTEXT
import enum
from be.models import db
from flask_bcrypt import Bcrypt
import uuid

bcrypt = Bcrypt()

class RoleEnum(enum.Enum):
    Student = 'Student'
    Lecturer = 'Lecturer'
    Admin = 'Admin'


class User(db.Model):
    id = db.Column(db.String(50), primary_key=True,default=lambda : str(uuid.uuid4())[0:49])
    email = db.Column(db.String(50),nullable=False,unique=True)
    password=db.Column(db.String(256),nullable=False)
    firstName =db.Column(db.String(50), nullable=False)
    lastName =db.Column(db.String(50), nullable=False)
    role = db.Column(Enum(RoleEnum))
    verifiedEmail=db.Column(db.Boolean,nullable=False,default=False)
    active = db.Column(db.Boolean,nullable=False,default=False)
    avatar = db.Column(LONGTEXT,nullable=False)
    tokens = db.relationship('Token', backref='user', lazy=False)
    _ = db.relationship('Notification', backref='belongTo', lazy=True)
    notifications = db.relationship('Notification', secondary = 'user_notification', back_populates = 'users')
    
    __mapper_args__ = {
        "polymorphic_identity": RoleEnum.Admin,
        "polymorphic_on": role,
    }

    
    def checkPassword(self,password):
        return bcrypt.check_password_hash(self.password,password)
    
    
    def hashPassword(self):
        self.password = bcrypt.generate_password_hash(self.password).decode('utf-8')

    @property
    def fullName(self):
        return f'{self.firstName} {self.lastName}'

class Student(User):
    id = db.Column(db.String(50), db.ForeignKey("user.id"), primary_key=True)
    lecturers = db.relationship('Lecturer', secondary = 'student_lecturer', back_populates = 'students')
    __mapper_args__ = {
        "polymorphic_identity":  RoleEnum.Student,
    }


class Lecturer(User):
    id = db.Column(db.String(50), db.ForeignKey("user.id"), primary_key=True)
    students = db.relationship('Student', secondary = 'student_lecturer', back_populates = 'lecturers')
    __mapper_args__ = {
        "polymorphic_identity":  RoleEnum.Lecturer,
    }


student_lecturer = db.Table(
  'student_lecturer',
  db.Column('student_id', db.String(50), db.ForeignKey('student.id')),
  db.Column('lecturer_id', db.String(50), db.ForeignKey('lecturer.id'))
)