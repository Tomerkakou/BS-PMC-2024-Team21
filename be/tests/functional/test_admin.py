
def test_activate_user(client,_db,auth_admin,student):
    data = [student.id]
    with client:
        response = client.post('/api/admin/activate-user', json=data, headers={
            'Authorization': f'Bearer {auth_admin["accessToken"]}'})
        assert response.status_code == 200
        data = response.get_json()
        assert data  == {'message':f'{student.firstName} {student.lastName} Activated','users_id': [student.id]}
        assert student.active == True

def test_deactivate_user(client,_db,auth_admin,student):
    data = [student.id]
    with client:
        response = client.post('/api/admin/deactivate-user', json=data, headers={
            'Authorization': f'Bearer {auth_admin["accessToken"]}'})
        assert response.status_code == 200
        data = response.get_json()
        assert data  == {'message':f'{student.firstName} {student.lastName} Deleted','users_id': [student.id]}
        assert student.active == False

def test_getusers(client,_db,auth_admin,lecturer,student):
    with client:
        response = client.get('/api/admin/getusers', headers={
            'Authorization': f'Bearer {auth_admin["accessToken"]}'})
        assert response.status_code == 200
        data = response.get_json()
        assert len(data) == 2