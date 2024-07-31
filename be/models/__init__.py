import enum
from flask_sqlalchemy import SQLAlchemy
import pymysql
#sqlachemy db
pymysql.install_as_MySQLdb()

db = SQLAlchemy()

class SubjectsEnum(enum.Enum):
    CSHARP = 'C#'
    Java = 'Java'
    Python = 'Python'
    JavaScript = 'JavaScript'
    SQL = 'SQL'

from be.models.Notification import Notification
from be.models.Token import Token
from be.models.User import User,Student,Lecturer
from be.models.questions.Question import Question
from be.models.questions.Coding import Coding
from be.models.questions.SingleChoice import SingleChoice
from be.models.questions.Open import Open
from be.models.PdfDocument import PdfDocument,PageSummarize
from be.models.questions.StudentQuestion import StudentQuestion
