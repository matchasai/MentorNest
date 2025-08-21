package com.omp.dto;

import java.time.LocalDateTime;

import com.omp.entity.Payment.PaymentStatus;

import lombok.Data;

@Data
public class PaymentDTO {
    private Long id;
    private Long userId;
    private Long courseId;
    private String courseTitle;
    private Double amount;
    private PaymentStatus status;
    private String paymentMethod;
    private String transactionId;
    private LocalDateTime paymentDate;
    private String paymentProofUrl;
}