

from flask import Blueprint, request, jsonify
from models.Notification import Notification,NotificationType
from models.User import User
from models import db
from flask_jwt_extended import jwt_required, current_user
from utils.socketio import socketio


notify_blu = Blueprint('notify',__name__)



@notify_blu.get('/activateUser')
@jwt_required()
def activateUser():
    user_id=request.args.get("id")
    user=User.query.filter_by(id=user_id).first()
    user.active=True
    notification=Notification.query.filter_by(belongToId=user.id,type=NotificationType.VerifyUser).first()
    notification_id=notification.id
    db.session.delete(notification)
    db.session.commit()
    socketio.emit('deleteNotification',[notification_id,])

    return "blahblah",200

@notify_blu.get('/dismiss')
@jwt_required()
def dismiss_notification():
    nft_id=request.args.get("id",type=int)
    notification=Notification.query.filter_by(id=nft_id).first()
    notification_id=notification.id
    db.session.delete(notification)
    db.session.commit()
    socketio.emit('deleteNotification',[notification_id,])

    return "blahblah",200


@notify_blu.get('/load-all')
@jwt_required()
def load_notifications():
    notifications=[generateNotification(n) for n in current_user.notifications]
    return jsonify(notifications),200   


def generateNotification(nft):
    return {
                "title" : nft.title,
                "message": nft.msg,
                "type":nft.type.value,
                "belongTo" : nft.belongTo.id,
                "id":nft.id,
                "avatar":nft.belongTo.avatar,
                "createdAt":nft.createdAt.strftime('%Y-%m-%d %H:%M:%S')
            }

