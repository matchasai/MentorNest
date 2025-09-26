package com.omp.dto;

import java.util.Set;

import lombok.Data;

@Data
public class EnrollmentDTO {
    private String id;
    private String userId;
    private String courseId;
    private Set<String> completedModules;
    private String certificateUrl;
}