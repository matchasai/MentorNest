package com.omp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.omp.entity.Payment;
import com.omp.entity.Payment.PaymentStatus;

@Repository
public interface PaymentRepository extends MongoRepository<Payment, String> {
    List<Payment> findByUserIdAndStatus(String userId, PaymentStatus status);

    Optional<Payment> findByUserIdAndCourseIdAndStatus(String userId, String courseId, PaymentStatus status);

    Optional<Payment> findByUserIdAndCourseId(String userId, String courseId);

    List<Payment> findByCourseId(String courseId);

    boolean existsByUserIdAndCourseIdAndStatus(String userId, String courseId, PaymentStatus status);
}