package com.antigravity.learningplatform.controller;

import com.antigravity.learningplatform.dto.CourseMaterialDTO;
import com.antigravity.learningplatform.dto.LessonDTO;
import com.antigravity.learningplatform.service.LessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/lessons")
@RequiredArgsConstructor
public class LessonController {

    private final LessonService lessonService;

    @PostMapping("/course/{courseId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<LessonDTO> createLesson(
            @PathVariable Long courseId,
            @RequestBody LessonDTO lessonDTO) {
        return ResponseEntity.ok(lessonService.createLesson(courseId, lessonDTO));
    }

    @PutMapping("/{lessonId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<LessonDTO> updateLesson(
            @PathVariable Long lessonId,
            @RequestBody LessonDTO lessonDTO) {
        return ResponseEntity.ok(lessonService.updateLesson(lessonId, lessonDTO));
    }

    @DeleteMapping("/{lessonId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Void> deleteLesson(@PathVariable Long lessonId) {
        lessonService.deleteLesson(lessonId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<LessonDTO>> getLessonsByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(lessonService.getLessonsByCourse(courseId));
    }

    @PostMapping("/{lessonId}/materials")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<CourseMaterialDTO> uploadMaterial(
            @PathVariable Long lessonId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "description", required = false) String description) throws IOException {
        return ResponseEntity.ok(lessonService.uploadMaterial(lessonId, file, description));
    }

    @GetMapping("/{lessonId}/materials")
    public ResponseEntity<List<CourseMaterialDTO>> getMaterialsByLesson(@PathVariable Long lessonId) {
        return ResponseEntity.ok(lessonService.getMaterialsByLesson(lessonId));
    }

    @DeleteMapping("/materials/{materialId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Void> deleteMaterial(@PathVariable Long materialId) throws IOException {
        lessonService.deleteMaterial(materialId);
        return ResponseEntity.noContent().build();
    }
}
