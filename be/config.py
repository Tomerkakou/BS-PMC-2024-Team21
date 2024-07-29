import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI")
    SECRET_KEY = os.getenv("SECRET_KEY")
    JWT_SECRET_KEY = os.getenv("SECRET_KEY")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SENDGRID_API_KEY=os.getenv("SENDGRID_API_KEY")
    SENDGRID_API_EMAIL=os.getenv("SENDGRID_API_EMAIL")
    BASE_URL = os.getenv("BASE_URL")
    FRONT_URL = os.getenv("FRONT_URL")
    OPENAI_API_KEY = os.getenv("OPEN_AI_KEY")

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI")

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'mysql://learnix:TomerKakou.123@213.8.44.35:3309/learnix-test'#os.getenv("SQLALCHEMY_DATABASE_URI_TESTING")
    FRONT_TEST_URL = 'http://bs-react:6749'

class ProductionConfig(Config):
    DEBUG = False
