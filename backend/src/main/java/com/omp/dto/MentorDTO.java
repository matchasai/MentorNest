package com.omp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MentorDTO {
    private String id;
    private String name;
    private String email;
    private String bio;
    private String imageUrl;
    private String expertise;
    private long coursesCount;
    private long studentsCount;
    private String linkedin;
    private String website;
    private int experienceYears;
}