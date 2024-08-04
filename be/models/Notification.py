import enum
from be.models import db
from datetime import datetime
from sqlalchemy.orm import backref

class NotificationType(enum.Enum):
    VerifyUser = 'VerifyUser'
    VerifyStudent = 'VerifyStudent'
    NewDocument = 'NewDocument'
    Assasment='Assasment'


class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(40), nullable=False)
    msg=db.Column(db.String(150), nullable=False)
    createdAt=db.Column(db.DateTime, default=datetime.now())
    type = db.Column(db.Enum(NotificationType), nullable=False)
    belongToId = db.Column(db.String(50), db.ForeignKey("user.id",ondelete='CASCADE'), nullable=True)
    belongTo = db.relationship('User', back_populates='_')
    users = db.relationship('User', secondary = 'user_notification', back_populates = 'notifications')

    def to_json(self):
        return{
                "title" : self.title,
                "message": self.msg,
                "type":self.type.value,
                "belongTo" : self.belongTo.id if self.belongTo else None,
                "id":self.id,
                "avatar":self.belongTo.avatar if self.belongTo else None,
                "createdAt":self.createdAt.strftime('%Y-%m-%d %H:%M:%S')
            }

user_notification = db.Table(
  'user_notification',
  db.Column('user_id', db.String(50), db.ForeignKey('user.id', ondelete='CASCADE')),
  db.Column('notification_id', db.Integer, db.ForeignKey('notification.id', ondelete='CASCADE'))
)