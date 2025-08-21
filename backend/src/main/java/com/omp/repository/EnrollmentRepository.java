package com.omp.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.omp.entity.Enrollment;
import com.omp.entity.Mentor;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    Optional<Enrollment> findByUserIdAndCourseId(Long userId, Long courseId);

    void deleteByCourseId(Long courseId);

    long countDistinctByUserIdIsNotNull();

    long countByCertificateUrlIsNotNull();

    long countByCertificateUrlIsNull();

    @Query("SELECT COUNT(DISTINCT e.user.id) FROM Enrollment e JOIN e.course c WHERE c.mentor = :mentor")
    long countDistinctStudentsByMentor(@Param("mentor") Mentor mentor);
}