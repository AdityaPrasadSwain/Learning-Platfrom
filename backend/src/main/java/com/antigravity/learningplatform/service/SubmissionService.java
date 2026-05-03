package com.antigravity.learningplatform.service;

import com.antigravity.learningplatform.dto.SubmissionDTO;
import com.antigravity.learningplatform.entity.Assignment;
import com.antigravity.learningplatform.entity.Notification;
import com.antigravity.learningplatform.entity.Submission;
import com.antigravity.learningplatform.entity.User;
import com.antigravity.learningplatform.repository.AssignmentRepository;
import com.antigravity.learningplatform.repository.SubmissionRepository;
import com.antigravity.learningplatform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final AssignmentRepository assignmentRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public SubmissionDTO submitAssignment(SubmissionDTO dto) {
        Assignment assignment = assignmentRepository.findById(dto.getAssignmentId())
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
        
        User student = userRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // Check if student is enrolled (In a real app, this should be enforced by security/service layer)
        // For now we assume the frontend only allows enrolled students to submit.

        LocalDateTime now = LocalDateTime.now();
        Submission.SubmissionStatus status = now.isAfter(assignment.getDueDate()) 
                ? Submission.SubmissionStatus.LATE 
                : Submission.SubmissionStatus.SUBMITTED;

        Submission submission = submissionRepository.findByAssignmentIdAndStudentId(assignment.getId(), student.getId())
                .orElse(new Submission());

        submission.setAssignment(assignment);
        submission.setStudent(student);
        submission.setFileUrl(dto.getFileUrl());
        submission.setSubmittedAt(now);
        submission.setStatus(status);

        Submission saved = submissionRepository.save(submission);
        return mapToDTO(saved);
    }

    @Transactional
    public SubmissionDTO gradeSubmission(Long submissionId, Integer marks, String feedback) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found"));

        submission.setMarks(marks);
        submission.setFeedback(feedback);

        Submission saved = submissionRepository.save(submission);

        // Notify student
        String message = String.format("Your submission for '%s' has been graded. Marks: %d/%d", 
                submission.getAssignment().getTitle(), marks, submission.getAssignment().getMaxMarks());
        
        notificationService.createNotification(submission.getStudent().getId(), "Assignment Graded", message, Notification.NotificationType.ASSIGNMENT);

        return mapToDTO(saved);
    }

    public List<SubmissionDTO> getSubmissionsByAssignment(Long assignmentId) {
        return submissionRepository.findByAssignmentId(assignmentId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public SubmissionDTO getStudentSubmission(Long assignmentId, Long studentId) {
        return submissionRepository.findByAssignmentIdAndStudentId(assignmentId, studentId)
                .map(this::mapToDTO)
                .orElse(null);
    }

    private SubmissionDTO mapToDTO(Submission s) {
        return SubmissionDTO.builder()
                .id(s.getId())
                .assignmentId(s.getAssignment().getId())
                .assignmentTitle(s.getAssignment().getTitle())
                .studentId(s.getStudent().getId())
                .studentName(s.getStudent().getUsername())
                .fileUrl(s.getFileUrl())
                .submittedAt(s.getSubmittedAt())
                .marks(s.getMarks())
                .feedback(s.getFeedback())
                .status(s.getStatus().name())
                .build();
    }
}
