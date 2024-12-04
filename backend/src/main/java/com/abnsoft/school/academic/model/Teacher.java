package com.abnsoft.school.academic.model;

import com.abnsoft.school.common.model.BaseEntity;
import com.abnsoft.school.security.model.User;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "teachers")
@Getter
@Setter
public class Teacher extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @NotBlank
    @Size(max = 20)
    @Column(name = "employee_id", unique = true)
    private String employeeId;

    @NotNull
    @Column(name = "hire_date")
    private LocalDate hireDate;

    @Size(max = 200)
    private String specialization;

    @Size(max = 500)
    private String qualifications;

    @ManyToMany
    @JoinTable(
        name = "teacher_subjects",
        joinColumns = @JoinColumn(name = "teacher_id"),
        inverseJoinColumns = @JoinColumn(name = "subject_id")
    )
    private Set<Subject> subjects = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "teacher_classes",
        joinColumns = @JoinColumn(name = "teacher_id"),
        inverseJoinColumns = @JoinColumn(name = "class_id")
    )
    private Set<SchoolClass> classes = new HashSet<>();

    @Size(max = 500)
    private String notes;

    @Column(name = "is_class_teacher")
    private boolean isClassTeacher;

    @OneToOne(mappedBy = "classTeacher")
    private SchoolClass mainClass;
}
