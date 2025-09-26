package com.omp.service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.omp.dto.CourseDTO;
import com.omp.dto.EnrollmentDTO;
import com.omp.dto.ModuleDTO;
import com.omp.entity.Course;
import com.omp.entity.Enrollment;
import com.omp.entity.Module;
import com.omp.entity.User;
import com.omp.repository.CourseRepository;
import com.omp.repository.EnrollmentRepository;
import com.omp.repository.ModuleRepository;
import com.omp.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudentService {
        private final UserRepository userRepository;
        private final CourseRepository courseRepository;
        private final EnrollmentRepository enrollmentRepository;
        private final ModuleRepository moduleRepository;
        private final CertificateService certificateService;
        private final PaymentService paymentService;
        private final FileStorageService fileStorageService;

        // Enroll in a course
        @Transactional
        public EnrollmentDTO enroll(String userId, String courseId) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new IllegalArgumentException("User not found"));
                Course course = courseRepository.findById(courseId)
                                .orElseThrow(() -> new IllegalArgumentException("Course not found"));

                // Check if already enrolled
                if (enrollmentRepository.findByUserIdAndCourseId(userId, courseId).isPresent()) {
                        throw new IllegalArgumentException("Already enrolled");
                }

                // Check if user has paid for the course
                if (!paymentService.hasUserPaidForCourse(userId, courseId)) {
                        throw new IllegalArgumentException("Payment required before enrollment");
                }

                Enrollment enrollment = Enrollment.builder()
                                .userId(user.getId())
                                .courseId(course.getId())
                                .completedModules(new HashSet<>())
                                .certificateUrl(null)
                                .build();
                enrollmentRepository.save(enrollment);
                return toEnrollmentDTO(enrollment);
        }

        // View enrolled courses
        public List<CourseDTO> getMyCourses(String userId) {
                List<Enrollment> enrollments = enrollmentRepository.findAll().stream()
                                .filter(e -> e.getUserId().equals(userId))
                                .collect(Collectors.toList());
                return enrollments.stream()
                                .map(e -> courseRepository.findById(e.getCourseId())
                                                .map(this::toCourseDTO)
                                                .orElse(null))
                                .filter(c -> c != null)
                                .collect(Collectors.toList());
        }

        // View modules for an enrolled course
        public List<ModuleDTO> getModulesForEnrolledCourse(String userId, String courseId) {
                // Verify enrollment exists
                enrollmentRepository.findByUserIdAndCourseId(userId, courseId)
                                .orElseThrow(() -> new IllegalArgumentException("Not enrolled in this course"));

                // Get modules for specific course only
                List<Module> modules = moduleRepository.findByCourseId(courseId);
                return modules.stream().map(this::toModuleDTO).collect(Collectors.toList());
        }

        // Get modules with completion status for enrolled course
        public Map<String, Object> getModulesWithCompletionStatus(String userId, String courseId) {
                Enrollment enrollment = enrollmentRepository.findByUserIdAndCourseId(userId, courseId)
                                .orElseThrow(() -> new IllegalArgumentException("Not enrolled in this course"));

                // Get modules for specific course only
                List<Module> modules = moduleRepository.findByCourseId(courseId);

                Map<String, Object> result = new HashMap<>();
                result.put("modules", modules.stream().map(this::toModuleDTO).collect(Collectors.toList()));
                result.put("completedModules", enrollment.getCompletedModules());
                result.put("certificateUrl", enrollment.getCertificateUrl());

                return result;
        }

        // Mark module as complete
        @Transactional
        public EnrollmentDTO markModuleComplete(String userId, String courseId, String moduleId) {
                Enrollment enrollment = enrollmentRepository.findByUserIdAndCourseId(userId, courseId)
                                .orElseThrow(() -> new IllegalArgumentException("Not enrolled in this course"));
                Module module = moduleRepository.findById(moduleId)
                                .orElseThrow(() -> new IllegalArgumentException("Module not found"));
                if (!module.getCourseId().equals(courseId)) {
                        throw new IllegalArgumentException("Module does not belong to this course");
                }
                enrollment.getCompletedModules().add(moduleId);
                enrollmentRepository.save(enrollment);
                return toEnrollmentDTO(enrollment);
        }

        // Get progress for a course
        public double getProgress(String userId, String courseId) {
                Enrollment enrollment = enrollmentRepository.findByUserIdAndCourseId(userId, courseId)
                                .orElseThrow(() -> new IllegalArgumentException("Not enrolled in this course"));

                // Use the repository method that gets modules for specific course
                long totalModules = moduleRepository.countByCourseId(courseId);

                if (totalModules == 0)
                        return 0.0;
                return (double) enrollment.getCompletedModules().size() / totalModules;
        }

        // Download certificate (generate actual certificate)
        @Transactional
        public String downloadCertificate(String userId, String courseId) {
                System.out.println("Download certificate requested for user: " + userId + ", course: " + courseId);

                Enrollment enrollment = enrollmentRepository.findByUserIdAndCourseId(userId, courseId)
                                .orElseThrow(() -> new IllegalArgumentException("Not enrolled in this course"));

                // Use the repository method that gets modules for specific course
                long totalModules = moduleRepository.countByCourseId(courseId);

                System.out.println(
                                "Total modules: " + totalModules + ", completed modules: "
                                                + enrollment.getCompletedModules().size());

                if (enrollment.getCompletedModules().size() < totalModules) {
                        throw new IllegalArgumentException("Course not completed");
                }

                // Generate certificate if not already generated
                if (enrollment.getCertificateUrl() == null) {
                        System.out.println("Generating new certificate...");
                        User user = userRepository.findById(userId)
                                        .orElseThrow(() -> new IllegalArgumentException("User not found"));
                        Course course = courseRepository.findById(courseId)
                                        .orElseThrow(() -> new IllegalArgumentException("Course not found"));

                        String certUrl = certificateService.generateCertificate(user, course, enrollment);
                        enrollment.setCertificateUrl(certUrl);
                        enrollmentRepository.save(enrollment);
                        return certUrl;
                }

                System.out.println("Returning existing certificate: " + enrollment.getCertificateUrl());
                return enrollment.getCertificateUrl();
        }

        // Upload payment proof
        public String uploadPaymentProof(MultipartFile file) {
                return fileStorageService.storeFile(file, "payments");
        }

        // Get certificate as bytes for direct download
        public byte[] getCertificateBytes(String userId, String courseId) {
                System.out.println("Getting certificate bytes for user: " + userId + ", course: " + courseId);

                Enrollment enrollment = enrollmentRepository.findByUserIdAndCourseId(userId, courseId)
                                .orElseThrow(() -> new IllegalArgumentException("Not enrolled in this course"));

                // Use the repository method that gets modules for specific course
                long totalModules = moduleRepository.countByCourseId(courseId);

                System.out.println(
                                "Total modules: " + totalModules + ", completed modules: "
                                                + enrollment.getCompletedModules().size());

                if (enrollment.getCompletedModules().size() < totalModules) {
                        throw new IllegalArgumentException("Course not completed");
                }

                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new IllegalArgumentException("User not found"));
                Course course = courseRepository.findById(courseId)
                                .orElseThrow(() -> new IllegalArgumentException("Course not found"));

                System.out.println("Generating certificate bytes...");
                // Generate certificate bytes
                return certificateService.generateCertificateBytes(user, course, enrollment);
        }

        // Mapping helpers
        private EnrollmentDTO toEnrollmentDTO(Enrollment e) {
                EnrollmentDTO dto = new EnrollmentDTO();
                dto.setId(e.getId());
                dto.setUserId(e.getUserId());
                dto.setCourseId(e.getCourseId());
                dto.setCompletedModules(e.getCompletedModules());
                dto.setCertificateUrl(e.getCertificateUrl());
                return dto;
        }

        private CourseDTO toCourseDTO(Course course) {
                CourseDTO dto = new CourseDTO();
                dto.setId(course.getId());
                dto.setTitle(course.getTitle());
                dto.setDescription(course.getDescription());
                dto.setPrice(course.getPrice());
                dto.setImageUrl(course.getImageUrl());
                dto.setMentorId(course.getMentorId());
                dto.setMentorName(null);
                dto.setMentorImageUrl(null);
                return dto;
        }

        private ModuleDTO toModuleDTO(Module m) {
                ModuleDTO dto = new ModuleDTO();
                dto.setId(m.getId());
                dto.setTitle(m.getTitle());
                dto.setVideoUrl(m.getVideoUrl());
                dto.setSummary(m.getSummary());
                dto.setCourseId(m.getCourseId());
                return dto;
        }
}