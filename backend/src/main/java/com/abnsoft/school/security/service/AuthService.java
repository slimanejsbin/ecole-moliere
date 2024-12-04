package com.abnsoft.school.security.service;

import com.abnsoft.school.security.dto.JwtResponse;
import com.abnsoft.school.security.dto.LoginRequest;
import com.abnsoft.school.security.dto.SignupRequest;
import com.abnsoft.school.security.jwt.JwtUtils;
import com.abnsoft.school.security.model.Role;
import com.abnsoft.school.security.model.User;
import com.abnsoft.school.security.repository.RoleRepository;
import com.abnsoft.school.security.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return new JwtResponse(
            jwt,
            userDetails.getId(),
            userDetails.getEmail(),
            userDetails.getFirstName(),
            userDetails.getLastName()
        );
    }

    @Transactional
    public User registerUser(SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        User user = new User();
        user.setFirstName(signUpRequest.getFirstName());
        user.setLastName(signUpRequest.getLastName());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setPhoneNumber(signUpRequest.getPhoneNumber());
        user.setMustChangePassword(true);

        Set<Role> roles = new HashSet<>();
        signUpRequest.getRoles().forEach(roleName -> {
            Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Error: Role " + roleName + " is not found."));
            roles.add(role);
        });
        user.setRoles(roles);

        return userRepository.save(user);
    }

    public void logout() {
        SecurityContextHolder.clearContext();
    }
}
