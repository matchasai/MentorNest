package com.omp.controller;

import java.security.Principal;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.omp.config.RazorpayProperties;
import com.omp.dto.PaymentDTO;
import com.omp.dto.RazorpayOrderRequest;
import com.omp.dto.RazorpayVerifyRequest;
import com.omp.entity.User;
import com.omp.service.PaymentService;
import com.omp.service.RazorpayService;
import com.omp.service.StudentService;
import com.omp.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {
    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);
    private final PaymentService paymentService;
    private final RazorpayService razorpayService;
    private final RazorpayProperties razorpayProperties;
    private final StudentService studentService;
    private final UserService userService;

    @PostMapping("/initiate/{courseId}")
    public ResponseEntity<PaymentDTO> initiatePayment(
            @PathVariable String courseId,
            @RequestParam String paymentMethod,
            Principal principal) {
        String userId = getUserId(principal);
        PaymentDTO payment = paymentService.initiatePayment(userId, courseId, paymentMethod);
        return ResponseEntity.ok(payment);
    }

    // Razorpay: create order
    @PostMapping("/razorpay/order")
    public ResponseEntity<?> createRazorpayOrder(@RequestBody RazorpayOrderRequest req, Principal principal) {
        try {
            String userId = getUserId(principal);
            // Use course price if amount not supplied
            if (req.getAmountPaise() <= 0) {
                PaymentDTO draft = paymentService.initiatePayment(userId, req.getCourseId(), "RAZORPAY");
                long paise = Math.round(draft.getAmount() * 100);
                req.setAmountPaise(paise);
            }
            String receipt = "rcpt_" + userId + "_" + req.getCourseId();
            Map<String, Object> order = razorpayService.createOrder(req.getAmountPaise(),
                    req.getCurrency() == null ? "INR" : req.getCurrency(),
                    receipt,
                    true);
            order.put("keyId", razorpayProperties.getKeyId());
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            logger.error("Failed to create Razorpay order", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Razorpay: verify payment and mark as complete
    @PostMapping("/razorpay/verify")
    public ResponseEntity<?> verifyRazorpay(@RequestBody RazorpayVerifyRequest req, Principal principal) {
        try {
            String userId = getUserId(principal);
            boolean ok = razorpayService.verifySignature(req.getRazorpayOrderId(), req.getRazorpayPaymentId(),
                    req.getRazorpaySignature());
            if (!ok) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid signature"));
            }
            PaymentDTO payment = paymentService.completePaymentByCourse(userId, req.getCourseId(),
                    req.getPaymentMethod(), "COMPLETED");
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            logger.error("Failed to verify Razorpay payment", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/complete/{paymentId}")
    public ResponseEntity<PaymentDTO> completePayment(
            @PathVariable String paymentId,
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
        String userId = getUserId(principal);
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
            @PathVariable String courseId,
            Principal principal) {
        try {
            logger.info("Checking payment status for courseId: {}, principal: {}", courseId, principal);
            String userId = getUserId(principal);
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

    private String getUserId(Principal principal) {
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