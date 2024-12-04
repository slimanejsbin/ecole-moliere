package com.abnsoft.school.academic.repository;

import com.abnsoft.school.academic.model.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    Optional<Teacher> findByEmployeeId(String employeeId);
    Optional<Teacher> findByUserId(Long userId);
    List<Teacher> findBySubjectsId(Long subjectId);
    List<Teacher> findByClassesId(Long classId);
    Boolean existsByEmployeeId(String employeeId);
}
