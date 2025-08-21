package com.omp.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.Set;

@Entity
@Table(name = "enrollments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Enrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ElementCollection
    @CollectionTable(name = "completed_modules", joinColumns = @JoinColumn(name = "enrollment_id"))
    @Column(name = "module_id")
    private Set<Long> completedModules;

    private String certificateUrl;
}