package com.antigravity.learningplatform.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizDTO {
    private Long id;
    private String title;
    private String description;
    private Long courseId;
    private String courseName;
    private Long createdById;
    private String createdByName;
    private Boolean isPublished;
    private Integer totalMarks;
    private Integer duration;
    private Integer questionCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<QuestionDTO> questions;
    private Boolean hasAttempted;
    private Integer bestScore;
}
