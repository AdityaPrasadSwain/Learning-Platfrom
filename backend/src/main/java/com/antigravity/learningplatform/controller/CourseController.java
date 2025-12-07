package com.antigravity.learningplatform.controller;

import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.ArrayList;
import java.time.LocalDateTime;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import com.antigravity.learningplatform.entity.CourseMaterial;
import com.antigravity.learningplatform.repository.CourseMaterialRepository;

import com.antigravity.learningplatform.dto.CourseDTO;
import com.antigravity.learningplatform.entity.Course;
import com.antigravity.learningplatform.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    public ResponseEntity<List<CourseDTO>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @PostMapping
    public ResponseEntity<CourseDTO> createCourse(@RequestBody Course course) {
        return ResponseEntity.ok(courseService.createCourse(course));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CourseDTO> updateCourse(@PathVariable Long id, @RequestBody Course course) {
        return ResponseEntity.ok(courseService.updateCourse(id, course));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }

    // New endpoint to upload course materials (videos, PDFs, etc.)
    @PostMapping("/{id}/materials")
    public ResponseEntity<List<CourseMaterial>> uploadMaterials(@PathVariable Long id,
            @RequestParam("files") MultipartFile[] files) {
        List<CourseMaterial> saved = courseService.addMaterials(id, files);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}/materials")
    public ResponseEntity<List<CourseMaterial>> getMaterials(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.getMaterialsByCourseId(id));
    }

    @GetMapping("/teacher/my-courses")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<List<CourseDTO>> getTeacherCourses() {
        return ResponseEntity.ok(courseService.getTeacherCourses());
    }
}
