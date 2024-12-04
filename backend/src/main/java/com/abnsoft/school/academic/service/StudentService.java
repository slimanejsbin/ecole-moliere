package com.abnsoft.school.academic.service;

import com.abnsoft.school.academic.dto.StudentDTO;
import com.abnsoft.school.academic.model.Student;
import com.abnsoft.school.academic.repository.StudentRepository;
import com.abnsoft.school.security.model.Role;
import com.abnsoft.school.security.model.User;
import com.abnsoft.school.security.repository.RoleRepository;
import com.abnsoft.school.security.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class StudentService {
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public Page<Student> getAllStudents(Pageable pageable) {
        return studentRepository.findAll(pageable);
    }

    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Student not found with id: " + id));
    }

    public Student getStudentByStudentId(String studentId) {
        return studentRepository.findByStudentId(studentId)
                .orElseThrow(() -> new EntityNotFoundException("Student not found with studentId: " + studentId));
    }

    @Transactional
    public Student createStudent(StudentDTO studentDTO) {
        // Create user account
        User user = new User();
        user.setFirstName(studentDTO.getFirstName());
        user.setLastName(studentDTO.getLastName());
        user.setEmail(studentDTO.getEmail());
        user.setPassword(passwordEncoder.encode(studentDTO.getPassword()));
        user.setPhoneNumber(studentDTO.getPhoneNumber());
        user.setMustChangePassword(true);

        // Assign ROLE_STUDENT
        Set<Role> roles = new HashSet<>();
        Role studentRole = roleRepository.findByName("ROLE_STUDENT")
                .orElseThrow(() -> new RuntimeException("Error: Role ROLE_STUDENT is not found."));
        roles.add(studentRole);
        user.setRoles(roles);

        user = userRepository.save(user);

        // Create student profile
        Student student = new Student();
        student.setUser(user);
        student.setStudentId(studentDTO.getStudentId());
        student.setDateOfBirth(studentDTO.getDateOfBirth());
        student.setPlaceOfBirth(studentDTO.getPlaceOfBirth());
        student.setGender(studentDTO.getGender());
        student.setNationality(studentDTO.getNationality());
        student.setAddress(studentDTO.getAddress());
        student.setEnrollmentDate(studentDTO.getEnrollmentDate());
        student.setMedicalInfo(studentDTO.getMedicalInfo());
        student.setNotes(studentDTO.getNotes());

        return studentRepository.save(student);
    }

    @Transactional
    public Student updateStudent(Long id, StudentDTO studentDTO) {
        Student student = getStudentById(id);
        
        // Update user information
        User user = student.getUser();
        user.setFirstName(studentDTO.getFirstName());
        user.setLastName(studentDTO.getLastName());
        user.setPhoneNumber(studentDTO.getPhoneNumber());
        userRepository.save(user);

        // Update student information
        student.setDateOfBirth(studentDTO.getDateOfBirth());
        student.setPlaceOfBirth(studentDTO.getPlaceOfBirth());
        student.setGender(studentDTO.getGender());
        student.setNationality(studentDTO.getNationality());
        student.setAddress(studentDTO.getAddress());
        student.setMedicalInfo(studentDTO.getMedicalInfo());
        student.setNotes(studentDTO.getNotes());

        return studentRepository.save(student);
    }

    @Transactional
    public void deleteStudent(Long id) {
        Student student = getStudentById(id);
        student.setIsActive(false);
        studentRepository.save(student);

        User user = student.getUser();
        user.setIsActive(false);
        userRepository.save(user);
    }
}
