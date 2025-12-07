package com.antigravity.learningplatform.repository;

import com.antigravity.learningplatform.entity.LessonProgress;
import com.antigravity.learningplatform.entity.User;
import com.antigravity.learningplatform.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonProgressRepository extends JpaRepository<LessonProgress, Long> {

    Optional<LessonProgress> findByUserAndLesson(User user, Lesson lesson);

    List<LessonProgress> findByUserAndLesson_Course_Id(User user, Long courseId);

    long countByUserAndLesson_Course_IdAndCompletedTrue(User user, Long courseId);
}
