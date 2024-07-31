from be.models.questions.Question import Question


def test_new_question(client,auth_lecturer,_db):
    data={
        "qtype":"Open",
        "question": "heelo",
        "subject" : "Java",
        "shortDescription" : "dsasdasd",
        'level' : "Easy",
        "correct_answer": "yes"
    }
    with client:
        response = client.post('/api/lecturer/new-question',json=data,headers={
        'Authorization': f'Bearer {auth_lecturer["accessToken"]}'})
        question=Question.query.filter_by(shortDescription="dsasdasd").first()
        assert response.status_code == 200
        assert question is not None
        _db.session.delete(question)
        _db.session.commit()

               