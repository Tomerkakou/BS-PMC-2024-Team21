import os
from datetime import timedelta
class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI")
    SECRET_KEY = os.getenv("SECRET_KEY")
    JWT_SECRET_KEY = os.getenv("SECRET_KEY")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class DevelopmentConfig(Config):
    DEBUG = True
    # JWT_ACCESS_TOKEN_EXPIRES=timedelta(days=1)
    # JWT_REFRESH_TOKEN_EXPIRES=timedelta(days=3)
    SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI")

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI-TESTING")

class ProductionConfig(Config):
    # JWT_ACCESS_TOKEN_EXPIRES=timedelta(hours=1)
    # JWT_REFRESH_TOKEN_EXPIRES=timedelta(hours=24)
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI")
