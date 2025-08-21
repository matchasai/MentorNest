package com.omp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.omp.entity.Course;
import com.omp.entity.Mentor;

public interface CourseRepository extends JpaRepository<Course, Long> {
    long countByMentor(Mentor mentor);
}