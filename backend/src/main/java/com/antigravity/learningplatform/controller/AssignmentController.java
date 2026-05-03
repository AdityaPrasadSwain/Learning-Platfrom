package com.antigravity.learningplatform.controller;

import com.antigravity.learningplatform.dto.AssignmentDTO;
import com.antigravity.learningplatform.service.AssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentService assignmentService;

    @PostMapping
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<AssignmentDTO> createAssignment(@RequestBody AssignmentDTO dto) {
        return ResponseEntity.ok(assignmentService.createAssignment(dto));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<AssignmentDTO>> getAssignmentsByCourse(
            @PathVariable Long courseId,
            @RequestParam(required = false) Long studentId) {
        return ResponseEntity.ok(assignmentService.getAssignmentsByCourse(courseId, studentId));
    }

    @GetMapping("/teacher/{teacherId}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<List<AssignmentDTO>> getAssignmentsByTeacher(@PathVariable Long teacherId) {
        return ResponseEntity.ok(assignmentService.getAssignmentsByTeacher(teacherId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssignmentDTO> getAssignmentById(
            @PathVariable Long id,
            @RequestParam(required = false) Long studentId) {
        return ResponseEntity.ok(assignmentService.getAssignmentById(id, studentId));
    }
}
