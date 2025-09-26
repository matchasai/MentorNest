package com.omp.dto;

import lombok.Data;

@Data
public class RazorpayOrderRequest {
    private long amountPaise; // amount in paise
    private String currency = "INR";
    private String courseId;
}
