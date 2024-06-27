from flask import Flask, redirect
from flask_cors import CORS
from models import db
from models.User import User
from flask import jsonify, request
from dotenv import load_dotenv
import os

#env
load_dotenv()

#flask app
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("SQLALCHEMY_DATABASE_URI")
db.init_app(app)
CORS(app)


@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    userEmail = data.get('email')
    userPassword = data.get('password')
    user = User.query.filter_by(id="Admin").first()
    if user:
        return jsonify("ok"), 200

        




if __name__ == '__main__':
    with app.app_context():
        print("Creating database tables...")
        db.create_all()
        print("Tables created successfully.")
    app.run(debug=True)
    
