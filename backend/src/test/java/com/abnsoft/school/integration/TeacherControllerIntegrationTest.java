package com.abnsoft.school.integration;

import com.abnsoft.school.dto.TeacherDTO;
import com.abnsoft.school.entity.Teacher;
import com.abnsoft.school.repository.TeacherRepository;
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
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class TeacherControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TeacherRepository teacherRepository;

    private TeacherDTO teacherDTO;

    @BeforeEach
    void setUp() {
        teacherDTO = new TeacherDTO();
        teacherDTO.setEmployeeId("EMP001");
        teacherDTO.setFirstName("John");
        teacherDTO.setLastName("Doe");
        teacherDTO.setEmail("john.doe@school.com");
        teacherDTO.setSpecialization("Mathematics");
        teacherDTO.setDateOfJoining(LocalDate.now());
        teacherDTO.setIsClassTeacher(false);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createTeacher_Success() throws Exception {
        mockMvc.perform(post("/api/teachers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(teacherDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.employeeId").value(teacherDTO.getEmployeeId()))
                .andExpect(jsonPath("$.email").value(teacherDTO.getEmail()));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getTeacher_Success() throws Exception {
        Teacher savedTeacher = teacherRepository.save(convertToEntity(teacherDTO));

        mockMvc.perform(get("/api/teachers/{id}", savedTeacher.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(savedTeacher.getId()))
                .andExpect(jsonPath("$.employeeId").value(teacherDTO.getEmployeeId()));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateTeacher_Success() throws Exception {
        Teacher savedTeacher = teacherRepository.save(convertToEntity(teacherDTO));
        teacherDTO.setFirstName("Jane");

        mockMvc.perform(put("/api/teachers/{id}", savedTeacher.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(teacherDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("Jane"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteTeacher_Success() throws Exception {
        Teacher savedTeacher = teacherRepository.save(convertToEntity(teacherDTO));

        mockMvc.perform(delete("/api/teachers/{id}", savedTeacher.getId()))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getAllTeachers_Success() throws Exception {
        teacherRepository.save(convertToEntity(teacherDTO));

        mockMvc.perform(get("/api/teachers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.content[0].employeeId").value(teacherDTO.getEmployeeId()));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void uploadTeacherPhoto_Success() throws Exception {
        Teacher savedTeacher = teacherRepository.save(convertToEntity(teacherDTO));
        MockMultipartFile file = new MockMultipartFile(
                "photo",
                "test.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "test image content".getBytes()
        );

        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/teachers/{id}/photo", savedTeacher.getId())
                .file(file))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.photoUrl").exists());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getTeachersBySubject_Success() throws Exception {
        Teacher savedTeacher = teacherRepository.save(convertToEntity(teacherDTO));
        Long subjectId = 1L;

        mockMvc.perform(get("/api/teachers/by-subject/{subjectId}", subjectId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(0)));
    }

    @Test
    @WithMockUser(roles = "USER")
    void createTeacher_Unauthorized() throws Exception {
        mockMvc.perform(post("/api/teachers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(teacherDTO)))
                .andExpect(status().isForbidden());
    }

    private Teacher convertToEntity(TeacherDTO dto) {
        Teacher teacher = new Teacher();
        teacher.setEmployeeId(dto.getEmployeeId());
        teacher.setFirstName(dto.getFirstName());
        teacher.setLastName(dto.getLastName());
        teacher.setEmail(dto.getEmail());
        teacher.setSpecialization(dto.getSpecialization());
        teacher.setDateOfJoining(dto.getDateOfJoining());
        teacher.setIsClassTeacher(dto.getIsClassTeacher());
        return teacher;
    }
}
