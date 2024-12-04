package com.abnsoft.school.integration;

import com.abnsoft.school.dto.StudentDTO;
import com.abnsoft.school.entity.Student;
import com.abnsoft.school.repository.StudentRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class StudentControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private StudentRepository studentRepository;

    private StudentDTO studentDTO;

    @BeforeEach
    void setUp() {
        studentDTO = new StudentDTO();
        studentDTO.setStudentId("STU001");
        studentDTO.setFirstName("Alice");
        studentDTO.setLastName("Smith");
        studentDTO.setEmail("alice.smith@school.com");
        studentDTO.setDateOfBirth(LocalDate.of(2005, 1, 1));
        studentDTO.setGender("FEMALE");
        studentDTO.setClassId(1L);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createStudent_Success() throws Exception {
        mockMvc.perform(post("/api/students")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(studentDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.studentId").value(studentDTO.getStudentId()))
                .andExpect(jsonPath("$.email").value(studentDTO.getEmail()));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getStudent_Success() throws Exception {
        Student savedStudent = studentRepository.save(convertToEntity(studentDTO));

        mockMvc.perform(get("/api/students/{id}", savedStudent.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(savedStudent.getId()))
                .andExpect(jsonPath("$.studentId").value(studentDTO.getStudentId()));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateStudent_Success() throws Exception {
        Student savedStudent = studentRepository.save(convertToEntity(studentDTO));
        studentDTO.setFirstName("Alicia");

        mockMvc.perform(put("/api/students/{id}", savedStudent.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(studentDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("Alicia"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteStudent_Success() throws Exception {
        Student savedStudent = studentRepository.save(convertToEntity(studentDTO));

        mockMvc.perform(delete("/api/students/{id}", savedStudent.getId()))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getAllStudents_Success() throws Exception {
        studentRepository.save(convertToEntity(studentDTO));

        mockMvc.perform(get("/api/students"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.content[0].studentId").value(studentDTO.getStudentId()));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void uploadStudentPhoto_Success() throws Exception {
        Student savedStudent = studentRepository.save(convertToEntity(studentDTO));
        MockMultipartFile file = new MockMultipartFile(
                "photo",
                "test.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "test image content".getBytes()
        );

        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/students/{id}/photo", savedStudent.getId())
                .file(file))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.photoUrl").exists());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getStudentsByClass_Success() throws Exception {
        Student savedStudent = studentRepository.save(convertToEntity(studentDTO));
        Long classId = savedStudent.getClassId();

        mockMvc.perform(get("/api/students/by-class/{classId}", classId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    @WithMockUser(roles = "USER")
    void createStudent_Unauthorized() throws Exception {
        mockMvc.perform(post("/api/students")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(studentDTO)))
                .andExpect(status().isForbidden());
    }

    private Student convertToEntity(StudentDTO dto) {
        Student student = new Student();
        student.setStudentId(dto.getStudentId());
        student.setFirstName(dto.getFirstName());
        student.setLastName(dto.getLastName());
        student.setEmail(dto.getEmail());
        student.setDateOfBirth(dto.getDateOfBirth());
        student.setGender(dto.getGender());
        student.setClassId(dto.getClassId());
        return student;
    }
}
