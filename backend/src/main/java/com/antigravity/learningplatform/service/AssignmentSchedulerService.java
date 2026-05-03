package com.antigravity.learningplatform.service;

import com.antigravity.learningplatform.entity.Assignment;
import com.antigravity.learningplatform.entity.Enrollment;
import com.antigravity.learningplatform.entity.Notification;
import com.antigravity.learningplatform.entity.Submission;
import com.antigravity.learningplatform.repository.AssignmentRepository;
import com.antigravity.learningplatform.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssignmentSchedulerService {

    private final AssignmentRepository assignmentRepository;
    private final SubmissionRepository submissionRepository;
    private final NotificationService notificationService;

    // Run every day at midnight
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void checkAssignmentDeadlines() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime tomorrow = now.plusDays(1);
        
        List<Assignment> assignments = assignmentRepository.findAll();

        for (Assignment assignment : assignments) {
            // 1. Reminder: Due tomorrow
            if (assignment.getDueDate().isAfter(now) && assignment.getDueDate().isBefore(tomorrow)) {
                sendReminders(assignment);
            }

            // 2. Missing: Just passed deadline
            if (assignment.getDueDate().isBefore(now) && assignment.getDueDate().isAfter(now.minusDays(1))) {
                markMissingSubmissions(assignment);
            }
        }
    }

    private void sendReminders(Assignment assignment) {
        List<Enrollment> enrollments = assignment.getCourse().getEnrollments();
        for (Enrollment enrollment : enrollments) {
            boolean alreadySubmitted = submissionRepository.findByAssignmentIdAndStudentId(assignment.getId(), enrollment.getStudent().getId()).isPresent();
            if (!alreadySubmitted) {
                String message = String.format("Reminder: Assignment '%s' is due tomorrow!", assignment.getTitle());
                notificationService.createNotification(enrollment.getStudent().getId(), "Assignment Due Soon", message, Notification.NotificationType.ASSIGNMENT);
            }
        }
    }

    private void markMissingSubmissions(Assignment assignment) {
        List<Enrollment> enrollments = assignment.getCourse().getEnrollments();
        for (Enrollment enrollment : enrollments) {
            boolean alreadySubmitted = submissionRepository.findByAssignmentIdAndStudentId(assignment.getId(), enrollment.getStudent().getId()).isPresent();
            if (!alreadySubmitted) {
                // Create a "MISSING" submission record
                Submission submission = Submission.builder()
                        .assignment(assignment)
                        .student(enrollment.getStudent())
                        .status(Submission.SubmissionStatus.MISSING)
                        .build();
                submissionRepository.save(submission);

                String message = String.format("You missed the deadline for assignment '%s'. Status marked as MISSING.", assignment.getTitle());
                notificationService.createNotification(enrollment.getStudent().getId(), "Assignment Missed", message, Notification.NotificationType.ASSIGNMENT);
            }
        }
    }
}
