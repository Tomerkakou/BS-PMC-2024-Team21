from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import text

import pymysql
from dotenv import load_dotenv
import os

#env
load_dotenv()

#flask app
app = Flask(__name__)


#sqlachemy db
pymysql.install_as_MySQLdb()
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("SQLALCHEMY_DATABASE_URI")
db = SQLAlchemy()
db.init_app(app)



@app.route('/')
def hello():
    return str(db.session.execute(text('SELECT * FROM test')).fetchall())

if __name__ == '__main__':
    app.run(debug=True)