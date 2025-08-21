package com.omp.dto;

import com.omp.entity.Role;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String refreshToken;
    private String name;
    private String email;
    private Role role;
}