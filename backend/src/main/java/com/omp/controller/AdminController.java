package com.omp.controller;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.omp.dto.CourseDTO;
import com.omp.dto.MentorDTO;
import com.omp.dto.ModuleDTO;
import com.omp.dto.UserDTO;
import com.omp.service.AdminService;
import com.omp.service.FileStorageService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);
    private final AdminService adminService;
    private final FileStorageService fileStorageService;
    private final PasswordEncoder passwordEncoder;

    public AdminController(AdminService adminService, FileStorageService fileStorageService,
            PasswordEncoder passwordEncoder) {
        this.adminService = adminService;
        this.fileStorageService = fileStorageService;
        this.passwordEncoder = passwordEncoder;
    }

    // User Management
    @GetMapping("/users")
    public List<UserDTO> getUsers() {
        return adminService.getAllUsers();
    }

    @PostMapping("/users")
    public UserDTO createUser(@Valid @RequestBody UserDTO userDTO) {
        return adminService.createUser(userDTO);
    }

    @PutMapping("/users/{id}")
    public UserDTO updateUser(@PathVariable Long id, @Valid @RequestBody UserDTO userDTO) {
        return adminService.updateUser(id, userDTO);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/users/{id}/deactivate")
    public ResponseEntity<Void> deactivateUser(@PathVariable Long id) {
        adminService.deactivateUser(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/users/{id}/reactivate")
    public ResponseEntity<Void> reactivateUser(@PathVariable Long id) {
        adminService.reactivateUser(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/users/{id}/reset-password")
    public ResponseEntity<String> resetUserPassword(@PathVariable Long id, @RequestParam String newPassword) {
        String pwd = adminService.resetUserPassword(id, newPassword, passwordEncoder);
        return ResponseEntity.ok(pwd);
    }

    // Mentor Management
    @GetMapping("/mentors")
    public List<MentorDTO> getMentors() {
        return adminService.getAllMentors();
    }

    @PostMapping(value = "/mentors", consumes = { "multipart/form-data" })
    public MentorDTO createMentor(@RequestPart("mentor") MentorDTO mentorDTO,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        return adminService.createMentor(mentorDTO, image);
    }

    @PutMapping(value = "/mentors/{id}", consumes = { "multipart/form-data" })
    public MentorDTO updateMentor(@PathVariable Long id,
            @RequestPart("mentor") MentorDTO mentorDTO,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        return adminService.updateMentor(id, mentorDTO, image);
    }

    @DeleteMapping("/mentors/{id}")
    public ResponseEntity<Void> deleteMentor(@PathVariable Long id) {
        adminService.deleteMentor(id);
        return ResponseEntity.noContent().build();
    }

    // Course Management
    @GetMapping("/courses")
    public List<CourseDTO> getCourses() {
        List<CourseDTO> courses = adminService.getAllCourses();
        logger.info("Fetched {} courses for admin dashboard", courses.size());
        return courses;
    }

    @PostMapping("/courses")
    public CourseDTO createCourse(@Valid @RequestBody CourseDTO courseDTO) {
        return adminService.createCourse(courseDTO);
    }

    @PutMapping("/courses/{id}")
    public CourseDTO updateCourse(@PathVariable Long id, @Valid @RequestBody CourseDTO courseDTO) {
        return adminService.updateCourse(id, courseDTO);
    }

    @DeleteMapping("/courses/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        adminService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/courses/upload-image")
    public ResponseEntity<String> uploadCourseImage(@RequestParam("image") MultipartFile file) {
        String fileName = fileStorageService.storeFile(file, "courses");
        String fileUrl = "/uploads/courses/" + fileName;
        return ResponseEntity.ok(fileUrl);
    }

    @PostMapping("/modules/upload-resource")
    public ResponseEntity<String> uploadModuleResource(@RequestParam("file") MultipartFile file) {
        logger.info("Uploading module resource: {}", file.getOriginalFilename());
        try {
            String fileName = fileStorageService.storeFile(file, "modules");
            String fileUrl = "/uploads/modules/" + fileName;
            logger.info("Module resource uploaded successfully: {}", fileUrl);
            return ResponseEntity.ok(fileUrl);
        } catch (Exception e) {
            logger.error("Error uploading module resource: {}", e.getMessage(), e);
            throw e;
        }
    }

    @PostMapping("/courses/{courseId}/mentor/{mentorId}")
    public ResponseEntity<Void> assignMentor(@PathVariable Long courseId, @PathVariable Long mentorId) {
        adminService.assignMentorToCourse(courseId, mentorId);
        return ResponseEntity.ok().build();
    }

    // Module Management
    @PostMapping("/courses/{courseId}/modules")
    public ModuleDTO createModule(@PathVariable Long courseId, @Valid @RequestBody ModuleDTO moduleDTO) {
        return adminService.createModule(courseId, moduleDTO);
    }

    @PutMapping("/modules/{moduleId}")
    public ModuleDTO updateModule(@PathVariable Long moduleId, @Valid @RequestBody ModuleDTO moduleDTO) {
        return adminService.updateModule(moduleId, moduleDTO);
    }

    @DeleteMapping("/modules/{moduleId}")
    public ResponseEntity<Void> deleteModule(@PathVariable Long moduleId) {
        adminService.deleteModule(moduleId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/modules")
    public List<ModuleDTO> getModules() {
        List<ModuleDTO> modules = adminService.getAllModules();
        logger.info("Fetched {} modules for admin dashboard", modules.size());
        return modules;
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        Map<String, Object> stats = adminService.getComprehensiveAnalytics();
        logger.info("Fetched comprehensive analytics: {}", stats);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/student-progress")
    public ResponseEntity<List<Map<String, Object>>> getStudentProgress() {
        List<Map<String, Object>> progress = adminService.getStudentProgress();
        logger.info("Fetched student progress for {} students", progress.size());
        return ResponseEntity.ok(progress);
    }

    @GetMapping("/test-auth")
    public ResponseEntity<String> testAuth() {
        logger.info("Admin auth test endpoint accessed");
        return ResponseEntity.ok("Admin authentication is working!");
    }
}