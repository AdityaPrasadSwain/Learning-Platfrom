package com.antigravity.learningplatform.controller;

import com.antigravity.learningplatform.entity.Course;
import com.antigravity.learningplatform.entity.Lesson;
import com.antigravity.learningplatform.service.TeacherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teacher")
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherService teacherService;

    // Helper to get current user ID from authentication context
    private Long getCurrentUserId() {
        // In a real application, get this from SecurityContextHolder
        // For now, we'll assume the client sends it or we extract it from the token
        // This is a placeholder; usually you'd extract "sub" (username) and look up the
        // ID
        return 1L; // fallback
    }

    @GetMapping("/courses")
    public ResponseEntity<List<Course>> getMyCourses(@RequestParam(required = false) Long teacherId) {
        // If teacherId is passed (e.g. from frontend), use it. Otherwise use context or
        // legacy mock.
        Long idToUse = (teacherId != null) ? teacherId : getCurrentUserId();
        return ResponseEntity.ok(teacherService.getMyCourses(idToUse));
    }

    @PostMapping("/courses")
    public ResponseEntity<Course> createCourse(@RequestBody Course course, @RequestParam Long teacherId) {
        return ResponseEntity.ok(teacherService.createCourse(course, teacherId));
    }

    @PutMapping("/courses/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @RequestBody Course course,
            @RequestParam Long teacherId) {
        return ResponseEntity.ok(teacherService.updateCourse(id, course, teacherId));
    }

    @PostMapping("/courses/{id}/lessons")
    public ResponseEntity<Lesson> addLesson(@PathVariable Long id, @RequestBody Lesson lesson,
            @RequestParam Long teacherId) {
        return ResponseEntity.ok(teacherService.addLesson(id, lesson, teacherId));
    }
}
