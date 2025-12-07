package com.antigravity.learningplatform.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizAttemptDTO {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long quizId;
    private String quizTitle;
    private Integer score;
    private Integer totalMarks;
    private Integer correctAnswers;
    private Integer totalQuestions;
    private Double percentage;
    private Map<Long, String> answers;
    private LocalDateTime startedAt;
    private LocalDateTime submittedAt;
    private Boolean isCompleted;
    private List<QuestionResultDTO> questionResults;
}
