from be.models.questions.Question import Question
import json
import PyPDF2
from io import BytesIO
from datetime import datetime


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
        
        
def test_validate_answer(client,_db,auth_student):
    data={
        "question_id":"1",
        "answer": "heelo"
    }
    with client:
        response = client.post('/api/question/validate-answer' ,json=data, headers={
            'Authorization': f'Bearer {auth_student["accessToken"]}'
        })
        assert response.status_code == 200

def test_get_validate_questions_student(client,_db,auth_student):

    with client:
        response = client.get('/api/student/get-questions', headers={
            'Authorization': f'Bearer {auth_student["accessToken"]}'
        })
        assert response.status_code == 200
        data = json.loads(response.data)
        assert len(data) == 1

def test_get_answered_questions_lecturer(client,_db,auth_lecturer):

    with client:
        response = client.get('/api/question/answered', headers={
            'Authorization': f'Bearer {auth_lecturer["accessToken"]}'
        })
        assert response.status_code == 200

def test_get_assasment_lecturer(client,_db,auth_lecturer):

    data={
        "assasment":"food",
        "score": "9"
    }
    with client:
        response = client.post('/api/question/assasment/1',json=data, headers={
            'Authorization': f'Bearer {auth_lecturer["accessToken"]}'
        })
        assert response.status_code == 200

def test_get_grades(client, _db, auth_student):
    with client:
        response = client.get('/api/student/get-grades', headers={
            'Authorization': f'Bearer {auth_student["accessToken"]}'
        })
        
     
        assert response.status_code == 200
        
       
        assert response.headers['Content-Type'] == 'application/pdf'
        

        assert response.data[:4] == b'%PDF'

   
        pdf_reader = PyPDF2.PdfReader(BytesIO(response.data))
        pdf_text = ""
        for page in range(len(pdf_reader.pages)):
            pdf_text += pdf_reader.pages[page].extract_text()

        assert "Total Average: 9.0" in pdf_text

def test_student_progress(client, auth_student):
    with client:
        response = client.get('/api/student/student-progress', headers={
            'Authorization': f'Bearer {auth_student["accessToken"]}'
        })

        assert response.status_code == 200
        response_data = json.loads(response.data.decode('utf-8'))

        grades_by_subject = response_data['grades_by_subject']
        for grades in grades_by_subject.items():
            assert len(grades[1]) == 10
        
        date_ranges = response_data['date_ranges']
        assert len(date_ranges) == 10
 
        date_format = "%Y-%m-%d"  # Adjust this format if needed
        dates = [datetime.strptime(date_str, date_format) for date_str in date_ranges]
        
        # Check if the difference between consecutive dates is 3 days
        for i in range(1, len(dates)):
            date_diff = dates[i] - dates[i - 1]
            assert date_diff.days == 3

def test_student_avgs(client, auth_student):
    with client:
        response = client.get('/api/student/subject-averages', headers={
            'Authorization': f'Bearer {auth_student["accessToken"]}'
        })

        assert response.status_code == 200
        response_data = json.loads(response.data.decode('utf-8'))
        assert len(response_data) == 1
        assert response_data['Java'] == 9.0
        
def test_student_ans_count(client, auth_student):
    with client:
        response = client.get('/api/student/student-answer-count', headers={
            'Authorization': f'Bearer {auth_student["accessToken"]}'
        })

        assert response.status_code == 200
        response_data = json.loads(response.data.decode('utf-8'))
        assert len(response_data) == 1
        assert response_data['Java'] == 1


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

        