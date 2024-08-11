from be.models.questions.Question import Question
import json



def test_new_question(client,auth_lecturer,_db):
    data={
        "qtype":"Open",
        "question": "heelo",
        "subject" : "Java",
        "shortDescription" : "dsasdasd",
        'level' : "Easy",
        "correct_answer": "yes",
        "using_ai": False
    }
    with client:
        response = client.post('/api/lecturer/new-question',json=data,headers={
        'Authorization': f'Bearer {auth_lecturer["accessToken"]}'})
        question=Question.query.filter_by(shortDescription="dsasdasd").first()
        assert response.status_code == 200
        assert question is not None


def test_get_questions(client, auth_lecturer, _db, lecturer):
    with client:
        response = client.get('/api/lecturer/questions', headers={
            'Authorization': f'Bearer {auth_lecturer["accessToken"]}'
        })
        assert response.status_code == 200
        data = json.loads(response.data)
        assert len(data) == 1
        assert "using_ai" in data[0]
        assert data[0]["using_ai"]==False

def test_get_question(client, auth_lecturer, _db,):
    with client:
        response = client.get('/api/lecturer/question/1', headers={
            'Authorization': f'Bearer {auth_lecturer["accessToken"]}'
        })
        assert response.status_code == 200
        



def test_change_question(client,auth_lecturer,_db):
    data={
        "question": "heelo",
        "subject" : "Java",
        "shortDescription" : "newTest",
        'level' : "Easy",
        "correct_answer": "yes"
    }
    with client:
        response = client.patch('/api/lecturer/question/1',json=data,headers={
        'Authorization': f'Bearer {auth_lecturer["accessToken"]}'})
        question=Question.query.filter_by(shortDescription="newTest").first()
        assert response.status_code == 200
        assert question is not None


def test_remove_question(client,auth_lecturer,_db):
    data=[1]
    with client:
        response = client.post('/api/lecturer/remove-questions',json=data, headers={
            'Authorization': f'Bearer {auth_lecturer["accessToken"]}'
        })
        assert response.status_code == 200

        
