package com.abnsoft.school.academic.controller;

import com.abnsoft.school.academic.dto.SchoolClassDTO;
import com.abnsoft.school.academic.model.SchoolClass;
import com.abnsoft.school.academic.service.SchoolClassService;
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
@RequestMapping("/api/classes")
@RequiredArgsConstructor
public class SchoolClassController {
    private final SchoolClassService schoolClassService;

    @GetMapping
    @PreAuthorize("hasAuthority('CLASS_READ')")
    public ResponseEntity<Page<SchoolClass>> getAllClasses(Pageable pageable) {
        return ResponseEntity.ok(schoolClassService.getAllClasses(pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('CLASS_READ')")
    public ResponseEntity<SchoolClass> getClassById(@PathVariable Long id) {
        return ResponseEntity.ok(schoolClassService.getClassById(id));
    }

    @GetMapping("/grade/{gradeLevel}")
    @PreAuthorize("hasAuthority('CLASS_READ')")
    public ResponseEntity<List<SchoolClass>> getClassesByGradeLevel(@PathVariable Integer gradeLevel) {
        return ResponseEntity.ok(schoolClassService.getClassesByGradeLevel(gradeLevel));
    }

    @GetMapping("/teacher/{teacherId}")
    @PreAuthorize("hasAuthority('CLASS_READ')")
    public ResponseEntity<List<SchoolClass>> getClassesByTeacher(@PathVariable Long teacherId) {
        return ResponseEntity.ok(schoolClassService.getClassesByTeacher(teacherId));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('CLASS_CREATE')")
    public ResponseEntity<SchoolClass> createClass(@Valid @RequestBody SchoolClassDTO classDTO) {
        return ResponseEntity.ok(schoolClassService.createClass(classDTO));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('CLASS_UPDATE')")
    public ResponseEntity<SchoolClass> updateClass(@PathVariable Long id, @Valid @RequestBody SchoolClassDTO classDTO) {
        return ResponseEntity.ok(schoolClassService.updateClass(id, classDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('CLASS_DELETE')")
    public ResponseEntity<Void> deleteClass(@PathVariable Long id) {
        schoolClassService.deleteClass(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{classId}/teacher/{teacherId}")
    @PreAuthorize("hasAuthority('CLASS_UPDATE')")
    public ResponseEntity<SchoolClass> assignClassTeacher(
            @PathVariable Long classId,
            @PathVariable Long teacherId) {
        return ResponseEntity.ok(schoolClassService.assignClassTeacher(classId, teacherId));
    }

    @PutMapping("/{classId}/student/{studentId}")
    @PreAuthorize("hasAuthority('CLASS_UPDATE')")
    public ResponseEntity<SchoolClass> addStudentToClass(
            @PathVariable Long classId,
            @PathVariable Long studentId) {
        return ResponseEntity.ok(schoolClassService.addStudentToClass(classId, studentId));
    }
}
