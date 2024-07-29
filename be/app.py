import os
from flask import Flask
from flask_cors import CORS
from be.models import db
from dotenv import load_dotenv
from be.models.User import bcrypt
from be.routes.auth import auth_blu
from be.routes.statistics import stats_blu
from be.routes.admin import admin_blu
from be.routes.notification import notify_blu
from be.utils.jwt import jwt
from be.utils.socketio import socketio
from be.routes.student import student_blu
from be.routes.lecturer import lecturer_blu
load_dotenv()

def create_app(config_name=None):
    
    app = Flask(__name__)
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'production') or 'production'

    app.config.from_object(config_by_name[config_name])

    if app.debug:
        app.config.from_object(config_by_name['development'])

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
    app.register_blueprint(lecturer_blu,url_prefix='/api/lecturer')

    @app.get('/')
    def index():
        print(config_name)
        return config_name , 200
    
    return app

config_by_name = {
    'development': 'be.config.DevelopmentConfig',
    'testing': 'be.config.TestingConfig',
    'production': 'be.config.ProductionConfig',
}

if __name__ == '__main__':
    app = create_app('development')  # Run in development mode by default

    with app.app_context():
        print("Creating database tables...")
        #db.drop_all()
        db.create_all()
        print("Tables created successfully.")

    app.run(debug=True)
