package com.antigravity.learningplatform.service;

import com.antigravity.learningplatform.dto.CourseProgressDTO;
import com.antigravity.learningplatform.dto.LessonProgressDTO;
import com.antigravity.learningplatform.entity.*;
import com.antigravity.learningplatform.repository.CourseRepository;
import com.antigravity.learningplatform.repository.LessonProgressRepository;
import com.antigravity.learningplatform.repository.LessonRepository;
import com.antigravity.learningplatform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProgressService {

    private final LessonProgressRepository lessonProgressRepository;
    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional
    public LessonProgressDTO markLessonComplete(Long lessonId, Boolean completed) {
        User user = getCurrentUser();
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        LessonProgress progress = lessonProgressRepository
                .findByUserAndLesson(user, lesson)
                .orElse(LessonProgress.builder()
                        .user(user)
                        .lesson(lesson)
                        .build());

        progress.setCompleted(completed);
        progress.setCompletedAt(completed ? LocalDateTime.now() : null);
        lessonProgressRepository.save(progress);

        return LessonProgressDTO.builder()
                .lessonId(lesson.getId())
                .lessonTitle(lesson.getTitle())
                .completed(progress.getCompleted())
                .build();
    }

    public CourseProgressDTO getCourseProgress(Long courseId) {
        User user = getCurrentUser();
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        List<Lesson> lessons = course.getLessons();
        int totalLessons = lessons.size();

        List<LessonProgressDTO> lessonProgress = lessons.stream()
                .map(lesson -> {
                    LessonProgress progress = lessonProgressRepository
                            .findByUserAndLesson(user, lesson)
                            .orElse(null);

                    return LessonProgressDTO.builder()
                            .lessonId(lesson.getId())
                            .lessonTitle(lesson.getTitle())
                            .completed(progress != null && progress.getCompleted())
                            .build();
                })
                .collect(Collectors.toList());

        long completedCount = lessonProgressRepository
                .countByUserAndLesson_Course_IdAndCompletedTrue(user, courseId);

        double progressPercentage = totalLessons > 0
                ? (completedCount * 100.0) / totalLessons
                : 0.0;

        return CourseProgressDTO.builder()
                .courseId(course.getId())
                .courseTitle(course.getTitle())
                .totalLessons(totalLessons)
                .completedLessons((int) completedCount)
                .progressPercentage(Math.round(progressPercentage * 100.0) / 100.0)
                .lessons(lessonProgress)
                .build();
    }
}
