package com.omp.dto;

import java.time.LocalDateTime;

import com.omp.entity.Role;

import lombok.Data;

@Data
public class UserDTO {
    private String id;
    private String name;
    private String email;
    private Role role;
    private LocalDateTime createdAt;
    private boolean active;

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}