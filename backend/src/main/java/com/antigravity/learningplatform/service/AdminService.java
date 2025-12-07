package com.antigravity.learningplatform.service;

import com.antigravity.learningplatform.dto.DashboardStatsDTO;
import com.antigravity.learningplatform.entity.AuditLog;
import com.antigravity.learningplatform.entity.Course;
import com.antigravity.learningplatform.entity.Role;
import com.antigravity.learningplatform.entity.User;
import com.antigravity.learningplatform.repository.AuditLogRepository;
import com.antigravity.learningplatform.repository.CourseRepository;
import com.antigravity.learningplatform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final AuditLogRepository auditLogRepository;

    // --- User Management ---

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public User suspendUser(Long userId, String reason) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsSuspended(true);
        user.setSuspensionReason(reason);

        logAction("SUSPEND_USER", "USER", userId, "Reason: " + reason);
        return userRepository.save(user);
    }

    @Transactional
    public User activateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsSuspended(false);
        user.setSuspensionReason(null);

        logAction("ACTIVATE_USER", "USER", userId, null);
        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
        logAction("DELETE_USER", "USER", userId, null);
    }

    // --- Course Management ---

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    @Transactional
    public Course approveCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        course.setIsPublished(true);

        logAction("APPROVE_COURSE", "COURSE", courseId, null);
        return courseRepository.save(course);
    }

    @Transactional
    public Course rejectCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        course.setIsPublished(false);

        logAction("REJECT_COURSE", "COURSE", courseId, null);
        return courseRepository.save(course);
    }

    // --- Dashboard & Audit ---

    public DashboardStatsDTO getDashboardStats() {
        long totalUsers = userRepository.count();
        long suspendedUsers = userRepository.findAll().stream()
                .filter(user -> user.getIsSuspended() != null && user.getIsSuspended())
                .count();

        return DashboardStatsDTO.builder()
                .totalUsers(totalUsers)
                .totalStudents(userRepository.countByRole(Role.STUDENT))
                .totalTeachers(userRepository.countByRole(Role.TEACHER))
                .totalCourses(courseRepository.count())
                .activeCourses(courseRepository.countByIsPublished(true))
                .totalEnrollments(0L) // TODO: Implement when Enrollment entity is ready
                .activeUsers(totalUsers - suspendedUsers)
                .suspendedUsers(suspendedUsers)
                .build();
    }

    public List<AuditLog> getAllAuditLogs() {
        return auditLogRepository.findAllByOrderByTimestampDesc();
    }

    private void logAction(String action, String entityType, Long entityId, String details) {
        AuditLog log = AuditLog.builder()
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .adminId(1L) // TODO: Get actual logged-in admin ID from SecurityContext
                .details(details)
                .build();
        auditLogRepository.save(log);
    }
}
