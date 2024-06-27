from flask import Flask
from models import db,User


from dotenv import load_dotenv
import os

#env
load_dotenv()

#flask app
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("SQLALCHEMY_DATABASE_URI")
db.init_app(app)





if __name__ == '__main__':
    with app.app_context():
        print("Creating database tables...")
        db.create_all()
        print("Tables created successfully.")
    app.run(debug=True)
    
