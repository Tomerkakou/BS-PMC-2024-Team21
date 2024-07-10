from models.User import User,RoleEnum
import pytest

@pytest.fixture(scope='module',name='user')
def insert_user(_db):
    user = User(email = 'example@example.com', password = 'Test1234', firstName = 'Test', lastName = 'User', role= RoleEnum.Student,avatar='avatar')
    _db.session.add(user)
    _db.session.commit()
    return user

def test_get_user(user):
    assert user.id is not None
    retrieved_user = User.query.filter_by(id=user.id).first()
    assert retrieved_user is not None
    assert retrieved_user.id == user.id
    assert retrieved_user.email == user.email
    assert retrieved_user.password == user.password


def test_user_hash_password(user):
    user.hashPassword()
    assert user.password != 'Test1234'

def test_user_check_password(user):
    assert user.checkPassword('Test1234') == True
    assert user.checkPassword('Test12345') == False


    
