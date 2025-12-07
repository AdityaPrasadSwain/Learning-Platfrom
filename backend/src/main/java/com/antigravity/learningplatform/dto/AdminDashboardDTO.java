package com.antigravity.learningplatform.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdminDashboardDTO {
    private Long totalUsers;
    private Long totalAdmins;
    private Long totalTeachers;
    private Long totalStudents;
    private Long totalCourses;
    private Long publishedCourses;
    private Long unpublishedCourses;
    private Long totalEnrollments;
    private Long activeUsers;
    private Long suspendedUsers;
}
