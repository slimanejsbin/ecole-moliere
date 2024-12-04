package com.abnsoft.school.academic.controller;

import com.abnsoft.school.academic.dto.TeacherDTO;
import com.abnsoft.school.academic.model.Teacher;
import com.abnsoft.school.academic.service.TeacherService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/teachers")
@RequiredArgsConstructor
public class TeacherController {
    private final TeacherService teacherService;

    @GetMapping
    @PreAuthorize("hasAuthority('TEACHER_READ')")
    public ResponseEntity<Page<Teacher>> getAllTeachers(Pageable pageable) {
        return ResponseEntity.ok(teacherService.getAllTeachers(pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('TEACHER_READ')")
    public ResponseEntity<Teacher> getTeacherById(@PathVariable Long id) {
        return ResponseEntity.ok(teacherService.getTeacherById(id));
    }

    @GetMapping("/employee-id/{employeeId}")
    @PreAuthorize("hasAuthority('TEACHER_READ')")
    public ResponseEntity<Teacher> getTeacherByEmployeeId(@PathVariable String employeeId) {
        return ResponseEntity.ok(teacherService.getTeacherByEmployeeId(employeeId));
    }

    @GetMapping("/by-subject/{subjectId}")
    @PreAuthorize("hasAuthority('TEACHER_READ')")
    public ResponseEntity<List<Teacher>> getTeachersBySubject(@PathVariable Long subjectId) {
        return ResponseEntity.ok(teacherService.getTeachersBySubject(subjectId));
    }

    @GetMapping("/by-class/{classId}")
    @PreAuthorize("hasAuthority('TEACHER_READ')")
    public ResponseEntity<List<Teacher>> getTeachersByClass(@PathVariable Long classId) {
        return ResponseEntity.ok(teacherService.getTeachersByClass(classId));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('TEACHER_CREATE')")
    public ResponseEntity<Teacher> createTeacher(@Valid @RequestBody TeacherDTO teacherDTO) {
        return ResponseEntity.ok(teacherService.createTeacher(teacherDTO));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('TEACHER_UPDATE')")
    public ResponseEntity<Teacher> updateTeacher(@PathVariable Long id, @Valid @RequestBody TeacherDTO teacherDTO) {
        return ResponseEntity.ok(teacherService.updateTeacher(id, teacherDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('TEACHER_DELETE')")
    public ResponseEntity<Void> deleteTeacher(@PathVariable Long id) {
        teacherService.deleteTeacher(id);
        return ResponseEntity.ok().build();
    }
}
