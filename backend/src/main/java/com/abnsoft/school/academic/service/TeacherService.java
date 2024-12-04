package com.abnsoft.school.academic.service;

import com.abnsoft.school.academic.dto.TeacherDTO;
import com.abnsoft.school.academic.model.Teacher;
import com.abnsoft.school.academic.repository.TeacherRepository;
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
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class TeacherService {
    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public Page<Teacher> getAllTeachers(Pageable pageable) {
        return teacherRepository.findAll(pageable);
    }

    public Teacher getTeacherById(Long id) {
        return teacherRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Teacher not found with id: " + id));
    }

    public Teacher getTeacherByEmployeeId(String employeeId) {
        return teacherRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new EntityNotFoundException("Teacher not found with employeeId: " + employeeId));
    }

    public List<Teacher> getTeachersBySubject(Long subjectId) {
        return teacherRepository.findBySubjectsId(subjectId);
    }

    public List<Teacher> getTeachersByClass(Long classId) {
        return teacherRepository.findByClassesId(classId);
    }

    @Transactional
    public Teacher createTeacher(TeacherDTO teacherDTO) {
        // Create user account
        User user = new User();
        user.setFirstName(teacherDTO.getFirstName());
        user.setLastName(teacherDTO.getLastName());
        user.setEmail(teacherDTO.getEmail());
        user.setPassword(passwordEncoder.encode(teacherDTO.getPassword()));
        user.setPhoneNumber(teacherDTO.getPhoneNumber());
        user.setMustChangePassword(true);

        // Assign ROLE_TEACHER
        Set<Role> roles = new HashSet<>();
        Role teacherRole = roleRepository.findByName("ROLE_TEACHER")
                .orElseThrow(() -> new RuntimeException("Error: Role ROLE_TEACHER is not found."));
        roles.add(teacherRole);
        user.setRoles(roles);

        user = userRepository.save(user);

        // Create teacher profile
        Teacher teacher = new Teacher();
        teacher.setUser(user);
        teacher.setEmployeeId(teacherDTO.getEmployeeId());
        teacher.setHireDate(teacherDTO.getHireDate());
        teacher.setSpecialization(teacherDTO.getSpecialization());
        teacher.setQualifications(teacherDTO.getQualifications());
        teacher.setNotes(teacherDTO.getNotes());
        teacher.setIsClassTeacher(teacherDTO.isClassTeacher());

        return teacherRepository.save(teacher);
    }

    @Transactional
    public Teacher updateTeacher(Long id, TeacherDTO teacherDTO) {
        Teacher teacher = getTeacherById(id);
        
        // Update user information
        User user = teacher.getUser();
        user.setFirstName(teacherDTO.getFirstName());
        user.setLastName(teacherDTO.getLastName());
        user.setPhoneNumber(teacherDTO.getPhoneNumber());
        userRepository.save(user);

        // Update teacher information
        teacher.setSpecialization(teacherDTO.getSpecialization());
        teacher.setQualifications(teacherDTO.getQualifications());
        teacher.setNotes(teacherDTO.getNotes());
        teacher.setIsClassTeacher(teacherDTO.isClassTeacher());

        return teacherRepository.save(teacher);
    }

    @Transactional
    public void deleteTeacher(Long id) {
        Teacher teacher = getTeacherById(id);
        teacher.setIsActive(false);
        teacherRepository.save(teacher);

        User user = teacher.getUser();
        user.setIsActive(false);
        userRepository.save(user);
    }
}
