package com.abnsoft.school;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.License;

@SpringBootApplication
@EnableScheduling
@OpenAPIDefinition(
    info = @Info(
        title = "École Molière - API de Gestion Scolaire",
        version = "1.0.0",
        description = "API REST pour le système de gestion de l'École Molière",
        contact = @Contact(
            name = "ABNSOFT",
            email = "contact@abnsoft.com",
            url = "https://www.abnsoft.com"
        ),
        license = @License(
            name = "Proprietary",
            url = "https://www.abnsoft.com/licenses"
        )
    )
)
public class SchoolManagementApplication {
    public static void main(String[] args) {
        SpringApplication.run(SchoolManagementApplication.class, args);
    }
}
