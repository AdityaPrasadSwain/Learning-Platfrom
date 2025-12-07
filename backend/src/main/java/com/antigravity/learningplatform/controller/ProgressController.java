package com.antigravity.learningplatform.controller;

import com.antigravity.learningplatform.dto.CourseProgressDTO;
import com.antigravity.learningplatform.dto.LessonProgressDTO;
import com.antigravity.learningplatform.service.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class ProgressController {

    private final ProgressService progressService;

    @PostMapping("/lesson/{lessonId}/complete")
    public ResponseEntity<LessonProgressDTO> markLessonComplete(
            @PathVariable Long lessonId,
            @RequestParam Boolean completed) {
        return ResponseEntity.ok(progressService.markLessonComplete(lessonId, completed));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<CourseProgressDTO> getCourseProgress(@PathVariable Long courseId) {
        return ResponseEntity.ok(progressService.getCourseProgress(courseId));
    }
}
