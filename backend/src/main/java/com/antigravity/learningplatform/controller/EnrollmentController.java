package com.antigravity.learningplatform.controller;

import com.antigravity.learningplatform.dto.EnrollmentDTO;
import com.antigravity.learningplatform.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @PostMapping("/enroll/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<EnrollmentDTO> enrollInCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(enrollmentService.enrollInCourse(courseId));
    }

    @DeleteMapping("/unenroll/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Void> unenrollFromCourse(@PathVariable Long courseId) {
        enrollmentService.unenrollFromCourse(courseId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my-enrollments")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<EnrollmentDTO>> getMyEnrollments() {
        return ResponseEntity.ok(enrollmentService.getMyEnrollments());
    }

    @GetMapping("/is-enrolled/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Map<String, Boolean>> isEnrolled(@PathVariable Long courseId) {
        boolean enrolled = enrollmentService.isEnrolled(courseId);
        return ResponseEntity.ok(Map.of("enrolled", enrolled));
    }

    @PutMapping("/progress/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<EnrollmentDTO> updateProgress(
            @PathVariable Long courseId,
            @RequestBody Map<String, Integer> body) {
        Integer progress = body.get("progress");
        return ResponseEntity.ok(enrollmentService.updateProgress(courseId, progress));
    }
}
