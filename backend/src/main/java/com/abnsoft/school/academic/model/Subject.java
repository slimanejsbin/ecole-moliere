package com.abnsoft.school.academic.model;

import com.abnsoft.school.common.model.BaseEntity;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "subjects")
@Getter
@Setter
public class Subject extends BaseEntity {

    @NotBlank
    @Size(max = 100)
    private String name;

    @Size(max = 20)
    private String code;

    @Size(max = 500)
    private String description;

    @Column(name = "credit_hours")
    private Integer creditHours;

    @ManyToMany(mappedBy = "subjects")
    private Set<Teacher> teachers = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "class_subjects",
        joinColumns = @JoinColumn(name = "subject_id"),
        inverseJoinColumns = @JoinColumn(name = "class_id")
    )
    private Set<SchoolClass> classes = new HashSet<>();

    @Size(max = 100)
    private String department;

    @Column(name = "is_mandatory")
    private boolean isMandatory = true;

    @Column(name = "passing_grade")
    private Integer passingGrade;
}
