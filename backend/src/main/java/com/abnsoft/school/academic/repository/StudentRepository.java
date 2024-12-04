package com.abnsoft.school.academic.repository;

import com.abnsoft.school.academic.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByStudentId(String studentId);
    Optional<Student> findByUserId(Long userId);
    List<Student> findBySchoolClassId(Long classId);
    Boolean existsByStudentId(String studentId);
}
