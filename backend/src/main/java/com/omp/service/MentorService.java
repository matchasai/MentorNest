package com.omp.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.omp.dto.MentorDTO;
import com.omp.entity.Mentor;
import com.omp.repository.CourseRepository;
import com.omp.repository.EnrollmentRepository;
import com.omp.repository.MentorRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MentorService {
    private final MentorRepository mentorRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;

    public List<MentorDTO> getAllMentors() {
        List<Mentor> mentors = mentorRepository.findAll();
        return mentors.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public MentorDTO getMentorById(String id) {
        Mentor mentor = mentorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Mentor not found"));
        return convertToDTO(mentor);
    }

    private MentorDTO convertToDTO(Mentor mentor) {
        // Count courses by this mentor
        long coursesCount = courseRepository.countByMentorId(mentor.getId());

        // Estimate distinct students by counting enrollments in mentor's courses
        var mentorCourses = courseRepository.findByMentorId(mentor.getId());
        var courseIds = mentorCourses.stream().map(c -> c.getId()).toList();
        long studentsCount = enrollmentRepository.findAll().stream()
                .filter(e -> courseIds.contains(e.getCourseId()))
                .map(e -> e.getUserId())
                .distinct()
                .count();

        return MentorDTO.builder()
                .id(mentor.getId())
                .name("Mentor")
                .email("mentor@example.com")
                .bio(mentor.getBio())
                .imageUrl(mentor.getImageUrl())
                .expertise(mentor.getExpertise())
                .coursesCount(coursesCount)
                .studentsCount(studentsCount)
                .experienceYears(5) // Default value
                .linkedin("https://linkedin.com")
                .website("https://example.com")
                .build();
    }
}