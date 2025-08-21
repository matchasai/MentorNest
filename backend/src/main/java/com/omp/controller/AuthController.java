package com.omp.controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.omp.dto.AuthResponse;
import com.omp.dto.LoginRequest;
import com.omp.dto.RegisterRequest;
import com.omp.dto.UserDTO;
import com.omp.entity.User;
import com.omp.repository.UserRepository;
import com.omp.service.UserService;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request,
            HttpServletResponse response) {
        AuthResponse authResponse = userService.register(request);
        setAuthCookies(response, authResponse);
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        AuthResponse authResponse = userService.login(request);
        setAuthCookies(response, authResponse);
        logger.info("Login successful for user: {}, cookies set", authResponse.getEmail());
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestParam String refreshToken, HttpServletResponse response) {
        AuthResponse authResponse = userService.refreshToken(refreshToken);
        setAuthCookies(response, authResponse);
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        ResponseCookie jwtCookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(false) // set to true in production
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();
        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(false) // set to true in production
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, jwtCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(Principal principal) {
        logger.debug("getCurrentUser called, principal: {}", principal != null ? principal.getName() : "null");
        if (principal == null) {
            logger.debug("Principal is null, returning 401");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        try {
            var user = userRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            UserDTO dto = new UserDTO();
            dto.setId(user.getId());
            dto.setName(user.getName());
            dto.setEmail(user.getEmail());
            dto.setRole(user.getRole());
            dto.setActive(user.isActive());
            dto.setCreatedAt(user.getCreatedAt());
            logger.debug("User found: {}", user.getEmail());
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            logger.error("Error getting current user: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<Map<String, Object>> updateProfile(@RequestBody Map<String, Object> request,
            Principal principal) {
        try {
            if (principal == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }

            var user = userRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            // Update name if provided
            if (request.containsKey("name") && request.get("name") != null) {
                user.setName((String) request.get("name"));
            }

            // Update password if provided
            if (request.containsKey("password") && request.get("password") != null) {
                user.setPassword(passwordEncoder.encode((String) request.get("password")));
            }

            User savedUser = userRepository.save(user);

            // Generate new token with updated user info
            String newToken = userService.generateNewToken(savedUser);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Profile updated successfully");
            response.put("token", newToken);
            response.put("user", savedUser);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error updating profile: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    private void setAuthCookies(HttpServletResponse response, AuthResponse authResponse) {
        ResponseCookie jwtCookie = ResponseCookie.from("jwt", authResponse.getToken())
                .httpOnly(true)
                .secure(false) // set to true in production (requires HTTPS)
                .path("/")
                .maxAge(60 * 60 * 5) // 5 hours
                .sameSite("Lax")
                .build();
        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", authResponse.getRefreshToken())
                .httpOnly(true)
                .secure(false) // set to true in production
                .path("/")
                .maxAge(60 * 60 * 24 * 7) // 7 days
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, jwtCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
        logger.debug("Cookies set - JWT: {}, Refresh: {}",
                jwtCookie.toString().substring(0, Math.min(50, jwtCookie.toString().length())) + "...",
                refreshCookie.toString().substring(0, Math.min(50, refreshCookie.toString().length())) + "...");
    }
}