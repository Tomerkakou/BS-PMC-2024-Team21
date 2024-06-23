from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import pymysql
from dotenv import load_dotenv
import os

#env
load_dotenv()

#flask app
app = Flask(__name__)


#sqlachemy db
pymysql.install_as_MySQLdb()
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql://learnix:TomerKakou.123@192.168.4.70/learnix"
db = SQLAlchemy()
db.init_app(app)



@app.route('/')
def hello():
    return os.getenv("DB_URL")

if __name__ == '__main__':
    app.run(debug=True)