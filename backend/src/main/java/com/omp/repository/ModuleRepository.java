package com.omp.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.omp.entity.Module;

public interface ModuleRepository extends MongoRepository<Module, String> {

    void deleteByCourseId(String courseId);

    long countByCourseId(String courseId);

    List<Module> findByCourseId(String courseId);
}