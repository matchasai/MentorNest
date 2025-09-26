package com.omp.dto;

import lombok.Data;

@Data
public class RazorpayOrderResponse {
    private String id; // order_id
    private String currency;
    private long amount;
    private String status;
    private String receipt;
}
