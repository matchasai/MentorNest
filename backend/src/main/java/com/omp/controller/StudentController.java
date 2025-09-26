package com.omp.controller;

import java.security.Principal;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.omp.dto.CourseDTO;
import com.omp.dto.EnrollmentDTO;
import com.omp.dto.ModuleDTO;
import com.omp.dto.UserDTO;
import com.omp.repository.UserRepository;
import com.omp.service.StudentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STUDENT')")
public class StudentController {
    private final StudentService studentService;
    private final UserRepository userRepository;

    // Helper to get userId from Principal (email)
    private String getUserId(Principal principal) {
        return userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found")).getId();
    }

    @PostMapping("/enroll/{courseId}")
    public EnrollmentDTO enroll(@PathVariable String courseId, Principal principal) {
        String userId = getUserId(principal);
        return studentService.enroll(userId, courseId);
    }

    @GetMapping("/my-courses")
    public List<CourseDTO> getMyCourses(Principal principal) {
        String userId = getUserId(principal);
        return studentService.getMyCourses(userId);
    }

    @GetMapping("/courses/{courseId}/modules")
    public List<ModuleDTO> getModules(@PathVariable String courseId, Principal principal) {
        String userId = getUserId(principal);
        return studentService.getModulesForEnrolledCourse(userId, courseId);
    }

    @GetMapping("/courses/{courseId}/modules-with-status")
    public Map<String, Object> getModulesWithStatus(@PathVariable String courseId, Principal principal) {
        String userId = getUserId(principal);
        return studentService.getModulesWithCompletionStatus(userId, courseId);
    }

    @PostMapping("/courses/{courseId}/modules/{moduleId}/complete")
    public EnrollmentDTO markModuleComplete(@PathVariable String courseId, @PathVariable String moduleId,
            Principal principal) {
        String userId = getUserId(principal);
        return studentService.markModuleComplete(userId, courseId, moduleId);
    }

    @GetMapping("/courses/{courseId}/progress")
    public ResponseEntity<Object> getProgress(@PathVariable String courseId, Principal principal) {
        try {
            String userId = getUserId(principal);
            double progress = studentService.getProgress(userId, courseId);
            return ResponseEntity.ok(progress); // Return as decimal (0-1), not percentage
        } catch (IllegalArgumentException e) {
            if (e.getMessage().contains("Not enrolled")) {
                return ResponseEntity.badRequest().body("You are not enrolled in this course");
            } else {
                return ResponseEntity.badRequest().body("Unable to get progress: " + e.getMessage());
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to get progress: " + e.getMessage());
        }
    }

    @GetMapping("/courses/{courseId}/certificate")
    public ResponseEntity<String> getCertificateUrl(@PathVariable String courseId, Principal principal) {
        try {
            String userId = getUserId(principal);
            String certUrl = studentService.downloadCertificate(userId, courseId);
            return ResponseEntity.ok(certUrl);
        } catch (IllegalArgumentException e) {
            // Return a more specific error message
            if (e.getMessage().contains("Not enrolled")) {
                return ResponseEntity.badRequest().body("You are not enrolled in this course");
            } else if (e.getMessage().contains("Course not completed")) {
                return ResponseEntity.badRequest()
                        .body("Course not completed. Please complete all modules to earn your certificate");
            } else if (e.getMessage().contains("User not found")) {
                return ResponseEntity.badRequest().body("User not found");
            } else if (e.getMessage().contains("Course not found")) {
                return ResponseEntity.badRequest().body("Course not found");
            } else {
                return ResponseEntity.badRequest().body("Unable to generate certificate: " + e.getMessage());
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to generate certificate: " + e.getMessage());
        }
    }

    @GetMapping("/courses/{courseId}/certificate/download")
    public ResponseEntity<byte[]> downloadCertificateFile(@PathVariable String courseId, Principal principal) {
        try {
            String userId = getUserId(principal);
            byte[] certificateBytes = studentService.getCertificateBytes(userId, courseId);

            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=\"certificate_" + courseId + ".png\"")
                    .header("Content-Type", "image/png")
                    .body(certificateBytes);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(("Error: " + e.getMessage()).getBytes());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(("Failed to generate certificate: " + e.getMessage()).getBytes());
        }
    }

    @GetMapping("/profile")
    public UserDTO getProfile(Principal principal) {
        var user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setActive(user.isActive());
        return dto;
    }
}