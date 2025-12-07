package com.antigravity.learningplatform.repository;

import com.antigravity.learningplatform.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {
    Long countByIsPublished(Boolean isPublished);

    java.util.List<Course> findByInstructor_Id(Long instructorId);
}
