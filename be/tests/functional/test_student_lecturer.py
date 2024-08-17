from flask import current_app
from be.models.Token import  TokenTypeEnum
from be.models.User import User,Lecturer
from be.models.PdfDocument import PdfDocument,SubjectsEnum



def test_signUp_lecturer(client,_db,auth_student,lecturer,student):
    data=[lecturer.id]
    with client:
        response = client.post('/api/student/add-lecturers', json=data, headers={
        'Authorization': f'Bearer {auth_student["accessToken"]}'})
        assert response.status_code == 200


def test_aprove_student(client,_db,auth_lecturer,student):
    with client:
        response = client.get(f'/api/notification/studentApproval?id={student.id}', headers={
        'Authorization': f'Bearer {auth_lecturer["accessToken"]}'})
        assert response.status_code == 200


def test_get_students(client,_db,auth_lecturer,lecturer,student):
    data=[lecturer.id]
    with client:
        response = client.get('/api/lecturer/getstudents', headers={
        'Authorization': f'Bearer {auth_lecturer["accessToken"]}'})
        assert response.status_code == 200
        data = response.get_json()
        students=data["signed"]
        assert len(students) == 1
        assert "answers" in students[0] 
        assert students[0]["answers"]==False
        assert student in lecturer.students

def test_get_lecturers(client,_db,auth_student,student):
    with client:
        response = client.get('/api/student/getlecturer', headers={
        'Authorization': f'Bearer {auth_student["accessToken"]}'})
        data=response.get_json()["signed"]
        assert response.status_code == 200
        assert len(data)==1


def test_get_docs(client,_db,auth_student,lecturer):
    pdf=PdfDocument(subject = SubjectsEnum.JavaScript,docName="nir",description="aaaa",doc="dsfs" ,pages=0,lecturer_id=lecturer.id )
    _db.session.add(pdf)
    _db.session.commit()
    with client:
        response = client.get('/api/student/documents',headers={
        'Authorization': f'Bearer {auth_student["accessToken"]}'})
        data = response.get_json()
        assert response.status_code == 200
        assert len(data) == 1  
        _db.session.delete(pdf)
        _db.session.commit()     

 

def test_remove_student(client,_db,auth_lecturer,lecturer,student):
    data=[student.id]
    with client:
        response = client.post('/api/lecturer/remove-students',json=data,headers={
        'Authorization': f'Bearer {auth_lecturer["accessToken"]}'})
        assert response.status_code == 200
        assert student not in lecturer.students


def test_remove_lecturer(client,_db,auth_student,lecturer,student):
    data=[lecturer.id]
    with client:
        response = client.post('/api/student/remove-lecturers',json=data,headers={
        'Authorization': f'Bearer {auth_student["accessToken"]}'})
        assert response.status_code == 200
        assert lecturer not in student.lecturers





