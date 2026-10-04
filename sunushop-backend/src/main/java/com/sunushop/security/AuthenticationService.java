package com.sunushop.security;

import com.sunushop.model.dto.AuthResponse;
import com.sunushop.model.dto.LoginRequest;
import com.sunushop.model.dto.RegisterRequest;
import com.sunushop.model.entity.User;
import com.sunushop.model.enums.Role;
import com.sunushop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Ce nom d'utilisateur existe deja");
        }

        if (request.getEmail() != null && userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Cet email existe deja");
        }

        User user = User.builder()
            .username(request.getUsername())
            .password(passwordEncoder.encode(request.getPassword()))
            .email(request.getEmail())
            .role(Role.USER)
            .enabled(true)
            .build();

        userRepository.save(user);

        String token = jwtService.generateToken(user);

        return AuthResponse.builder()
            .token(token)
            .username(user.getUsername())
            .role(user.getRole().name())
            .expiresIn(jwtService.getExpiration())
            .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getUsername(),
                request.getPassword()
            )
        );

        User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouve"));

        String token = jwtService.generateToken(user);

        return AuthResponse.builder()
            .token(token)
            .username(user.getUsername())
            .role(user.getRole().name())
            .expiresIn(jwtService.getExpiration())
            .build();
    }
}