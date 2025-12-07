package com.antigravity.learningplatform.repository;

import com.antigravity.learningplatform.entity.Quiz;
import com.antigravity.learningplatform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    
    List<Quiz> findByCreatedBy(User teacher);
    
    List<Quiz> findByCreatedById(Long teacherId);
    
    List<Quiz> findByIsPublishedTrue();
    
    List<Quiz> findByCourseId(Long courseId);
    
    List<Quiz> findByCourseIdAndIsPublishedTrue(Long courseId);
    
    List<Quiz> findByCreatedByIdAndIsPublished(Long teacherId, Boolean isPublished);
}
