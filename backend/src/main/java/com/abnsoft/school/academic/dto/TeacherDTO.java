package com.abnsoft.school.academic.dto;

import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDate;

@Data
public class TeacherDTO {
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

    @NotBlank(message = "Employee ID is required")
    @Size(max = 20)
    private String employeeId;

    @NotNull(message = "Hire date is required")
    private LocalDate hireDate;

    @Size(max = 200)
    private String specialization;

    @Size(max = 500)
    private String qualifications;

    @Size(max = 500)
    private String notes;

    private boolean isClassTeacher;
}
