package com.antigravity.learningplatform.repository;

import com.antigravity.learningplatform.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LessonRepository extends JpaRepository<Lesson, Long> {
}
