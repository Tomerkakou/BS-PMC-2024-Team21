from flask import Flask
from flask_cors import CORS
from models import db
from flask import jsonify, request
from dotenv import load_dotenv
from models.User import User,bcrypt
import os

#env
load_dotenv()

#flask app
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("SQLALCHEMY_DATABASE_URI")
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
db.init_app(app)
bcrypt.init_app(app)

CORS(app)


@app.get('/api/hello')
def hello():
    return "Hello World!",200
    

    


    
if __name__ == '__main__':
    with app.app_context():
        print("Creating database tables...")
        db.create_all()
        print("Tables created successfully.")
    app.run(debug=True,port=5000,host='0.0.0.0')
    
