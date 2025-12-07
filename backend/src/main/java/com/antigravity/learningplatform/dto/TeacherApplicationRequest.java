package com.antigravity.learningplatform.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TeacherApplicationRequest {
    private Long userId;
    private String resumeUrl;
    private String experience;
    private String bio;
}
