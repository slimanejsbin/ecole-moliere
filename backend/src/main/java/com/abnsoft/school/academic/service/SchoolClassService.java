package com.abnsoft.school.academic.service;

import com.abnsoft.school.academic.dto.SchoolClassDTO;
import com.abnsoft.school.academic.model.SchoolClass;
import com.abnsoft.school.academic.model.Student;
import com.abnsoft.school.academic.model.Teacher;
import com.abnsoft.school.academic.repository.SchoolClassRepository;
import com.abnsoft.school.academic.repository.StudentRepository;
import com.abnsoft.school.academic.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SchoolClassService {
    private final SchoolClassRepository schoolClassRepository;
    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;

    public Page<SchoolClass> getAllClasses(Pageable pageable) {
        return schoolClassRepository.findAll(pageable);
    }

    public SchoolClass getClassById(Long id) {
        return schoolClassRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Class not found with id: " + id));
    }

    public List<SchoolClass> getClassesByGradeLevel(Integer gradeLevel) {
        return schoolClassRepository.findByGradeLevel(gradeLevel);
    }

    public List<SchoolClass> getClassesByTeacher(Long teacherId) {
        return schoolClassRepository.findByClassTeacherId(teacherId);
    }

    @Transactional
    public SchoolClass createClass(SchoolClassDTO classDTO) {
        SchoolClass schoolClass = new SchoolClass();
        updateClassFromDTO(schoolClass, classDTO);
        return schoolClassRepository.save(schoolClass);
    }

    @Transactional
    public SchoolClass updateClass(Long id, SchoolClassDTO classDTO) {
        SchoolClass schoolClass = getClassById(id);
        updateClassFromDTO(schoolClass, classDTO);
        return schoolClassRepository.save(schoolClass);
    }

    @Transactional
    public void deleteClass(Long id) {
        SchoolClass schoolClass = getClassById(id);
        schoolClass.setIsActive(false);
        schoolClassRepository.save(schoolClass);
    }

    @Transactional
    public SchoolClass assignClassTeacher(Long classId, Long teacherId) {
        SchoolClass schoolClass = getClassById(classId);
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new EntityNotFoundException("Teacher not found with id: " + teacherId));
        
        schoolClass.setClassTeacher(teacher);
        teacher.setIsClassTeacher(true);
        teacherRepository.save(teacher);
        
        return schoolClassRepository.save(schoolClass);
    }

    @Transactional
    public SchoolClass addStudentToClass(Long classId, Long studentId) {
        SchoolClass schoolClass = getClassById(classId);
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new EntityNotFoundException("Student not found with id: " + studentId));

        if (schoolClass.getMaxStudents() != null && 
            schoolClass.getStudents().size() >= schoolClass.getMaxStudents()) {
            throw new IllegalStateException("Class has reached maximum capacity");
        }

        student.setSchoolClass(schoolClass);
        studentRepository.save(student);
        
        return getClassById(classId); // Refresh to get updated students list
    }

    private void updateClassFromDTO(SchoolClass schoolClass, SchoolClassDTO classDTO) {
        schoolClass.setName(classDTO.getName());
        schoolClass.setGradeLevel(classDTO.getGradeLevel());
        schoolClass.setSection(classDTO.getSection());
        schoolClass.setMaxStudents(classDTO.getMaxStudents());
        schoolClass.setRoom(classDTO.getRoom());
        schoolClass.setDescription(classDTO.getDescription());
        schoolClass.setAcademicYear(classDTO.getAcademicYear());
    }
}
