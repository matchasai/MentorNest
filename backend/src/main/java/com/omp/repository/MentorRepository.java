package com.omp.repository;

import com.omp.entity.Mentor;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MentorRepository extends MongoRepository<Mentor, String> {
}