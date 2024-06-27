from flask_sqlalchemy import SQLAlchemy
import pymysql
#sqlachemy db
pymysql.install_as_MySQLdb()

db = SQLAlchemy()