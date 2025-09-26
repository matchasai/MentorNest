package com.omp.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.omp.entity.Certificate;

public interface CertificateRepository extends MongoRepository<Certificate, String> {
    void deleteByCourseId(String courseId);
}