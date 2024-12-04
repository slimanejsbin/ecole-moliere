package com.abnsoft.school.security.model;

import com.abnsoft.school.common.model.BaseEntity;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
@Table(name = "permissions")
@Getter
@Setter
public class Permission extends BaseEntity {

    @NotBlank
    @Size(max = 50)
    @Column(unique = true)
    private String name;

    @Size(max = 200)
    private String description;

    @Column(name = "resource_name")
    private String resourceName;

    @Enumerated(EnumType.STRING)
    private PermissionType type;

    public enum PermissionType {
        CREATE,
        READ,
        UPDATE,
        DELETE,
        MANAGE
    }
}
