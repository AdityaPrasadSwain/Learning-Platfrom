package com.antigravity.learningplatform.repository;

import com.antigravity.learningplatform.entity.ClassSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClassSessionRepository extends JpaRepository<ClassSession, Long> {
    List<ClassSession> findByCourseId(Long courseId);
    List<ClassSession> findByTeacherId(Long teacherId);
    List<ClassSession> findByCourseIdOrderByStartTimeDesc(Long courseId);
}
