package com.abnsoft.school.academic.dto;

import lombok.Data;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
public class SchoolClassDTO {
    @NotBlank(message = "Class name is required")
    @Size(max = 50)
    private String name;

    @NotNull(message = "Grade level is required")
    @Min(value = 1, message = "Grade level must be positive")
    private Integer gradeLevel;

    @Size(max = 100)
    private String section;

    @Min(value = 1, message = "Maximum students must be positive")
    private Integer maxStudents;

    @Size(max = 200)
    private String room;

    @Size(max = 500)
    private String description;

    @NotBlank(message = "Academic year is required")
    private String academicYear;
}
