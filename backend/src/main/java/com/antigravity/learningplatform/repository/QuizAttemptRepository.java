package com.antigravity.learningplatform.repository;

import com.antigravity.learningplatform.entity.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    
    List<QuizAttempt> findByStudentId(Long studentId);
    
    List<QuizAttempt> findByQuizId(Long quizId);
    
    List<QuizAttempt> findByStudentIdAndQuizId(Long studentId, Long quizId);
    
    Optional<QuizAttempt> findByStudentIdAndQuizIdAndIsCompletedFalse(Long studentId, Long quizId);
    
    boolean existsByStudentIdAndQuizIdAndIsCompletedTrue(Long studentId, Long quizId);
    
    int countByQuizId(Long quizId);
    
    List<QuizAttempt> findByStudentIdAndIsCompletedTrue(Long studentId);
}
