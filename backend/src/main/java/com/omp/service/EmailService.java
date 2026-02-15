package com.omp.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {
    
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    
    private final JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String fromEmail;
    
    public void sendPasswordResetEmail(String toEmail, String resetToken, String userName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Password Reset Request - MentorNest");
            
            String resetUrl = "http://localhost:5173/reset-password?token=" + resetToken;
            
            String emailBody = String.format(
                "Dear %s,\n\n" +
                "We received a request to reset your password for your MentorNest account.\n\n" +
                "Click the link below to reset your password:\n%s\n\n" +
                "This link will expire in 1 hour.\n\n" +
                "If you didn't request a password reset, please ignore this email.\n\n" +
                "Best regards,\n" +
                "The MentorNest Team",
                userName, resetUrl
            );
            
            message.setText(emailBody);
            
            mailSender.send(message);
            logger.info("Password reset email sent successfully to: {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send password reset email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }
    
    public void sendPasswordResetConfirmation(String toEmail, String userName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Password Reset Successful - MentorNest");
            
            String emailBody = String.format(
                "Dear %s,\n\n" +
                "Your password has been successfully reset.\n\n" +
                "If you didn't make this change, please contact our support team immediately.\n\n" +
                "Best regards,\n" +
                "The MentorNest Team",
                userName
            );
            
            message.setText(emailBody);
            
            mailSender.send(message);
            logger.info("Password reset confirmation email sent to: {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send confirmation email to: {}", toEmail, e);
            // Don't throw exception here as password was already reset
        }
    }
}
