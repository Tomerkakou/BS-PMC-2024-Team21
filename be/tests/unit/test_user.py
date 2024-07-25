from be.models.User import User

def test_get_user(admin):
    assert admin.id is not None
    retrieved_user = User.query.filter_by(id=admin.id).first()
    assert retrieved_user is not None
    assert retrieved_user.id == admin.id
    assert retrieved_user.email == admin.email
    assert retrieved_user.password == admin.password

def test_user_hash_password(admin):
    admin.hashPassword()
    assert admin.password != 'Test1234'

def test_user_check_password(admin):
    assert admin.checkPassword('Test1234') == True
    assert admin.checkPassword('Test12345') == False

def test_student_lecturer_realstionship(_db,student,lecturer):
    lecturer.students.append(student)
    _db.session.commit()
    
    assert lecturer in student.lecturers





    
