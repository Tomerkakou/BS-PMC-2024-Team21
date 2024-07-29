import pytest
from be.app import create_app
from be.models import db
from be.models.User import Lecturer, RoleEnum, Student, User
from be.models.Token import Token, TokenTypeEnum
from be.models.Notification import Notification, NotificationType

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from chromedriver_py import binary_path

def get_driver():
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--remote-debugging-port=9222")
    svc = webdriver.ChromeService(executable_path=binary_path)
    driver = webdriver.Chrome(service=svc,options=options)
    return driver

@pytest.fixture(scope="module")
def driver():
    driver = get_driver()
    yield driver
    driver.quit()

@pytest.fixture(scope="session")
def front_url(app):
    return app.config['FRONT_TEST_URL']


@pytest.fixture(scope='session')
def app():
    """Create and configure a new app instance for each test session."""
    app = create_app('testing')

    with app.app_context():
        yield app

@pytest.fixture(scope='session',name='client')
def test_client(app):
    """Create a test client for the Flask application."""
    return app.test_client()

@pytest.fixture(scope='session',name='_db')
def init_db(app):
    """Initialize the test database."""
    with app.app_context():
        print("Creating database tables...")
        db.create_all()  # Create tables

        yield db  

        print("Dropping database tables...")
        db.drop_all()  # Drop tables
        

@pytest.fixture(scope='module',name='admin')
def insert_admin(_db):
    user = User(email = 'example@example.com', password = 'Test1234', firstName = 'Test', lastName = 'User', role= RoleEnum.Admin,avatar='avatar')
    _db.session.add(user)
    _db.session.commit()
    yield user

    _db.session.delete(user)
    _db.session.commit()

@pytest.fixture(scope='module',name='student')
def insert_student(_db):
    user = Student(email = 'example2@example.com', password = 'Test1234', firstName = 'Test', lastName = 'User', role= RoleEnum.Student,avatar='avatar')
    _db.session.add(user)
    _db.session.commit()
    yield user

    _db.session.delete(user)
    _db.session.commit()

@pytest.fixture(scope='module',name='lecturer')
def insert_lecturer(_db):
    user = Lecturer(email = 'example3@example.com', password = 'Test1234', firstName = 'Test', lastName = 'User', role= RoleEnum.Lecturer,avatar='avatar')
    _db.session.add(user)
    _db.session.commit()
    yield user

    _db.session.delete(user)
    _db.session.commit()

@pytest.fixture(scope='module',name='token_email')
def insert_token_email(_db,admin):
    token=Token(user_id=admin.id,type=TokenTypeEnum.VerifyEmail)
    _db.session.add(token)
    _db.session.commit()
    yield token
    _db.session.delete(token)
    _db.session.commit()

@pytest.fixture(scope='module',name='token_password')
def insert_token_password(_db,admin):
    token=Token(user_id=admin.id,type=TokenTypeEnum.ResetPassword)
    _db.session.add(token)
    _db.session.commit()
    yield token
    _db.session.delete(token)
    _db.session.commit()

@pytest.fixture(scope='module',name='notification')
def insert_notification(_db,admin,lecturer):
    notification=Notification(title='Test',
                              msg='Test',
                              type=NotificationType.VerifyUser,
                              belongToId=lecturer.id,
                              users=[admin])
    _db.session.add(notification)
    _db.session.commit()
    yield notification
    _db.session.delete(notification)
    _db.session.commit()

@pytest.fixture(scope='module',name='auth_admin')
def autherized_admin(client,admin,_db):
    data = {
        "email": admin.email,
        "password": admin.password
    }
    admin.hashPassword()
    admin.verifiedEmail=True
    admin.active=True
    _db.session.commit()
    with client:
        response = client.post('/api/auth/login', json=data)
        assert response.status_code == 200
        return response.get_json()
    
@pytest.fixture(scope='module',name='auth_student')
def autherized_student(client,student,_db):
    data = {
        "email": student.email,
        "password": student.password
    }
    student.hashPassword()
    student.verifiedEmail=True
    student.active=True
    _db.session.commit()
    with client:
        response = client.post('/api/auth/login', json=data)
        assert response.status_code == 200
        return response.get_json()
    
@pytest.fixture(scope='module',name='auth_lecturer')
def autherized_lecturer(client,lecturer,_db):
    data = {
        "email": lecturer.email,
        "password": lecturer.password
    }
    lecturer.hashPassword()
    lecturer.verifiedEmail=True
    lecturer.active=True
    _db.session.commit()
    with client:
        response = client.post('/api/auth/login', json=data)
        assert response.status_code == 200
        return response.get_json()