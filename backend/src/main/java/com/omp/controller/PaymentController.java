package com.omp.controller;

import java.security.Principal;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.omp.dto.PaymentDTO;
import com.omp.entity.User;
import com.omp.service.PaymentService;
import com.omp.service.StudentService;
import com.omp.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {
    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);
    private final PaymentService paymentService;
    private final StudentService studentService;
    private final UserService userService;

    @PostMapping("/initiate/{courseId}")
    public ResponseEntity<PaymentDTO> initiatePayment(
            @PathVariable Long courseId,
            @RequestParam String paymentMethod,
            Principal principal) {
        Long userId = getUserId(principal);
        PaymentDTO payment = paymentService.initiatePayment(userId, courseId, paymentMethod);
        return ResponseEntity.ok(payment);
    }

    @PostMapping("/complete/{paymentId}")
    public ResponseEntity<PaymentDTO> completePayment(
            @PathVariable Long paymentId,
            @RequestParam("proof") MultipartFile proofFile) {
        try {
            String proofUrl = studentService.uploadPaymentProof(proofFile);
            PaymentDTO payment = paymentService.completePayment(paymentId, proofUrl);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/user/payments")
    public ResponseEntity<?> getUserPayments(Principal principal) {
        Long userId = getUserId(principal);
        return ResponseEntity.ok(paymentService.getUserPayments(userId));
    }

    @GetMapping("/test")
    public ResponseEntity<?> testEndpoint(Principal principal) {
        try {
            logger.info("Test endpoint called with principal: {}", principal);
            if (principal == null) {
                return ResponseEntity.badRequest().body("No principal found");
            }
            String userEmail = principal.getName();
            logger.info("User email: {}", userEmail);
            User user = userService.findByEmail(userEmail);
            logger.info("Found user: {}", user.getId());
            return ResponseEntity.ok(Map.of("userId", user.getId(), "email", userEmail));
        } catch (Exception e) {
            logger.error("Error in test endpoint: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/check/{courseId}")
    public ResponseEntity<?> checkPaymentStatus(
            @PathVariable Long courseId,
            Principal principal) {
        try {
            logger.info("Checking payment status for courseId: {}, principal: {}", courseId, principal);
            Long userId = getUserId(principal);
            logger.info("User ID: {}", userId);
            boolean hasPaid = paymentService.hasUserPaidForCourse(userId, courseId);
            PaymentDTO payment = paymentService.getPaymentByUserAndCourse(userId, courseId);
            logger.info("Payment status - hasPaid: {}, payment: {}", hasPaid, payment);

            return ResponseEntity.ok(new PaymentStatusResponse(hasPaid, payment));
        } catch (Exception e) {
            logger.error("Error checking payment status: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body("Error checking payment status: " + e.getMessage());
        }
    }

    private Long getUserId(Principal principal) {
        try {
            String userEmail = principal.getName();
            logger.info("Principal name: {}", userEmail);
            User user = userService.findByEmail(userEmail);
            logger.info("Found user: {}", user.getId());
            return user.getId();
        } catch (Exception e) {
            logger.error("Error getting user ID from principal: {}", e.getMessage(), e);
            throw e;
        }
    }

    public static class PaymentStatusResponse {
        private boolean hasPaid;
        private PaymentDTO payment;

        public PaymentStatusResponse(boolean hasPaid, PaymentDTO payment) {
            this.hasPaid = hasPaid;
            this.payment = payment;
        }

        public boolean isHasPaid() {
            return hasPaid;
        }

        public void setHasPaid(boolean hasPaid) {
            this.hasPaid = hasPaid;
        }

        public PaymentDTO getPayment() {
            return payment;
        }

        public void setPayment(PaymentDTO payment) {
            this.payment = payment;
        }
    }
}