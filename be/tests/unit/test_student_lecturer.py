

def test_get_lecturer(student,_db,lecturer):
    student.lecturers.append(lecturer)
    _db.session.commit()
    assert lecturer in student.lecturers
    assert lecturer.id ==student.lecturers[0].id




def test_get_student(student,lecturer,_db):
    lecturer.students.append(student)
    _db.session.commit()
    assert student  in lecturer.students
    assert student.id == lecturer.students[0].id

def test_remove_student(student,lecturer,_db):
    lecturer.students.remove(student)
    _db.session.commit()
    assert student not in lecturer.students



