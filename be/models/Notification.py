import enum
from be.models import db
from datetime import datetime
from sqlalchemy.orm import backref

class NotificationType(enum.Enum):
    VerifyUser = 'VerifyUser'
    VerifyStudent = 'VerifyStudent'


class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(40), nullable=False)
    msg=db.Column(db.String(150), nullable=False)
    createdAt=db.Column(db.DateTime, default=datetime.now())
    type = db.Column(db.Enum(NotificationType))
    belongToId = db.Column(db.String(50), db.ForeignKey("user.id",ondelete='CASCADE'), nullable=True)
    belongTo = db.relationship('User', back_populates='_')
    users = db.relationship('User', secondary = 'user_notification', back_populates = 'notifications')

user_notification = db.Table(
  'user_notification',
  db.Column('user_id', db.String(50), db.ForeignKey('user.id', ondelete='CASCADE')),
  db.Column('notification_id', db.Integer, db.ForeignKey('notification.id', ondelete='CASCADE'))
)