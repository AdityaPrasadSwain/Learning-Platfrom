package com.antigravity.learningplatform.dto;

import com.antigravity.learningplatform.entity.Submission;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionDTO {
    private Long id;
    private Long assignmentId;
    private String assignmentTitle;
    private Long studentId;
    private String studentName;
    private String fileUrl;
    private LocalDateTime submittedAt;
    private Integer marks;
    private String feedback;
    private String status;
}
