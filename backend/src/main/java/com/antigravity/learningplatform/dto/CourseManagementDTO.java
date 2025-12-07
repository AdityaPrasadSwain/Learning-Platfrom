package com.antigravity.learningplatform.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CourseManagementDTO {
    private Long id;
    private String title;
    private String description;
    private Long instructorId;
    private String instructorName;
    private Boolean isPublished;
    private String category;
    private Integer duration;
    private Integer lessonsCount;
    private Integer enrollmentsCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
