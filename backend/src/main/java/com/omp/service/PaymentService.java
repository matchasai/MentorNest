package com.omp.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.omp.dto.PaymentDTO;
import com.omp.entity.Course;
import com.omp.entity.Payment;
import com.omp.entity.Payment.PaymentStatus;
import com.omp.entity.User;
import com.omp.repository.CourseRepository;
import com.omp.repository.PaymentRepository;
import com.omp.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final FileStorageService fileStorageService;

    public PaymentDTO initiatePayment(Long userId, Long courseId, String paymentMethod) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));

        // Check if payment already exists
        if (paymentRepository.existsByUserIdAndCourseIdAndStatus(userId, courseId, PaymentStatus.COMPLETED)) {
            throw new IllegalArgumentException("Payment already completed for this course");
        }

        Payment payment = Payment.builder()
                .user(user)
                .course(course)
                .amount(course.getPrice())
                .status(PaymentStatus.PENDING)
                .paymentMethod(paymentMethod)
                .transactionId(UUID.randomUUID().toString())
                .paymentDate(LocalDateTime.now())
                .build();

        Payment savedPayment = paymentRepository.save(payment);
        return toPaymentDTO(savedPayment);
    }

    @Transactional
    public PaymentDTO completePayment(Long paymentId, String paymentProofUrl) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found"));

        payment.setStatus(PaymentStatus.COMPLETED);
        payment.setPaymentProofUrl(paymentProofUrl);
        payment.setPaymentDate(LocalDateTime.now());

        Payment savedPayment = paymentRepository.save(payment);
        return toPaymentDTO(savedPayment);
    }

    @Transactional
    public PaymentDTO completePaymentByCourse(Long userId, Long courseId, String paymentMethod, String status) {
        // Find existing payment or create new one
        Payment payment = paymentRepository.findByUserIdAndCourseId(userId, courseId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new IllegalArgumentException("User not found"));
                    Course course = courseRepository.findById(courseId)
                            .orElseThrow(() -> new IllegalArgumentException("Course not found"));

                    return Payment.builder()
                            .user(user)
                            .course(course)
                            .amount(course.getPrice())
                            .status(PaymentStatus.PENDING)
                            .paymentMethod(paymentMethod)
                            .transactionId(UUID.randomUUID().toString())
                            .paymentDate(LocalDateTime.now())
                            .build();
                });

        // Update payment status
        if ("COMPLETED".equals(status)) {
            payment.setStatus(PaymentStatus.COMPLETED);
        } else if ("PENDING".equals(status)) {
            payment.setStatus(PaymentStatus.PENDING);
        } else if ("FAILED".equals(status)) {
            payment.setStatus(PaymentStatus.FAILED);
        }

        payment.setPaymentDate(LocalDateTime.now());
        Payment savedPayment = paymentRepository.save(payment);
        return toPaymentDTO(savedPayment);
    }

    public List<PaymentDTO> getUserPayments(Long userId) {
        return paymentRepository.findByUserIdAndStatus(userId, PaymentStatus.COMPLETED)
                .stream()
                .map(this::toPaymentDTO)
                .collect(Collectors.toList());
    }

    public boolean hasUserPaidForCourse(Long userId, Long courseId) {
        return paymentRepository.existsByUserIdAndCourseIdAndStatus(userId, courseId, PaymentStatus.COMPLETED);
    }

    public PaymentDTO getPaymentByUserAndCourse(Long userId, Long courseId) {
        return paymentRepository.findByUserIdAndCourseIdAndStatus(userId, courseId, PaymentStatus.COMPLETED)
                .map(this::toPaymentDTO)
                .orElse(null);
    }

    private PaymentDTO toPaymentDTO(Payment payment) {
        PaymentDTO dto = new PaymentDTO();
        dto.setId(payment.getId());
        dto.setUserId(payment.getUser().getId());
        dto.setCourseId(payment.getCourse().getId());
        dto.setCourseTitle(payment.getCourse().getTitle());
        dto.setAmount(payment.getAmount());
        dto.setStatus(payment.getStatus());
        dto.setPaymentMethod(payment.getPaymentMethod());
        dto.setTransactionId(payment.getTransactionId());
        dto.setPaymentDate(payment.getPaymentDate());
        dto.setPaymentProofUrl(payment.getPaymentProofUrl());
        return dto;
    }
}