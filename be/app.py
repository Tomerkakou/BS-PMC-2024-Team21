from flask import Flask
from flask_cors import CORS
from models import db
from dotenv import load_dotenv
from models.User import bcrypt
from routes.auth import auth_blu
from routes.statistics import stats_blu
from routes.admin import admin_blu
from routes.notification import notify_blu
from utils.jsonEncoder import CJSONEncoder
from utils.jwt import jwt
from utils.socketio import socketio
from routes.student import student_blu

load_dotenv()

def create_app(config_name='development'):
    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])
    CORS(app)

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    socketio.init_app(app)
    
    app.register_blueprint(auth_blu, url_prefix='/api/auth')
    app.register_blueprint(stats_blu, url_prefix='/api/statistics')
    app.register_blueprint(admin_blu, url_prefix='/api/admin')
    app.register_blueprint(notify_blu,url_prefix='/api/notification')
    app.register_blueprint(student_blu,url_prefix='/api/student')

    @app.get('/')
    def index():
        return "Welcome to the API!" , 200

    return app

config_by_name = {
    'development': 'config.DevelopmentConfig',
    'testing': 'config.TestingConfig',
    'production': 'config.ProductionConfig',
}

if __name__ == '__main__':
    app = create_app('development')  # Run in development mode by default

    with app.app_context():
        print("Creating database tables...")
        #db.drop_all()
        db.create_all()
        print("Tables created successfully.")

    app.run(debug=True)
