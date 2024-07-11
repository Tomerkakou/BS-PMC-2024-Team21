from flask import Flask
from flask_cors import CORS
from models import db
from dotenv import load_dotenv
from models.User import bcrypt
from routes.auth import auth_blu, jwt
from routes.statistics import stats_blu
from routes.admin import admin_blu
load_dotenv()

def create_app(config_name='development'):
    app = Flask(__name__)

    app.config.from_object(config_by_name[config_name])

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    CORS(app)

    app.register_blueprint(auth_blu, url_prefix='/api/auth')
    app.register_blueprint(stats_blu, url_prefix='/api/statistics')
    app.register_blueprint(admin_blu, url_prefix='/api/admin')

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
        db.create_all()
        print("Tables created successfully.")

    app.run(debug=True)
