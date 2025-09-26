package com.omp.service;

import java.awt.Color;
import java.awt.Font;
import java.awt.GradientPaint;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

import javax.imageio.ImageIO;

import org.springframework.stereotype.Service;

import com.omp.entity.Course;
import com.omp.entity.Enrollment;
import com.omp.entity.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CertificateService {

    private final FileStorageService fileStorageService;
    private final com.omp.repository.MentorRepository mentorRepository;
    private final com.omp.repository.UserRepository userRepository;

    public String generateCertificate(User user, Course course, Enrollment enrollment) {
        try {
            System.out.println("Generating certificate for user: " + user.getName() + ", course: " + course.getTitle());

            // Create certificate image
            BufferedImage certificate = createCertificateImage(user, course, enrollment);

            // Convert to bytes
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(certificate, "PNG", baos);
            byte[] imageBytes = baos.toByteArray();

            // Generate unique filename with timestamp
            String timestamp = String.valueOf(System.currentTimeMillis());
            String fileName = "certificate_" + user.getId() + "_" + course.getId() + "_" + timestamp + ".png";

            System.out.println("Saving certificate as: " + fileName);

            // Save to file storage
            String fileUrl = fileStorageService.storeCertificate(imageBytes, fileName);

            System.out.println("Certificate saved successfully at: " + fileUrl);
            return fileUrl;
        } catch (IOException e) {
            System.err.println("Failed to generate certificate: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to generate certificate", e);
        } catch (Exception e) {
            System.err.println("Unexpected error generating certificate: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to generate certificate", e);
        }
    }

    private BufferedImage createCertificateImage(User user, Course course, Enrollment enrollment) {
        // Create a certificate image with dimensions 1400x900 for better proportions
        BufferedImage image = new BufferedImage(1400, 900, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = image.createGraphics();

        // Set rendering hints for better quality
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g2d.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);

        // Create elegant gradient background
        GradientPaint backgroundGradient = new GradientPaint(0, 0, new Color(255, 255, 255), 1400, 900,
                new Color(248, 250, 252));
        g2d.setPaint(backgroundGradient);
        g2d.fillRect(0, 0, 1400, 900);

        // Add sophisticated border design
        // Outer border
        g2d.setColor(new Color(59, 130, 246));
        g2d.setStroke(new java.awt.BasicStroke(8));
        g2d.drawRect(20, 20, 1360, 860);

        // Inner border with gradient
        GradientPaint innerBorderGradient = new GradientPaint(0, 0, new Color(147, 197, 253), 1400, 0,
                new Color(186, 230, 253));
        g2d.setPaint(innerBorderGradient);
        g2d.setStroke(new java.awt.BasicStroke(3));
        g2d.drawRect(40, 40, 1320, 820);

        // Add corner decorations with better positioning
        g2d.setColor(new Color(59, 130, 246));
        g2d.setStroke(new java.awt.BasicStroke(4));

        // Top-left corner
        g2d.drawLine(60, 60, 140, 60);
        g2d.drawLine(60, 60, 60, 140);

        // Top-right corner
        g2d.drawLine(1340, 60, 1260, 60);
        g2d.drawLine(1340, 60, 1340, 140);

        // Bottom-left corner
        g2d.drawLine(60, 840, 140, 840);
        g2d.drawLine(60, 840, 60, 760);

        // Bottom-right corner
        g2d.drawLine(1340, 840, 1260, 840);
        g2d.drawLine(1340, 840, 1340, 760);

        // Draw enhanced logo (top center, better positioned)
        drawEnhancedLogo(g2d, 700, 100);

        // Add project branding with better spacing
        g2d.setColor(new Color(30, 58, 138));
        g2d.setFont(new Font("Arial", Font.BOLD, 32));
        String projectName = "MentorNest";
        int projectWidth = g2d.getFontMetrics().stringWidth(projectName);
        g2d.drawString(projectName, (1400 - projectWidth) / 2, 160);

        // Add tagline with better positioning
        g2d.setColor(new Color(100, 116, 139));
        g2d.setFont(new Font("Arial", Font.ITALIC, 18));
        String tagline = "Empowering Growth Through Learning";
        int taglineWidth = g2d.getFontMetrics().stringWidth(tagline);
        g2d.drawString(tagline, (1400 - taglineWidth) / 2, 185);

        // Add decorative line with better positioning
        g2d.setColor(new Color(147, 197, 253));
        g2d.setStroke(new java.awt.BasicStroke(3));
        g2d.drawLine(250, 210, 1150, 210);

        // Add title with better positioning
        g2d.setColor(new Color(30, 58, 138));
        g2d.setFont(new Font("Arial", Font.BOLD, 48));
        String title = "Certificate of Completion";
        int titleWidth = g2d.getFontMetrics().stringWidth(title);
        g2d.drawString(title, (1400 - titleWidth) / 2, 270);

        // Add certificate text with better spacing
        g2d.setColor(new Color(71, 85, 105));
        g2d.setFont(new Font("Arial", Font.PLAIN, 24));
        String certificateText = "This is to certify that";
        int textWidth = g2d.getFontMetrics().stringWidth(certificateText);
        g2d.drawString(certificateText, (1400 - textWidth) / 2, 330);

        // Add student name with better positioning
        g2d.setColor(new Color(30, 58, 138));
        g2d.setFont(new Font("Arial", Font.BOLD, 44));
        String studentName = user.getName();
        int nameWidth = g2d.getFontMetrics().stringWidth(studentName);
        g2d.drawString(studentName, (1400 - nameWidth) / 2, 390);

        // Add course completion text with better spacing
        g2d.setColor(new Color(71, 85, 105));
        g2d.setFont(new Font("Arial", Font.PLAIN, 24));
        String completionText = "has successfully completed the course";
        int completionWidth = g2d.getFontMetrics().stringWidth(completionText);
        g2d.drawString(completionText, (1400 - completionWidth) / 2, 450);

        // Add course title with better positioning
        g2d.setColor(new Color(30, 58, 138));
        g2d.setFont(new Font("Arial", Font.BOLD, 28));
        String courseTitle = course.getTitle();
        int courseWidth = g2d.getFontMetrics().stringWidth(courseTitle);
        g2d.drawString(courseTitle, (1400 - courseWidth) / 2, 510);

        // Add completion date with better positioning
        g2d.setColor(new Color(71, 85, 105));
        g2d.setFont(new Font("Arial", Font.PLAIN, 20));
        String dateText = "Completed on: " + LocalDate.now().format(DateTimeFormatter.ofPattern("MMMM dd, yyyy"));
        int dateWidth = g2d.getFontMetrics().stringWidth(dateText);
        g2d.drawString(dateText, (1400 - dateWidth) / 2, 570);

        // Add certificate ID with better positioning
        String certificateId = "Certificate ID: " + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        int idWidth = g2d.getFontMetrics().stringWidth(certificateId);
        g2d.drawString(certificateId, (1400 - idWidth) / 2, 600);

        // Add mentor name if available
        if (course.getMentorId() != null) {
            g2d.setFont(new Font("Arial", Font.PLAIN, 18));
            String mentorName = userRepository.findById(
                    mentorRepository.findById(course.getMentorId())
                            .map(m -> m.getUserId())
                            .orElse(null))
                    .map(u -> u.getName())
                    .orElse("Mentor");
            String mentorText = "Mentor: " + mentorName;
            int mentorWidth = g2d.getFontMetrics().stringWidth(mentorText);
            g2d.drawString(mentorText, (1400 - mentorWidth) / 2, 630);
        }

        // Add decorative elements at bottom with better positioning
        g2d.setColor(new Color(147, 197, 253));
        g2d.setStroke(new java.awt.BasicStroke(3));
        g2d.drawLine(250, 700, 1150, 700);

        // Add enhanced achievement badges with better positioning
        drawEnhancedAchievementBadge(g2d, 250, 750, "Excellence");
        drawEnhancedAchievementBadge(g2d, 500, 750, "Dedication");
        drawEnhancedAchievementBadge(g2d, 750, 750, "Success");
        drawEnhancedAchievementBadge(g2d, 1000, 750, "Achievement");

        g2d.dispose();
        return image;
    }

    public byte[] generateCertificateBytes(User user, Course course, Enrollment enrollment) {
        try {
            // Create certificate image
            BufferedImage certificate = createCertificateImage(user, course, enrollment);

            // Convert to bytes
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(certificate, "PNG", baos);
            return baos.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Failed to generate certificate bytes", e);
        }
    }

    private void drawEnhancedLogo(Graphics2D g2d, int x, int y) {
        // Draw enhanced MentorNest logo with better design
        // Main logo circle
        g2d.setColor(new Color(59, 130, 246)); // Blue
        g2d.fillOval(x - 40, y - 40, 80, 80);

        // Logo border
        g2d.setColor(new Color(30, 58, 138));
        g2d.setStroke(new java.awt.BasicStroke(3));
        g2d.drawOval(x - 40, y - 40, 80, 80);

        // Logo text
        g2d.setColor(new Color(255, 255, 255));
        g2d.setFont(new Font("Arial", Font.BOLD, 24));
        g2d.drawString("MN", x - 20, y + 8);

        // Graduation cap icon
        g2d.setColor(new Color(16, 185, 129)); // Green
        g2d.setFont(new Font("Arial", Font.BOLD, 20));
        g2d.drawString("🎓", x + 15, y - 5);
    }

    private void drawEnhancedAchievementBadge(Graphics2D g2d, int x, int y, String text) {
        // Draw enhanced badge background with gradient
        GradientPaint badgeGradient = new GradientPaint(x - 30, y - 30, new Color(147, 197, 253),
                x + 30, y + 30, new Color(186, 230, 253));
        g2d.setPaint(badgeGradient);
        g2d.fillOval(x - 30, y - 30, 60, 60);

        // Draw enhanced badge border
        g2d.setColor(new Color(59, 130, 246));
        g2d.setStroke(new java.awt.BasicStroke(3));
        g2d.drawOval(x - 30, y - 30, 60, 60);

        // Draw badge text with better positioning
        g2d.setColor(new Color(30, 58, 138));
        g2d.setFont(new Font("Arial", Font.BOLD, 12));
        int textWidth = g2d.getFontMetrics().stringWidth(text);
        g2d.drawString(text, x - textWidth / 2, y + 5);
    }

    // Deprecated simple logo/badge methods removed in favor of enhanced versions
}