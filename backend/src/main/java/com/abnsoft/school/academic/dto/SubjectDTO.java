package com.abnsoft.school.academic.dto;

import lombok.Data;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
public class SubjectDTO {
    @NotBlank(message = "Subject name is required")
    @Size(max = 100)
    private String name;

    @NotBlank(message = "Subject code is required")
    @Size(max = 20)
    private String code;

    @NotNull(message = "Grade level is required")
    @Min(value = 1, message = "Grade level must be positive")
    private Integer gradeLevel;

    @Size(max = 500)
    private String description;

    @Min(value = 0, message = "Credits must be non-negative")
    private Integer credits;

    private Boolean isElective;

    @Size(max = 500)
    private String prerequisites;
}
