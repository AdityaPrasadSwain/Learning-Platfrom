package com.antigravity.learningplatform.service;

import com.antigravity.learningplatform.dto.EnrollmentDTO;
import com.antigravity.learningplatform.entity.Course;
import com.antigravity.learningplatform.entity.Enrollment;
import com.antigravity.learningplatform.entity.User;
import com.antigravity.learningplatform.repository.CourseRepository;
import com.antigravity.learningplatform.repository.EnrollmentRepository;
import com.antigravity.learningplatform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public EnrollmentDTO enrollInCourse(Long courseId) {
        User student = getCurrentUser();
        
        // Check if already enrolled
        if (enrollmentRepository.existsByStudentIdAndCourseId(student.getId(), courseId)) {
            throw new RuntimeException("Already enrolled in this course");
        }

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Enrollment enrollment = Enrollment.builder()
                .student(student)
                .course(course)
                .enrolledAt(LocalDateTime.now())
                .progress(0)
                .completed(false)
                .lastAccessed(LocalDateTime.now())
                .build();

        Enrollment saved = enrollmentRepository.save(enrollment);
        return convertToDTO(saved);
    }

    public void unenrollFromCourse(Long courseId) {
        User student = getCurrentUser();
        
        Enrollment enrollment = enrollmentRepository.findByStudentIdAndCourseId(student.getId(), courseId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        enrollmentRepository.delete(enrollment);
    }

    public List<EnrollmentDTO> getMyEnrollments() {
        User student = getCurrentUser();
        
        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(student.getId());
        return enrollments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public boolean isEnrolled(Long courseId) {
        User student = getCurrentUser();
        return enrollmentRepository.existsByStudentIdAndCourseId(student.getId(), courseId);
    }

    public EnrollmentDTO updateProgress(Long courseId, Integer progress) {
        User student = getCurrentUser();
        
        Enrollment enrollment = enrollmentRepository.findByStudentIdAndCourseId(student.getId(), courseId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        enrollment.setProgress(progress);
        enrollment.setLastAccessed(LocalDateTime.now());
        
        if (progress >= 100 && !enrollment.getCompleted()) {
            enrollment.setCompleted(true);
            enrollment.setCompletedAt(LocalDateTime.now());
        }

        Enrollment updated = enrollmentRepository.save(enrollment);
        return convertToDTO(updated);
    }

    private User getCurrentUser() {
        try {
            var auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() instanceof User) {
                return (User) auth.getPrincipal();
            }
        } catch (Exception e) {
            // Ignore
        }
        
        // Fallback for testing
        return userRepository.findByUsername("student1")
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private EnrollmentDTO convertToDTO(Enrollment enrollment) {
        Course course = enrollment.getCourse();
        return EnrollmentDTO.builder()
                .id(enrollment.getId())
                .studentId(enrollment.getStudent().getId())
                .studentName(enrollment.getStudent().getUsername())
                .courseId(course.getId())
                .courseTitle(course.getTitle())
                .courseDescription(course.getDescription())
                .courseCategory(course.getCategory())
                .courseDuration(course.getDuration())
                .instructorName(course.getInstructor() != null ? course.getInstructor().getUsername() : null)
                .enrolledAt(enrollment.getEnrolledAt())
                .progress(enrollment.getProgress())
                .completed(enrollment.getCompleted())
                .completedAt(enrollment.getCompletedAt())
                .lastAccessed(enrollment.getLastAccessed())
                .build();
    }
}
