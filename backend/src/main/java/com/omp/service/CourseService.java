package com.omp.service;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.omp.dto.CourseDTO;
import com.omp.dto.ModuleDTO;
import com.omp.entity.Course;
import com.omp.entity.Module;
import com.omp.repository.CourseRepository;
import com.omp.repository.MentorRepository;
import com.omp.repository.ModuleRepository;
import com.omp.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CourseService {
    private static final Logger logger = LoggerFactory.getLogger(CourseService.class);
    private final CourseRepository courseRepository;
    private final ModuleRepository moduleRepository;
    private final MentorRepository mentorRepository;
    private final UserRepository userRepository;

    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll().stream().map(this::toCourseDTO).collect(Collectors.toList());
    }

    public CourseDTO getCourseDetails(String id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));
        return toCourseDTO(course);
    }

    public List<ModuleDTO> getModuleTitlesForCourse(String courseId) {
        logger.info("Getting modules for course ID: {}", courseId);
        try {
            List<Module> modules = moduleRepository.findAll().stream()
                    .filter(m -> courseId.equals(m.getCourseId()))
                    .collect(Collectors.toList());
            logger.info("Found {} modules for course ID: {}", modules.size(), courseId);

            return modules.stream().map(m -> {
                ModuleDTO dto = new ModuleDTO();
                dto.setId(m.getId());
                dto.setTitle(m.getTitle());
                dto.setVideoUrl(m.getVideoUrl());
                dto.setSummary(m.getSummary());
                dto.setResourceUrl(m.getResourceUrl());
                dto.setCourseId(courseId);
                return dto;
            }).collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error getting modules for course ID {}: {}", courseId, e.getMessage(), e);
            throw e;
        }
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
}