package com.omp.dto;

import java.util.Set;

import lombok.Data;

@Data
public class EnrollmentDTO {
    private Long id;
    private Long userId;
    private Long courseId;
    private Set<Long> completedModules;
    private String certificateUrl;
}