package com.omp.entity;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "courses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {
    @Id
    private String id;

    private String title;

    private String description;

    private Double price;

    private String imageUrl;

    // Reference to Mentor
    private String mentorId;

    // Optional denormalized list of module ids
    private List<String> moduleIds;
}