package com.antigravity.learningplatform.repository;

import com.antigravity.learningplatform.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    
    List<Question> findByQuizId(Long quizId);
    
    void deleteByQuizId(Long quizId);
    
    int countByQuizId(Long quizId);
}
