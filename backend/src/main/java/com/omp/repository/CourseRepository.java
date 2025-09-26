package com.omp.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.omp.entity.Course;

public interface CourseRepository extends MongoRepository<Course, String> {
    long countByMentorId(String mentorId);

    List<Course> findByMentorId(String mentorId);
}