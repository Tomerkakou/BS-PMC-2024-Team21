from flask import Flask
from flask_cors import CORS
from models import db
from flask import jsonify, request
from dotenv import load_dotenv
from models.User import User,bcrypt
from models.Token import Token
from routes.auth import auth_blu, jwt
from routes.statistics import stats_blu
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
app.register_blueprint(stats_blu, url_prefix='/api/statistics')    


    
if __name__ == '__main__':
    with app.app_context():
        print("Creating database tables...")
        db.create_all()
        print("Tables created successfully.")
    app.run(debug=True)
    
