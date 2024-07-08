from flask import Flask
from flask_cors import CORS
from models import db
from dotenv import load_dotenv
from models.User import bcrypt
from routes.auth import auth_blu, jwt

import os

#env
load_dotenv()

#flask app
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("SQLALCHEMY_DATABASE_URI")
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config['JWT_SECRET_KEY'] = os.getenv("SECRET_KEY")

db.init_app(app)
bcrypt.init_app(app)
jwt.init_app(app)

CORS(app)

app.register_blueprint(auth_blu, url_prefix='/api/auth')    


    
if __name__ == '__main__':
    with app.app_context():
        print("Creating database tables...")
        db.create_all()
        print("Tables created successfully.")
    app.run(debug=True)

    
