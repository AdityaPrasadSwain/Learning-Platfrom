package com.antigravity.learningplatform.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseProgressDTO {
    private Long courseId;
    private String courseTitle;
    private Integer totalLessons;
    private Integer completedLessons;
    private Double progressPercentage;
    private List<LessonProgressDTO> lessons;
}
