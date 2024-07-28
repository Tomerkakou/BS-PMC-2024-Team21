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