package com.abnsoft.school.academic.controller;

import com.abnsoft.school.academic.dto.SubjectDTO;
import com.abnsoft.school.academic.model.Subject;
import com.abnsoft.school.academic.service.SubjectService;
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
@RequestMapping("/api/subjects")
@RequiredArgsConstructor
public class SubjectController {
    private final SubjectService subjectService;

    @GetMapping
    @PreAuthorize("hasAuthority('SUBJECT_READ')")
    public ResponseEntity<Page<Subject>> getAllSubjects(Pageable pageable) {
        return ResponseEntity.ok(subjectService.getAllSubjects(pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('SUBJECT_READ')")
    public ResponseEntity<Subject> getSubjectById(@PathVariable Long id) {
        return ResponseEntity.ok(subjectService.getSubjectById(id));
    }

    @GetMapping("/grade/{gradeLevel}")
    @PreAuthorize("hasAuthority('SUBJECT_READ')")
    public ResponseEntity<List<Subject>> getSubjectsByGradeLevel(@PathVariable Integer gradeLevel) {
        return ResponseEntity.ok(subjectService.getSubjectsByGradeLevel(gradeLevel));
    }

    @GetMapping("/teacher/{teacherId}")
    @PreAuthorize("hasAuthority('SUBJECT_READ')")
    public ResponseEntity<List<Subject>> getSubjectsByTeacher(@PathVariable Long teacherId) {
        return ResponseEntity.ok(subjectService.getSubjectsByTeacher(teacherId));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('SUBJECT_CREATE')")
    public ResponseEntity<Subject> createSubject(@Valid @RequestBody SubjectDTO subjectDTO) {
        return ResponseEntity.ok(subjectService.createSubject(subjectDTO));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('SUBJECT_UPDATE')")
    public ResponseEntity<Subject> updateSubject(@PathVariable Long id, @Valid @RequestBody SubjectDTO subjectDTO) {
        return ResponseEntity.ok(subjectService.updateSubject(id, subjectDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('SUBJECT_DELETE')")
    public ResponseEntity<Void> deleteSubject(@PathVariable Long id) {
        subjectService.deleteSubject(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{subjectId}/teacher/{teacherId}")
    @PreAuthorize("hasAuthority('SUBJECT_UPDATE')")
    public ResponseEntity<Subject> assignTeacherToSubject(
            @PathVariable Long subjectId,
            @PathVariable Long teacherId) {
        return ResponseEntity.ok(subjectService.assignTeacherToSubject(subjectId, teacherId));
    }

    @DeleteMapping("/{subjectId}/teacher/{teacherId}")
    @PreAuthorize("hasAuthority('SUBJECT_UPDATE')")
    public ResponseEntity<Subject> removeTeacherFromSubject(
            @PathVariable Long subjectId,
            @PathVariable Long teacherId) {
        return ResponseEntity.ok(subjectService.removeTeacherFromSubject(subjectId, teacherId));
    }
}
