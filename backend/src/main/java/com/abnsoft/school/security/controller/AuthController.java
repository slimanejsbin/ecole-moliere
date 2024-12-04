package com.abnsoft.school.security.controller;

import com.abnsoft.school.security.dto.JwtResponse;
import com.abnsoft.school.security.dto.LoginRequest;
import com.abnsoft.school.security.dto.SignupRequest;
import com.abnsoft.school.security.model.User;
import com.abnsoft.school.security.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/signin")
    public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.authenticateUser(loginRequest));
    }

    @PostMapping("/signup")
    public ResponseEntity<User> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        return ResponseEntity.ok(authService.registerUser(signUpRequest));
    }

    @PostMapping("/signout")
    public ResponseEntity<Void> logoutUser() {
        authService.logout();
        return ResponseEntity.ok().build();
    }
}
