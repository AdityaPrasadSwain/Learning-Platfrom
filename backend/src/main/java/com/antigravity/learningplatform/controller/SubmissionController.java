package com.antigravity.learningplatform.controller;

import com.antigravity.learningplatform.dto.SubmissionDTO;
import com.antigravity.learningplatform.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<SubmissionDTO> submitAssignment(@RequestBody SubmissionDTO dto) {
        return ResponseEntity.ok(submissionService.submitAssignment(dto));
    }

    @PostMapping("/grade")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<SubmissionDTO> gradeSubmission(
            @RequestParam Long submissionId,
            @RequestParam Integer marks,
            @RequestParam String feedback) {
        return ResponseEntity.ok(submissionService.gradeSubmission(submissionId, marks, feedback));
    }

    @GetMapping("/assignment/{assignmentId}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<List<SubmissionDTO>> getSubmissionsByAssignment(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(submissionService.getSubmissionsByAssignment(assignmentId));
    }

    @GetMapping("/assignment/{assignmentId}/student/{studentId}")
    public ResponseEntity<SubmissionDTO> getStudentSubmission(
            @PathVariable Long assignmentId,
            @PathVariable Long studentId) {
        return ResponseEntity.ok(submissionService.getStudentSubmission(assignmentId, studentId));
    }
}
