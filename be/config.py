class Config:
    SQLALCHEMY_DATABASE_URI = ''
    SECRET_KEY = 'ASASLKGHASLKDHGASKLHGASKLDGALSAD'
    JWT_SECRET_KEY = 'ASASLKGHASLKDHGASKLHGASKLDGALSAD'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SENDGRID_API_KEY=''
    SENDGRID_API_EMAIL='tomerka3@ac.sce.ac.il'
    BASE_URL = 'http://localhost:5000/api'
    FRONT_URL = 'http://localhost:3000'
    OPENAI_API_KEY = ''

class DevelopmentConfig(Config):
    DEBUG = True

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = ''
    FRONT_TEST_URL = 'http://bs-react:6749'

class ProductionConfig(Config):
    DEBUG = False
