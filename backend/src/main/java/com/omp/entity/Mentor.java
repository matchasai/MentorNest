package com.omp.entity;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "mentors")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Mentor {
    @Id
    private String id;

    // Reference to User
    private String userId;

    private String expertise;

    private String bio;

    private String imageUrl;

    // Optional denormalized list of course ids
    private List<String> courseIds;
}