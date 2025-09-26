package com.omp.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "payments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    @Id
    private String id;

    private String userId;

    private String courseId;

    private Double amount;

    private PaymentStatus status;

    private String paymentMethod;

    private String transactionId;

    private LocalDateTime paymentDate;

    private String paymentProofUrl;

    public enum PaymentStatus {
        PENDING, COMPLETED, FAILED, CANCELLED
    }
}