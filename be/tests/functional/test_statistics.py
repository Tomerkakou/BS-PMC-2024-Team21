def test_usercount(client,auth_admin):
    with client:
        response = client.get('/api/statistics/usercount', headers={
            'Authorization': f'Bearer {auth_admin["accessToken"]}'})   
        assert response.status_code == 200
        data = response.get_json()
        assert 'count' in data
        assert data['count'] == 1

def test_usercount3(client,auth_admin,student,lecturer):
    with client:
        response = client.get('/api/statistics/usercount', headers={
            'Authorization': f'Bearer {auth_admin["accessToken"]}'})   
        assert response.status_code == 200
        data = response.get_json()
        assert 'count' in data
        assert data['count'] == 3

def test_usercount_notadmin(client,auth_lecturer):
    with client:
        response = client.get('/api/statistics/usercount', headers={
            'Authorization': f'Bearer {auth_lecturer["accessToken"]}'})   
        assert response.status_code == 403

def test_usercount_notauth(client):
    with client:
        response = client.get('/api/statistics/usercount')   
        assert response.status_code == 401