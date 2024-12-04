package com.abnsoft.school.academic.dto;

import com.abnsoft.school.academic.model.Student.Gender;
import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Past;
import javax.validation.constraints.Size;
import java.time.LocalDate;

@Data
public class StudentDTO {
    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50)
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email
    private String email;

    @Size(min = 6, max = 40)
    private String password;

    @Size(max = 20)
    private String phoneNumber;

    @NotBlank(message = "Student ID is required")
    @Size(max = 20)
    private String studentId;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    @Size(max = 100)
    private String placeOfBirth;

    @NotNull(message = "Gender is required")
    private Gender gender;

    @Size(max = 100)
    private String nationality;

    @Size(max = 200)
    private String address;

    private LocalDate enrollmentDate;

    @Size(max = 500)
    private String medicalInfo;

    @Size(max = 500)
    private String notes;
}
