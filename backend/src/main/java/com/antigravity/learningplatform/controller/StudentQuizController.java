package com.antigravity.learningplatform.controller;

import com.antigravity.learningplatform.dto.QuizAttemptDTO;
import com.antigravity.learningplatform.dto.QuizDTO;
import com.antigravity.learningplatform.dto.QuizSubmissionDTO;
import com.antigravity.learningplatform.entity.User;
import com.antigravity.learningplatform.service.QuizService;
import com.antigravity.learningplatform.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/quiz")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STUDENT')")
public class StudentQuizController {

    private final QuizService quizService;
    private final ReportService reportService;

    @GetMapping
    public ResponseEntity<List<QuizDTO>> getAvailableQuizzes(@AuthenticationPrincipal User student) {
        System.out.println("Fetching available quizzes for student: " + student.getUsername());
        List<QuizDTO> quizzes = quizService.getPublishedQuizzes(student.getId());
        System.out.println("Found " + quizzes.size() + " published quizzes");
        return ResponseEntity.ok(quizzes);
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<QuizDTO>> getQuizzesByCourse(@PathVariable Long courseId,
            @AuthenticationPrincipal User student) {
        List<QuizDTO> quizzes = quizService.getQuizzesByCourse(courseId, student.getId());
        return ResponseEntity.ok(quizzes);
    }

    @GetMapping("/{quizId}")
    public ResponseEntity<QuizDTO> getQuiz(@PathVariable Long quizId,
            @AuthenticationPrincipal User student) {
        QuizDTO quiz = quizService.getQuizForStudent(quizId, student.getId());
        return ResponseEntity.ok(quiz);
    }

    @PostMapping("/{quizId}/submit")
    public ResponseEntity<QuizAttemptDTO> submitQuiz(@PathVariable Long quizId,
            @RequestBody QuizSubmissionDTO submission,
            @AuthenticationPrincipal User student) {
        QuizAttemptDTO result = quizService.submitQuiz(quizId, submission, student.getId());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/quiz/{quizId}/result")
    public ResponseEntity<QuizAttemptDTO> getQuizResult(@PathVariable Long quizId,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        QuizAttemptDTO attempt = quizService.getStudentQuizResult(quizId, username);
        return ResponseEntity.ok(attempt);
    }

    @GetMapping("/quizzes/{quizId}/result/download")
    public ResponseEntity<byte[]> downloadQuizResult(@PathVariable Long quizId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String username = userDetails.getUsername();
            QuizAttemptDTO attempt = quizService.getStudentQuizResult(quizId, username);
            byte[] report = reportService.generateStudentQuizResultReport(attempt);
            return ResponseEntity.ok()
                    .header("Content-Type", "application/pdf")
                    .header("Content-Disposition", "attachment; filename=quiz_result_" + quizId + ".pdf")
                    .body(report);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
