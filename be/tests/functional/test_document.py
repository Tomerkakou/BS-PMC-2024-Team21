from be.models.PdfDocument import PdfDocument,SubjectsEnum
from flask import current_app
from be.models.PdfDocument import PdfDocument
from io import BytesIO



def test_get_lecturer_documents(client,_db,auth_lecturer,lecturer,student):
    pdf=PdfDocument(subject = SubjectsEnum.JavaScript,docName="nir",description="aaaa" ,pages=0,lecturer_id=lecturer.id, doc="dGVzdCBwZGY=" )
    _db.session.add(pdf)
    _db.session.commit()
    global pdf_id
    pdf_id = pdf.id
    with client:
        response = client.get('/api/document/get-lecturer',headers={
        'Authorization': f'Bearer {auth_lecturer["accessToken"]}'})
        assert response.status_code == 200        
        data = response.get_json()
        assert len(data['documents']) == 1

def test_get_student_documents(client,_db,auth_student,lecturer,student):
    lecturer.students.append(student)
    _db.session.commit()
    with client:
        response = client.get('/api/document/get-student',headers={
        'Authorization': f'Bearer {auth_student["accessToken"]}'})
         
        assert response.status_code == 200
        data = response.get_json()
        assert len(data) == 1
        assert data[0]['name'] == "nir"

def test_download_pdf(client,auth_student):
    with client:
        response = client.get(f'/api/document/download/{pdf_id}',headers={
        'Authorization': f'Bearer {auth_student["accessToken"]}'})

        assert response.status_code == 200
        # Assert the content type is correct for a file
        assert response.headers['Content-Type'] == 'application/pdf'
        assert 'attachment' in response.headers['Content-Disposition']
        file_content = BytesIO(response.data).read().decode('utf-8')
        expected_content = "test pdf"
        assert file_content == expected_content

def test_get_pdf(client,auth_student):
    with client:
        response = client.get(f'/api/document/{pdf_id}',headers={
        'Authorization': f'Bearer {auth_student["accessToken"]}'})

        assert response.status_code == 200
        assert response.json['id'] == pdf_id

def test_remove_document(client,_db,auth_lecturer,lecturer,student):
    
    data=[pdf_id]
    with client:
        response = client.post('/api/document/remove',json=data,headers={
        'Authorization': f'Bearer {auth_lecturer["accessToken"]}'})
        assert response.status_code == 200