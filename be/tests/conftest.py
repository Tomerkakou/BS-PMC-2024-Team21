import pytest
import sys
import os
sys.path.append(os.path.abspath(os.path.dirname(__file__) + '/../'))
from app import create_app
from models import db


@pytest.fixture(scope='session')
def app():
    """Create and configure a new app instance for each test session."""
    app = create_app('testing')

    with app.app_context():
        yield app

@pytest.fixture(scope='session',name='client')
def test_client(app):
    """Create a test client for the Flask application."""
    with app.test_client() as testing_client:
        with app.app_context():
            yield testing_client

@pytest.fixture(scope='session',name='_db')
def init_db(app):
    """Initialize the test database."""
    with app.app_context():
        print("Creating database tables...")
        db.create_all()  # Create tables

        yield db  
        print("Dropping database tables...")
        db.session.remove()
        db.drop_all()  # Drop tables