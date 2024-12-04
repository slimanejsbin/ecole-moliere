package com.abnsoft.school.academic.model;

import com.abnsoft.school.common.model.BaseEntity;
import com.abnsoft.school.security.model.User;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Past;
import javax.validation.constraints.Size;
import java.time.LocalDate;

@Entity
@Table(name = "students")
@Getter
@Setter
public class Student extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @NotBlank
    @Size(max = 20)
    @Column(name = "student_id", unique = true)
    private String studentId;

    @NotNull
    @Past
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Size(max = 100)
    @Column(name = "place_of_birth")
    private String placeOfBirth;

    @NotNull
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Size(max = 100)
    private String nationality;

    @Size(max = 200)
    private String address;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id")
    private SchoolClass schoolClass;

    @Column(name = "enrollment_date")
    private LocalDate enrollmentDate;

    @Size(max = 500)
    @Column(name = "medical_info")
    private String medicalInfo;

    @Size(max = 500)
    private String notes;

    public enum Gender {
        MALE,
        FEMALE,
        OTHER
    }
}
