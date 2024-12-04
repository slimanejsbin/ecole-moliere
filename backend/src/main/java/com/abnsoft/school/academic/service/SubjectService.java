package com.abnsoft.school.academic.service;

import com.abnsoft.school.academic.dto.SubjectDTO;
import com.abnsoft.school.academic.model.Subject;
import com.abnsoft.school.academic.model.Teacher;
import com.abnsoft.school.academic.repository.SubjectRepository;
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
public class SubjectService {
    private final SubjectRepository subjectRepository;
    private final TeacherRepository teacherRepository;

    public Page<Subject> getAllSubjects(Pageable pageable) {
        return subjectRepository.findAll(pageable);
    }

    public Subject getSubjectById(Long id) {
        return subjectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Subject not found with id: " + id));
    }

    public List<Subject> getSubjectsByGradeLevel(Integer gradeLevel) {
        return subjectRepository.findByGradeLevel(gradeLevel);
    }

    public List<Subject> getSubjectsByTeacher(Long teacherId) {
        return subjectRepository.findByTeachersId(teacherId);
    }

    @Transactional
    public Subject createSubject(SubjectDTO subjectDTO) {
        Subject subject = new Subject();
        updateSubjectFromDTO(subject, subjectDTO);
        return subjectRepository.save(subject);
    }

    @Transactional
    public Subject updateSubject(Long id, SubjectDTO subjectDTO) {
        Subject subject = getSubjectById(id);
        updateSubjectFromDTO(subject, subjectDTO);
        return subjectRepository.save(subject);
    }

    @Transactional
    public void deleteSubject(Long id) {
        Subject subject = getSubjectById(id);
        subject.setIsActive(false);
        subjectRepository.save(subject);
    }

    @Transactional
    public Subject assignTeacherToSubject(Long subjectId, Long teacherId) {
        Subject subject = getSubjectById(subjectId);
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new EntityNotFoundException("Teacher not found with id: " + teacherId));

        subject.getTeachers().add(teacher);
        teacher.getSubjects().add(subject);
        
        teacherRepository.save(teacher);
        return subjectRepository.save(subject);
    }

    @Transactional
    public Subject removeTeacherFromSubject(Long subjectId, Long teacherId) {
        Subject subject = getSubjectById(subjectId);
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new EntityNotFoundException("Teacher not found with id: " + teacherId));

        subject.getTeachers().remove(teacher);
        teacher.getSubjects().remove(subject);
        
        teacherRepository.save(teacher);
        return subjectRepository.save(subject);
    }

    private void updateSubjectFromDTO(Subject subject, SubjectDTO subjectDTO) {
        subject.setName(subjectDTO.getName());
        subject.setCode(subjectDTO.getCode());
        subject.setGradeLevel(subjectDTO.getGradeLevel());
        subject.setDescription(subjectDTO.getDescription());
        subject.setCredits(subjectDTO.getCredits());
        subject.setIsElective(subjectDTO.getIsElective());
        subject.setPrerequisites(subjectDTO.getPrerequisites());
    }
}
