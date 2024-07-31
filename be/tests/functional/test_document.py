from be.models.PdfDocument import PdfDocument,SubjectsEnum
from flask import current_app
from be.models.PdfDocument import PdfDocument
from be.models.questions.Coding import Coding
from be.models.questions.Open import Open
from be.models.questions.SingleChoice import SingleChoice

def test_remove_document(client,_db,auth_lecturer,lecturer,student):
    
    pdf=PdfDocument(subject = SubjectsEnum.JavaScript,docName="nir",description="aaaa" ,pages=0,lecturer_id=lecturer.id )
    data=[pdf.id]
    with client:
        response = client.post('/api/lecturer/remove-documents',json=data,headers={
        'Authorization': f'Bearer {auth_lecturer["accessToken"]}'})
        assert response.status_code == 200


def test_get_documents(client,_db,auth_lecturer,lecturer,student):
    pdf=PdfDocument(subject = SubjectsEnum.JavaScript,docName="nir",description="aaaa" ,pages=0,lecturer_id=lecturer.id )
    with client:
        response = client.get('/api/lecturer/getdocuments',headers={
        'Authorization': f'Bearer {auth_lecturer["accessToken"]}'})
        assert response.status_code == 200        
        data = response.get_json()
        assert len(data) == 1