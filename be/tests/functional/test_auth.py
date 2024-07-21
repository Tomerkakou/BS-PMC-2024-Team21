
from flask import current_app
from models.Token import  TokenTypeEnum
from models.User import User

def test_signUp(client):
    data = {
        "email": "tomerTheKing@gmail.com",
        "password": "123456",
        "firstName": "Tomer",
        "lastName": "King",
        "role": "Admin",
        "avatar": "avatar"
    }
    with client:
        response = client.post('/api/auth/sign-up', json=data)
        assert response.status_code == 201
        assert b'success' in response.data

        user=User.query.filter_by(email="tomerTheKing@gmail.com").first()
        assert user is not None


def test_signup_same_email(client):
    data = {
        "email": "tomerTheKing@gmail.com",
        "password": "123456",
        "firstName": "Tomer",
        "lastName": "King",
        "role": "Admin",
        "avatar": "avatar"
    }
    with client:
        response = client.post('/api/auth/sign-up', json=data)
        assert response.status_code == 400
        assert  b"Email already exist!" in response.data

def test_login_notverified(client):
    data = {
        "email": "tomerTheKing@gmail.com",
        "password": "123456"
    }
    with client:
        response = client.post('/api/auth/login', json=data)
        assert response.status_code == 400
        assert b"Please Verify Your Email" in response.data


def test_verify_email(client):
    user=User.query.filter_by(email="tomerTheKing@gmail.com").first()
    token = user.tokens[0].token
    with client:
        response = client.get(f'/api/auth/verify-email?token={token}')
        assert response.status_code == 302
        assert response.headers["Location"] == current_app.config['FRONT_URL']
        assert user.verifiedEmail == True
        assert user.active == False


def test_login_notactive(client):
    data = {
        "email": "tomerTheKing@gmail.com",
        "password": "123456"
    }
    with client:
        response = client.post('/api/auth/login', json=data)
        assert response.status_code == 400
        assert b"Wait For Admin To Aprove Your Account" in response.data

def test_login(client,_db):
    user=User.query.filter_by(email="tomerTheKing@gmail.com").first()
    user.active=True
    _db.session.commit()
    data = {
        "email": "tomerTheKing@gmail.com",
        "password": "123456"
    }
    with client:
        response = client.post('/api/auth/login', json=data)
        assert response.status_code == 200
        data = response.get_json()
        assert 'accessToken' in data
        assert 'refreshToken' in data

def test_login_fail(client):
    data = {
        "email": "sagasdgasg",
        "password": "123456"
    }
    data2 = {
        "email": "tomerTheKing@gmail.com",
        "password": "1234567"
    }
    with client:
        response = client.post('/api/auth/login', json=data)
        assert response.status_code == 400
        assert b'Invalid Email Or Password'
        response = client.post('/api/auth/login', json=data2)
        assert response.status_code == 400
        assert b'Invalid Email Or Password'

def test_forgot_password(client):
    data = {
        "email": "tomerTheKing@gmail.com"
    }
    with client:
        response = client.post('/api/auth/forgot-password', json=data)
        assert response.status_code == 201
        assert b'Email sent' in response.data

def test_reset_password(client):
    user=User.query.filter_by(email="tomerTheKing@gmail.com").first()
    token = [token.token for token in user.tokens if token.type == TokenTypeEnum.ResetPassword][0]
    data = {
        "password": "123",
        "token": token,
    }
    with client:
        response = client.post('/api/auth/reset-password', json=data)
        assert response.status_code == 200
        assert b'ok' in response.data
        assert user.checkPassword("123") == True

def test_reset_password_fail(client):
    data = {
        "password": "123",
        "token": "asdasd"
    }
    with client:
        response = client.post('/api/auth/reset-password', json=data)
        assert response.status_code == 400
        assert b"Invalid token" in response.data

def test_get_user(client,auth_admin,admin):
    accessToken=auth_admin['accessToken']
    with client:
        response = client.get('/api/auth/get-user',
                              headers={'Authorization': f'Bearer {accessToken}'})
        assert response.status_code == 200
        data = response.get_json()
        assert 'id' in data
        assert 'email' in data
        assert 'firstName' in data
        assert 'lastName' in data
        assert 'avatar' in data
        assert data['email'] == admin.email

def test_refresh_token(client,auth_admin):
    refreshToken=auth_admin['refreshToken']
    with client:
        response = client.post('/api/auth/refresh-token',
                              headers={'Authorization': f'Bearer {refreshToken}'})
        assert response.status_code == 200
        data = response.get_json()
        assert 'accessToken' in data
        assert 'refreshToken' in data

def test_cleanUp(_db):
    user=User.query.filter_by(email="tomerTheKing@gmail.com").first()
    _db.session.delete(user)
    _db.session.commit()
    assert len(User.query.filter_by(email="tomerTheKing@gmail.com").all()) == 0
    

