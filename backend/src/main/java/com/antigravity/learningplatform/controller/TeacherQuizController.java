package com.antigravity.learningplatform.controller;

import com.antigravity.learningplatform.dto.QuestionDTO;
import com.antigravity.learningplatform.dto.QuizDTO;
import com.antigravity.learningplatform.entity.User;
import com.antigravity.learningplatform.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/teacher/quiz")
@RequiredArgsConstructor
@PreAuthorize("hasRole('TEACHER')")
public class TeacherQuizController {

    private final QuizService quizService;

    @PostMapping
    public ResponseEntity<QuizDTO> createQuiz(
            @RequestBody QuizDTO quizDTO,
            @AuthenticationPrincipal User teacher) {
        QuizDTO created = quizService.createQuiz(quizDTO, teacher.getId());
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<QuizDTO>> getMyQuizzes(@AuthenticationPrincipal User teacher) {
        List<QuizDTO> quizzes = quizService.getTeacherQuizzes(teacher.getId());
        return ResponseEntity.ok(quizzes);
    }

    @GetMapping("/{quizId}")
    public ResponseEntity<QuizDTO> getQuiz(
            @PathVariable Long quizId,
            @AuthenticationPrincipal User teacher) {
        QuizDTO quiz = quizService.getQuizById(quizId, teacher.getId());
        return ResponseEntity.ok(quiz);
    }

    @PutMapping("/{quizId}")
    public ResponseEntity<QuizDTO> updateQuiz(
            @PathVariable Long quizId,
            @RequestBody QuizDTO quizDTO,
            @AuthenticationPrincipal User teacher) {
        QuizDTO updated = quizService.updateQuiz(quizId, quizDTO, teacher.getId());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{quizId}")
    public ResponseEntity<Map<String, String>> deleteQuiz(
            @PathVariable Long quizId,
            @AuthenticationPrincipal User teacher) {
        quizService.deleteQuiz(quizId, teacher.getId());
        return ResponseEntity.ok(Map.of("message", "Quiz deleted successfully"));
    }

    @PostMapping("/{quizId}/publish")
    public ResponseEntity<QuizDTO> togglePublish(
            @PathVariable Long quizId,
            @AuthenticationPrincipal User teacher) {
        QuizDTO quiz = quizService.togglePublish(quizId, teacher.getId());
        return ResponseEntity.ok(quiz);
    }

    // Question endpoints
    @PostMapping("/{quizId}/question")
    public ResponseEntity<QuestionDTO> addQuestion(
            @PathVariable Long quizId,
            @RequestBody QuestionDTO questionDTO,
            @AuthenticationPrincipal User teacher) {
        QuestionDTO created = quizService.addQuestion(quizId, questionDTO, teacher.getId());
        return ResponseEntity.ok(created);
    }

    @PutMapping("/question/{questionId}")
    public ResponseEntity<QuestionDTO> updateQuestion(
            @PathVariable Long questionId,
            @RequestBody QuestionDTO questionDTO,
            @AuthenticationPrincipal User teacher) {
        QuestionDTO updated = quizService.updateQuestion(questionId, questionDTO, teacher.getId());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/question/{questionId}")
    public ResponseEntity<Map<String, String>> deleteQuestion(
            @PathVariable Long questionId,
            @AuthenticationPrincipal User teacher) {
        quizService.deleteQuestion(questionId, teacher.getId());
        return ResponseEntity.ok(Map.of("message", "Question deleted successfully"));
    }
}
