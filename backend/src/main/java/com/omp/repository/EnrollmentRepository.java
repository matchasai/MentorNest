package com.omp.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.omp.entity.Enrollment;

public interface EnrollmentRepository extends MongoRepository<Enrollment, String> {
    Optional<Enrollment> findByUserIdAndCourseId(String userId, String courseId);

    void deleteByCourseId(String courseId);

    long countDistinctByUserIdIsNotNull();

    long countByCertificateUrlIsNotNull();

    long countByCertificateUrlIsNull();
}