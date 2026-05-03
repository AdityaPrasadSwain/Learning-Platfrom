package com.antigravity.learningplatform.dto;

import com.antigravity.learningplatform.entity.SessionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ClassSessionDTO {
    private Long id;
    private Long courseId;
    private String courseName;
    private Long teacherId;
    private String teacherName;
    private String meetingLink;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private SessionStatus status;
    private String recordingUrl;
    private Integer attendanceCount;
}
