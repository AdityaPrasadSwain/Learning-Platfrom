package com.antigravity.learningplatform.repository;

import com.antigravity.learningplatform.entity.Assignment;
import com.antigravity.learningplatform.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByCourseId(Long courseId);
    List<Assignment> findByTeacherId(Long teacherId);
}
