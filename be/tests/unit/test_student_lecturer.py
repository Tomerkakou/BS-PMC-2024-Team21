from be.models.User import User,Lecturer,Student

def test_get_lecturer(student,_db,lecturer):
    student.lecturers.append(lecturer)
    _db.session.commit()
    assert lecturer in student.lecturers
    assert lecturer.id ==student.lecturers[0].id




def test_get_student(student,_db,lecturer):
    lecturer.students.append(student)
    assert student  in lecturer.students
    assert student.id == lecturer.students[0].id

