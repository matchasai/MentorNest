package com.omp.dto;

import lombok.Data;

@Data
public class RazorpayVerifyRequest {
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
    private String courseId;
    private String paymentMethod = "RAZORPAY";
}
