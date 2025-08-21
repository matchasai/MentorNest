package com.omp.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.omp.dto.MentorDTO;
import com.omp.service.MentorService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/mentors")
@RequiredArgsConstructor
public class MentorController {
    private final MentorService mentorService;

    @GetMapping
    public ResponseEntity<List<MentorDTO>> getAllMentors() {
        List<MentorDTO> mentors = mentorService.getAllMentors();
        return ResponseEntity.ok(mentors);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MentorDTO> getMentorById(@PathVariable Long id) {
        MentorDTO mentor = mentorService.getMentorById(id);
        return ResponseEntity.ok(mentor);
    }
}