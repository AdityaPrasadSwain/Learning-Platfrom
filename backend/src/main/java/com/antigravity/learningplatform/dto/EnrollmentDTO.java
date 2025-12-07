package com.antigravity.learningplatform.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentDTO {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long courseId;
    private String courseTitle;
    private String courseDescription;
    private String courseCategory;
    private Integer courseDuration;
    private String instructorName;
    private LocalDateTime enrolledAt;
    private Integer progress;
    private Boolean completed;
    private LocalDateTime completedAt;
    private LocalDateTime lastAccessed;
}
