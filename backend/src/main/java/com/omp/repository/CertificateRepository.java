package com.omp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.omp.entity.Certificate;

public interface CertificateRepository extends JpaRepository<Certificate, Long> {

    @Modifying
    @Transactional
    @Query("DELETE FROM Certificate c WHERE c.course.id = :courseId")
    void deleteByCourseId(@Param("courseId") Long courseId);
}