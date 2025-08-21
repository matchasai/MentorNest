package com.omp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.omp.entity.Module;

public interface ModuleRepository extends JpaRepository<Module, Long> {

    @Modifying
    @Transactional
    @Query("DELETE FROM Module m WHERE m.course.id = :courseId")
    void deleteByCourseId(@Param("courseId") Long courseId);

    long countByCourseId(Long courseId);

    List<Module> findByCourseId(Long courseId);
}