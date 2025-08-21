package com.omp.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.omp.entity.Mentor;
import com.omp.entity.Role;
import com.omp.entity.User;
import com.omp.repository.MentorRepository;
import com.omp.repository.UserRepository;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder {
        private final UserRepository userRepository;
        private final MentorRepository mentorRepository;
        private final PasswordEncoder passwordEncoder;

        @PostConstruct
        public void seed() {
                if (userRepository.count() > 0)
                        return;

                // Admin only
                User admin = User.builder()
                                .name("Admin User")
                                .email("admin@omp.com")
                                .password(passwordEncoder.encode("admin123"))
                                .role(Role.ADMIN)
                                .build();
                userRepository.save(admin);

                // Create sample mentors
                Mentor mentor1 = Mentor.builder()
                                .expertise("Full Stack Development")
                                .bio("Full Stack Developer with 5+ years of experience in React, Node.js, and Spring Boot. Passionate about creating scalable web applications and mentoring developers.")
                                .imageUrl("uploads/Profile.png")
                                .build();
                mentorRepository.save(mentor1);

                Mentor mentor2 = Mentor.builder()
                                .expertise("Frontend Development")
                                .bio("Frontend Specialist with expertise in React, Vue.js, and modern CSS frameworks. Expert in creating responsive and accessible user interfaces.")
                                .imageUrl("uploads/Profile.png")
                                .build();
                mentorRepository.save(mentor2);

                Mentor mentor3 = Mentor.builder()
                                .expertise("Backend Development")
                                .bio("Backend Developer specializing in Java, Spring Boot, and microservices architecture. Experienced in building robust and scalable server-side applications.")
                                .imageUrl("uploads/Profile.png")
                                .build();
                mentorRepository.save(mentor3);
        }
}