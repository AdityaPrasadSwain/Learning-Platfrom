package com.antigravity.learningplatform.service;

import com.antigravity.learningplatform.dto.DashboardStatsDTO;
import com.antigravity.learningplatform.entity.AuditLog;
import com.antigravity.learningplatform.entity.Course;
import com.antigravity.learningplatform.entity.Role;
import com.antigravity.learningplatform.entity.User;
import com.antigravity.learningplatform.repository.AuditLogRepository;
import com.antigravity.learningplatform.repository.CourseRepository;
import com.antigravity.learningplatform.repository.UserRepository;
import com.antigravity.learningplatform.repository.EnrollmentRepository;
import com.antigravity.learningplatform.dto.CourseDTO;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final AuditLogRepository auditLogRepository;
    private final EnrollmentRepository enrollmentRepository;

    // --- User Management ---

    public Page<User> getAllUsers(String search, Role role, Boolean isSuspended, int page, int size, String sortBy, String direction) {
        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        return userRepository.findUsersWithFilters(search, role, isSuspended, pageable);
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

    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public CourseDTO approveCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        course.setIsPublished(true);

        logAction("APPROVE_COURSE", "COURSE", courseId, null);
        return convertToDTO(courseRepository.save(course));
    }

    @Transactional
    public CourseDTO rejectCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        course.setIsPublished(false);

        logAction("REJECT_COURSE", "COURSE", courseId, null);
        return convertToDTO(courseRepository.save(course));
    }

    // --- Dashboard & Audit ---

    public DashboardStatsDTO getDashboardStats() {
        long totalUsers = userRepository.count();
        Long suspendedCount = userRepository.countByIsSuspended(true);
        long suspendedUsers = suspendedCount != null ? suspendedCount : 0L;

        Long studentCount = userRepository.countByRole(Role.STUDENT);
        Long teacherCount = userRepository.countByRole(Role.TEACHER);
        Long activeCourseCount = courseRepository.countByIsPublished(true);
        long courseCount = courseRepository.count();

        return DashboardStatsDTO.builder()
                .totalUsers(totalUsers)
                .totalStudents(studentCount != null ? studentCount : 0L)
                .totalTeachers(teacherCount != null ? teacherCount : 0L)
                .totalCourses(courseCount)
                .activeCourses(activeCourseCount != null ? activeCourseCount : 0L)
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

    private CourseDTO convertToDTO(Course course) {
        long enrollmentCount = enrollmentRepository.countByCourseId(course.getId());
        
        return CourseDTO.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .category(course.getCategory())
                .duration(course.getDuration())
                .isPublished(course.getIsPublished())
                .instructorId(course.getInstructor() != null ? course.getInstructor().getId() : null)
                .instructorName(course.getInstructor() != null ? course.getInstructor().getUsername() : null)
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                .enrollmentCount(enrollmentCount)
                .build();
    }
}
