package com.omp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class CourseDTO {
    private String id;
    @NotBlank
    private String title;
    @NotBlank
    private String description;
    @NotNull
    @Positive
    private Double price;
    private String mentorId;
    private String mentorName;
    private String imageUrl;
    private String mentorImageUrl;

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}