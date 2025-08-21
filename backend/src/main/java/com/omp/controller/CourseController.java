package com.omp.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.omp.dto.CourseDTO;
import com.omp.dto.ModuleDTO;
import com.omp.service.CourseService;
import com.omp.service.FileStorageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {
    private static final Logger logger = LoggerFactory.getLogger(CourseController.class);
    private final CourseService courseService;
    private final FileStorageService fileStorageService;

    @GetMapping
    public List<CourseDTO> getAllCourses() {
        return courseService.getAllCourses();
    }

    @GetMapping("/{id}")
    public CourseDTO getCourseDetails(@PathVariable Long id) {
        return courseService.getCourseDetails(id);
    }

    @GetMapping("/{id}/modules")
    public List<ModuleDTO> getModuleTitles(@PathVariable Long id) {
        logger.info("Fetching modules for course ID: {}", id);
        try {
            List<ModuleDTO> modules = courseService.getModuleTitlesForCourse(id);
            logger.info("Found {} modules for course ID: {}", modules.size(), id);
            return modules;
        } catch (Exception e) {
            logger.error("Error fetching modules for course ID {}: {}", id, e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        logger.info("Test endpoint accessed");
        return ResponseEntity.ok("Course controller is working!");
    }

}