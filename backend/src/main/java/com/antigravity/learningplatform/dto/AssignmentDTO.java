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
public class AssignmentDTO {
    private Long id;
    private Long courseId;
    private String courseTitle;
    private Long teacherId;
    private String teacherName;
    private String title;
    private String description;
    private LocalDateTime dueDate;
    private Integer maxMarks;
    private LocalDateTime createdAt;
    private Boolean isSubmitted; // For student view
}
