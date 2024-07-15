import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI")
    SECRET_KEY = os.getenv("SECRET_KEY")
    JWT_SECRET_KEY = os.getenv("SECRET_KEY")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    BASE_URL = os.getenv("BASE_URL")
    FRONT_URL = os.getenv("FRONT_URL")

class DevelopmentConfig(Config):
    DEBUG = True
    # JWT_ACCESS_TOKEN_EXPIRES=timedelta(days=1)
    # JWT_REFRESH_TOKEN_EXPIRES=timedelta(days=3)
    SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI")

class TestingConfig(Config):
    TESTING = True
    SECRET_KEY = 'ASASLKGHASLKDHGASKLHGASKLDGALSAD'
    JWT_SECRET_KEY = 'ASASLKGHASLKDHGASKLHGASKLDGALSAD'
    SQLALCHEMY_DATABASE_URI = 'mysql://learnix:TomerKakou.123@213.8.44.35:3309/learnix-test'
    BASE_URL = 'http://localhost:6748/api'
    FRONT_URL = 'http://localhost:6749'

class ProductionConfig(Config):
    # JWT_ACCESS_TOKEN_EXPIRES=timedelta(hours=1)
    # JWT_REFRESH_TOKEN_EXPIRES=timedelta(hours=24)
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI")
