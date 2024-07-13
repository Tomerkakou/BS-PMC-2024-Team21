from models.Notification import Notification, NotificationType


def test_loadall(client,auth_admin,notification):
    with client:
        response = client.get('/api/notification/load-all', headers={
            'Authorization': f'Bearer {auth_admin["accessToken"]}'})
        assert response.status_code == 200
        data = response.get_json()
        assert len(data) == 1
        assert data[0]['title'] == notification.title
        assert data[0]['message'] == notification.msg
        assert data[0]['type'] == notification.type.value
        assert data[0]['belongTo'] == notification.belongTo.id
        assert data[0]['id'] == notification.id
    
def test_dismiss(client,auth_admin,admin,lecturer,_db):
    notification=Notification(title='Test',
                              msg='Test',
                              type=NotificationType.VerifyUser,
                              belongToId=lecturer.id,
                              users=[admin])
    _db.session.add(notification)
    _db.session.commit()
    with client:
        id=notification.id
        response = client.get(f'/api/notification/dismiss?id={notification.id}', headers={
            'Authorization': f'Bearer {auth_admin["accessToken"]}'})
        assert response.status_code == 200
        assert len(Notification.query.filter_by(id=id).all()) == 0