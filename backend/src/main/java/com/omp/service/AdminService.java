package com.omp.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.omp.dto.CourseDTO;
import com.omp.dto.MentorDTO;
import com.omp.dto.ModuleDTO;
import com.omp.dto.UserDTO;
import com.omp.entity.Course;
import com.omp.entity.Enrollment;
import com.omp.entity.Mentor;
import com.omp.entity.Module;
import com.omp.entity.Role;
import com.omp.entity.User;
import com.omp.repository.CertificateRepository;
import com.omp.repository.CourseRepository;
import com.omp.repository.EnrollmentRepository;
import com.omp.repository.MentorRepository;
import com.omp.repository.ModuleRepository;
import com.omp.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {
    private static final Logger logger = LoggerFactory.getLogger(AdminService.class);
    private final UserRepository userRepository;
    private final MentorRepository mentorRepository;
    private final CourseRepository courseRepository;
    private final ModuleRepository moduleRepository;
    private final FileStorageService fileStorageService;
    private final EnrollmentRepository enrollmentRepository;
    private final CertificateRepository certificateRepository;

    // Removed JPA EntityManager; using Mongo repositories only

    // User CRUD
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRole() != Role.ADMIN) // Don't show admins
                .map(this::toUserDTO)
                .collect(Collectors.toList());
    }

    public UserDTO getUser(String id) {
        return userRepository.findById(id).map(this::toUserDTO)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public UserDTO createUser(UserDTO dto) {
        if (dto.getRole() != Role.STUDENT) {
            throw new IllegalArgumentException("Can only create student users");
        }
        if (userRepository.findByEmail(dto.getEmail()).isPresent())
            throw new IllegalArgumentException("Email already exists");
        User user = User.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .password("") // Set password via registration
                .role(dto.getRole() == null ? Role.STUDENT : dto.getRole())
                .build();
        userRepository.save(user);
        return toUserDTO(user);
    }

    public UserDTO updateUser(String id, UserDTO dto) {
        if (dto.getRole() != Role.STUDENT) {
            throw new IllegalArgumentException("Can only set role to student");
        }
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setRole(dto.getRole());
        userRepository.save(user);
        return toUserDTO(user);
    }

    public void deleteUser(String id) {
        logger.info("Deleting user with id: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (user.getRole() == Role.ADMIN) {
            throw new AccessDeniedException("Cannot delete admin users");
        }
        userRepository.deleteById(id);
    }

    public void deactivateUser(String id) {
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setActive(false);
        userRepository.save(user);
    }

    public void reactivateUser(String id) {
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setActive(true);
        userRepository.save(user);
    }

    public String resetUserPassword(String id, String newPassword, PasswordEncoder passwordEncoder) {
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return newPassword;
    }

    // Mentor CRUD
    public List<MentorDTO> getAllMentors() {
        return mentorRepository.findAll().stream().map(this::toMentorDTO).collect(Collectors.toList());
    }

    public MentorDTO getMentor(String id) {
        return mentorRepository.findById(id).map(this::toMentorDTO)
                .orElseThrow(() -> new IllegalArgumentException("Mentor not found"));
    }

    @Transactional
    public MentorDTO createMentor(MentorDTO mentorDTO, MultipartFile image) {
        // Check for duplicate email
        if (userRepository.findByEmail(mentorDTO.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists for another user");
        }
        String imageUrl = fileStorageService.store(image);

        User user = User.builder()
                .name(mentorDTO.getName())
                .email(mentorDTO.getEmail())
                .password("default_password") // Or generate a random one
                .role(Role.MENTOR)
                .build();
        userRepository.save(user);

        Mentor mentor = Mentor.builder()
                .userId(user.getId())
                .expertise(mentorDTO.getExpertise())
                .bio(mentorDTO.getBio())
                .imageUrl(imageUrl)
                .build();

        return toMentorDTO(mentorRepository.save(mentor));
    }

    public MentorDTO updateMentor(String id, MentorDTO mentorDTO, MultipartFile image) {
        Mentor mentor = mentorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Mentor not found"));
        if (mentor.getUserId() != null) {
            userRepository.findById(mentor.getUserId()).ifPresent(u -> {
                u.setName(mentorDTO.getName());
                u.setEmail(mentorDTO.getEmail());
                userRepository.save(u);
            });
        }

        mentor.setExpertise(mentorDTO.getExpertise());
        mentor.setBio(mentorDTO.getBio());

        if (image != null && !image.isEmpty()) {
            String imageUrl = fileStorageService.store(image);
            mentor.setImageUrl(imageUrl);
        }

        return toMentorDTO(mentorRepository.save(mentor));
    }

    public void deleteMentor(String id) {
        logger.info("Deleting mentor with id: {}", id);
        Mentor mentor = mentorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Mentor not found"));
        if (mentor.getUserId() != null) {
            var user = userRepository.findById(mentor.getUserId()).orElse(null);
            if (user != null && user.getRole() == Role.ADMIN) {
                throw new AccessDeniedException("Cannot delete mentors with admin user");
            }
        }
        mentorRepository.deleteById(id);
    }

    // Course CRUD
    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll().stream().map(this::toCourseDTO).collect(Collectors.toList());
    }

    public CourseDTO createCourse(CourseDTO courseDTO) {
        Course.CourseBuilder builder = Course.builder()
                .title(courseDTO.getTitle())
                .description(courseDTO.getDescription())
                .price(courseDTO.getPrice())
                .imageUrl(courseDTO.getImageUrl());

        // Set mentor if provided
        if (courseDTO.getMentorId() != null) {
            mentorRepository.findById(courseDTO.getMentorId())
                    .orElseThrow(() -> new IllegalArgumentException("Mentor not found"));
            builder.mentorId(courseDTO.getMentorId());
        }

        Course course = builder.build();
        return toCourseDTO(courseRepository.save(course));
    }

    public CourseDTO updateCourse(String id, CourseDTO courseDTO) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));
        course.setTitle(courseDTO.getTitle());
        course.setDescription(courseDTO.getDescription());
        course.setPrice(courseDTO.getPrice());
        course.setImageUrl(courseDTO.getImageUrl());
        // Optionally update mentor if mentorId is provided
        if (courseDTO.getMentorId() != null) {
            course.setMentorId(courseDTO.getMentorId());
        }
        return toCourseDTO(courseRepository.save(course));
    }

    // Removed SQL-based force delete (not applicable for MongoDB)
    @Transactional
    public void deleteCourse(String id) {
        try {
            logger.info("Deleting course with id: {}", id);
            enrollmentRepository.deleteByCourseId(id);
            logger.info("Enrollments remaining for course {}: {}", id,
                    enrollmentRepository.findAll().stream().filter(e -> id.equals(e.getCourseId())).count());
            certificateRepository.deleteByCourseId(id);
            logger.info("Certificates remaining for course {}: {}", id,
                    certificateRepository.findAll().stream().filter(c -> id.equals(c.getCourseId())).count());
            moduleRepository.deleteByCourseId(id);
            logger.info("Modules remaining for course {}: {}", id,
                    moduleRepository.findAll().stream().filter(m -> id.equals(m.getCourseId())).count());
            courseRepository.deleteById(id);
            logger.info("Deleted course, modules, certificates, and related enrollments for id: {}", id);
        } catch (Exception e) {
            logger.error("Error deleting course with id {}: {}", id, e.getMessage(), e);
            throw e;
        }
    }

    public void assignMentorToCourse(String courseId, String mentorId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));
        mentorRepository.findById(mentorId)
                .orElseThrow(() -> new IllegalArgumentException("Mentor not found"));
        course.setMentorId(mentorId);
        courseRepository.save(course);
    }

    // Module Service Methods
    public ModuleDTO createModule(String courseId, ModuleDTO moduleDTO) {
        if (courseId == null) {
            throw new IllegalArgumentException("Course ID is required to create a module");
        }
        Module module = Module.builder()
                .title(moduleDTO.getTitle())
                .videoUrl(moduleDTO.getVideoUrl())
                .summary(moduleDTO.getSummary())
                .resourceUrl(moduleDTO.getResourceUrl())
                .courseId(courseId)
                .build();
        return toModuleDTO(moduleRepository.save(module));
    }

    public ModuleDTO updateModule(String moduleId, ModuleDTO moduleDTO) {
        Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new IllegalArgumentException("Module not found"));
        module.setTitle(moduleDTO.getTitle());
        module.setVideoUrl(moduleDTO.getVideoUrl());
        module.setSummary(moduleDTO.getSummary());
        module.setResourceUrl(moduleDTO.getResourceUrl());
        return toModuleDTO(moduleRepository.save(module));
    }

    @Transactional
    public void deleteModule(String moduleId) {
        logger.info("Deleting module with id: {}", moduleId);
        moduleRepository.deleteById(moduleId);
        logger.info("Deleted module with id: {}", moduleId);
    }

    public List<ModuleDTO> getAllModules() {
        return moduleRepository.findAll().stream().map(this::toModuleDTO).collect(Collectors.toList());
    }

    public long getTotalUsers() {
        return userRepository.count();
    }

    public long getTotalStudents() {
        return userRepository.findAll().stream().filter(u -> u.getRole() == Role.STUDENT).count();
    }

    public long getTotalMentors() {
        return mentorRepository.count();
    }

    public long getTotalCourses() {
        return courseRepository.count();
    }

    public long getTotalModules() {
        return moduleRepository.count();
    }

    public long getTotalEnrollments() {
        return enrollmentRepository.count();
    }

    public long getTotalAdmins() {
        return userRepository.findAll().stream().filter(u -> u.getRole() == Role.ADMIN).count();
    }

    public long getActiveStudents() {
        return enrollmentRepository.countDistinctByUserIdIsNotNull();
    }

    public long getCompletedCourses() {
        return enrollmentRepository.countByCertificateUrlIsNotNull();
    }

    public long getInProgressCourses() {
        return enrollmentRepository.countByCertificateUrlIsNull();
    }

    public long getCertificatesIssued() {
        return certificateRepository.count();
    }

    public Map<String, Object> getComprehensiveAnalytics() {
        Map<String, Object> analytics = new HashMap<>();

        // Basic counts
        analytics.put("totalUsers", getTotalUsers());
        analytics.put("totalStudents", getTotalStudents());
        analytics.put("totalMentors", getTotalMentors());
        analytics.put("totalAdmins", getTotalAdmins());
        analytics.put("totalCourses", getTotalCourses());
        analytics.put("totalModules", getTotalModules());
        analytics.put("totalEnrollments", getTotalEnrollments());

        // Progress analytics
        analytics.put("activeStudents", getActiveStudents());
        analytics.put("completedCourses", getCompletedCourses());
        analytics.put("inProgressCourses", getInProgressCourses());
        analytics.put("certificatesIssued", getCertificatesIssued());

        // Calculate percentages
        long totalUsers = getTotalUsers();
        if (totalUsers > 0) {
            analytics.put("studentPercentage", Math.round((double) getTotalStudents() / totalUsers * 100));
            analytics.put("mentorPercentage", Math.round((double) getTotalMentors() / totalUsers * 100));
            analytics.put("adminPercentage", Math.round((double) getTotalAdmins() / totalUsers * 100));
        } else {
            analytics.put("studentPercentage", 0);
            analytics.put("mentorPercentage", 0);
            analytics.put("adminPercentage", 0);
        }

        // Course completion rate
        long totalEnrollments = getTotalEnrollments();
        if (totalEnrollments > 0) {
            analytics.put("completionRate", Math.round((double) getCompletedCourses() / totalEnrollments * 100));
        } else {
            analytics.put("completionRate", 0);
        }

        return analytics;
    }

    public List<Map<String, Object>> getStudentProgress() {
        List<Map<String, Object>> progress = new ArrayList<>();

        List<Enrollment> enrollments = enrollmentRepository.findAll();

        for (Enrollment enrollment : enrollments) {
            Map<String, Object> studentProgress = new HashMap<>();

            // Student info
            studentProgress.put("id", enrollment.getId());
            userRepository.findById(enrollment.getUserId()).ifPresent(u -> {
                studentProgress.put("name", u.getName());
                studentProgress.put("email", u.getEmail());
            });

            // Course info
            courseRepository.findById(enrollment.getCourseId()).ifPresent(c -> {
                studentProgress.put("courseTitle", c.getTitle());
                studentProgress.put("mentorName", c.getMentorId());
            });

            // Progress calculation
            long totalModules = moduleRepository.countByCourseId(enrollment.getCourseId());
            long completedModules = enrollment.getCompletedModules() != null ? enrollment.getCompletedModules().size()
                    : 0;

            int progressPercentage = totalModules > 0 ? (int) Math.round((double) completedModules / totalModules * 100)
                    : 0;

            studentProgress.put("progress", progressPercentage);
            studentProgress.put("completedModules", completedModules);
            studentProgress.put("totalModules", totalModules);

            // Status determination
            String status;
            if (enrollment.getCertificateUrl() != null) {
                status = "completed";
            } else if (completedModules > 0) {
                status = "in-progress";
            } else {
                status = "not-started";
            }
            studentProgress.put("status", status);

            // Certificate info
            studentProgress.put("certificateUrl", enrollment.getCertificateUrl());

            progress.add(studentProgress);
        }

        return progress;
    }

    // Mapping helpers
    private UserDTO toUserDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setActive(user.isActive());
        return dto;
    }

    private MentorDTO toMentorDTO(Mentor mentor) {
        MentorDTO dto = new MentorDTO();
        dto.setId(mentor.getId());
        if (mentor.getUserId() != null) {
            userRepository.findById(mentor.getUserId()).ifPresent(u -> {
                dto.setName(u.getName());
                dto.setEmail(u.getEmail());
            });
        }
        dto.setExpertise(mentor.getExpertise());
        dto.setBio(mentor.getBio());
        dto.setImageUrl(mentor.getImageUrl());
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

        // Fetch mentor information
        if (course.getMentorId() != null) {
            mentorRepository.findById(course.getMentorId()).ifPresent(mentor -> {
                // Set mentor image from Mentor entity
                dto.setMentorImageUrl(mentor.getImageUrl());

                // Fetch mentor name from User entity
                if (mentor.getUserId() != null) {
                    userRepository.findById(mentor.getUserId())
                            .ifPresent(user -> dto.setMentorName(user.getName()));
                }
            });
        }

        return dto;
    }

    private ModuleDTO toModuleDTO(Module module) {
        ModuleDTO dto = new ModuleDTO();
        dto.setId(module.getId());
        dto.setTitle(module.getTitle());
        dto.setVideoUrl(module.getVideoUrl());
        dto.setSummary(module.getSummary());
        dto.setResourceUrl(module.getResourceUrl());
        dto.setCourseId(module.getCourseId());
        return dto;
    }
}