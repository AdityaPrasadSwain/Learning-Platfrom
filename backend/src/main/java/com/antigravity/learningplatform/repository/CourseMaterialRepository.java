package com.antigravity.learningplatform.repository;

import com.antigravity.learningplatform.entity.CourseMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseMaterialRepository extends JpaRepository<CourseMaterial, Long> {
    List<CourseMaterial> findByLessonId(Long lessonId);

    List<CourseMaterial> findByCourseId(Long courseId);
}
