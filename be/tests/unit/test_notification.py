
from models.Notification import NotificationType
from datetime import datetime

def test_notification(notification):
    assert notification.type==NotificationType.VerifyUser
    assert notification.createdAt is not None
    assert notification.createdAt < datetime.now()
    assert notification.title=='Test'

def test_notification_user(notification,admin):
    assert admin in notification.users
    assert len(notification.users)==1
    assert notification in admin.notifications