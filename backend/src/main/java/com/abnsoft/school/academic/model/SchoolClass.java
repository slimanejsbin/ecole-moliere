package com.abnsoft.school.academic.model;

import com.abnsoft.school.common.model.BaseEntity;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "school_classes")
@Getter
@Setter
public class SchoolClass extends BaseEntity {

    @NotBlank
    @Size(max = 50)
    private String name;

    @NotNull
    @Column(name = "grade_level")
    private Integer gradeLevel;

    @Size(max = 100)
    private String section;

    @Column(name = "max_students")
    private Integer maxStudents;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_teacher_id")
    private Teacher classTeacher;

    @OneToMany(mappedBy = "schoolClass")
    private Set<Student> students = new HashSet<>();

    @ManyToMany(mappedBy = "classes")
    private Set<Subject> subjects = new HashSet<>();

    @Size(max = 200)
    private String room;

    @Size(max = 500)
    private String description;

    @Column(name = "academic_year")
    private String academicYear;
}
