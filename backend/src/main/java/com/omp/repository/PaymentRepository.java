package com.omp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.omp.entity.Payment;
import com.omp.entity.Payment.PaymentStatus;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByUserIdAndStatus(Long userId, PaymentStatus status);

    Optional<Payment> findByUserIdAndCourseIdAndStatus(Long userId, Long courseId, PaymentStatus status);

    Optional<Payment> findByUserIdAndCourseId(Long userId, Long courseId);

    List<Payment> findByCourseId(Long courseId);

    boolean existsByUserIdAndCourseIdAndStatus(Long userId, Long courseId, PaymentStatus status);
}