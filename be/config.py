class Config:
    SQLALCHEMY_DATABASE_URI = 'mysql://learnix:TomerKakou.123@213.8.44.35:3309/learnix'
    SECRET_KEY = 'ASASLKGHASLKDHGASKLHGASKLDGALSAD'
    JWT_SECRET_KEY = 'ASASLKGHASLKDHGASKLHGASKLDGALSAD'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SENDGRID_API_KEY='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'
    SENDGRID_API_EMAIL='tomerka3@ac.sce.ac.il'
    BASE_URL = 'http://localhost:5000/api'
    FRONT_URL = 'http://localhost:3000'
    OPENAI_API_KEY = 'sk-proj-QAbIZ6xlQEXiSNqgmOMBT3BlbkFJYakdWgqZGmxntzm1MkQ9'

class DevelopmentConfig(Config):
    DEBUG = True

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'mysql://learnix:TomerKakou.123@213.8.44.35:3309/learnix-test'
    FRONT_TEST_URL = 'http://bs-react:6749'

class ProductionConfig(Config):
    DEBUG = False
