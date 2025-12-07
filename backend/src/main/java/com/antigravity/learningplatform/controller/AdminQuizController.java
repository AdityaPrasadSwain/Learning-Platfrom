package com.antigravity.learningplatform.controller;

import com.antigravity.learningplatform.dto.QuizAttemptDTO;
import com.antigravity.learningplatform.dto.QuizDTO;
import com.antigravity.learningplatform.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/quizzes")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminQuizController {

    private final QuizService quizService;
    private final com.antigravity.learningplatform.service.ReportService reportService;

    @GetMapping
    public ResponseEntity<List<QuizDTO>> getAllQuizzes() {
        List<QuizDTO> quizzes = quizService.getAllQuizzes();
        return ResponseEntity.ok(quizzes);
    }

    @GetMapping("/{quizId}")
    public ResponseEntity<QuizDTO> getQuizDetails(@PathVariable Long quizId) {
        QuizDTO quiz = quizService.getQuizDetailsForAdmin(quizId);
        return ResponseEntity.ok(quiz);
    }

    @GetMapping("/{quizId}/attempts")
    public ResponseEntity<List<QuizAttemptDTO>> getQuizAttempts(@PathVariable Long quizId) {
        List<QuizAttemptDTO> attempts = quizService.getQuizAttempts(quizId);
        return ResponseEntity.ok(attempts);
    }

    @GetMapping("/attempts")
    public ResponseEntity<List<QuizAttemptDTO>> getAllAttempts() {
        List<QuizAttemptDTO> attempts = quizService.getAllQuizAttempts();
        return ResponseEntity.ok(attempts);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getQuizStatistics() {
        Map<String, Object> stats = quizService.getQuizStatistics();
        return ResponseEntity.ok(stats);
    }

    @DeleteMapping("/{quizId}")
    public ResponseEntity<Map<String, String>> deleteQuiz(@PathVariable Long quizId) {
        quizService.deleteQuizByAdmin(quizId);
        return ResponseEntity.ok(Map.of("message", "Quiz deleted successfully"));
    }

    @PutMapping("/{quizId}/toggle-publish")
    public ResponseEntity<QuizDTO> togglePublishStatus(@PathVariable Long quizId) {
        QuizDTO quiz = quizService.togglePublishByAdmin(quizId);
        return ResponseEntity.ok(quiz);
    }

    @GetMapping("/report")
    public ResponseEntity<byte[]> downloadQuizReport() {
        try {
            List<QuizDTO> quizzes = quizService.getAllQuizzes();
            byte[] report = reportService.generateQuizReport(quizzes);

            return ResponseEntity.ok()
                    .header("Content-Type", "application/pdf")
                    .header("Content-Disposition", "attachment; filename=quiz_report.pdf")
                    .body(report);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
