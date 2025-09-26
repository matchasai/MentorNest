package com.omp.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;
import lombok.Setter;

@Configuration
@ConfigurationProperties(prefix = "razorpay")
@Getter
@Setter
public class RazorpayProperties {
    /**
     * Razorpay key id (publishable). Provided via env var RAZORPAY_KEY_ID.
     */
    private String keyId;

    /**
     * Razorpay key secret (server only). Provided via env var RAZORPAY_KEY_SECRET.
     */
    private String keySecret;
}
