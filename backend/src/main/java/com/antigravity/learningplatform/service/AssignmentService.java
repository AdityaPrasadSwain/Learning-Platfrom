package com.antigravity.learningplatform.service;

import com.antigravity.learningplatform.dto.AssignmentDTO;
import com.antigravity.learningplatform.entity.Assignment;
import com.antigravity.learningplatform.entity.Course;
import com.antigravity.learningplatform.entity.Notification;
import com.antigravity.learningplatform.entity.User;
import com.antigravity.learningplatform.repository.AssignmentRepository;
import com.antigravity.learningplatform.repository.CourseRepository;
import com.antigravity.learningplatform.repository.SubmissionRepository;
import com.antigravity.learningplatform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final SubmissionRepository submissionRepository;
    private final NotificationService notificationService;

    @Transactional
    public AssignmentDTO createAssignment(AssignmentDTO dto) {
        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        User teacher = userRepository.findById(dto.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        if (!course.getInstructor().getId().equals(teacher.getId())) {
            throw new RuntimeException("Only the course instructor can create assignments");
        }

        Assignment assignment = Assignment.builder()
                .course(course)
                .teacher(teacher)
                .title(dto.getTitle())
                .description(dto.getDescription())
                .dueDate(dto.getDueDate())
                .maxMarks(dto.getMaxMarks())
                .build();

        Assignment saved = assignmentRepository.save(assignment);

        // Notify students
        List<Long> studentIds = course.getEnrollments().stream()
                .map(enrollment -> enrollment.getStudent().getId())
                .collect(Collectors.toList());
        
        String message = String.format("A new assignment '%s' has been created for your course '%s'. Due date: %s", 
                saved.getTitle(), course.getTitle(), saved.getDueDate().toString());
        
        notificationService.notifyStudents(studentIds, "New Assignment Created", message, Notification.NotificationType.ASSIGNMENT);

        return mapToDTO(saved, null);
    }

    public List<AssignmentDTO> getAssignmentsByCourse(Long courseId, Long studentId) {
        return assignmentRepository.findByCourseId(courseId).stream()
                .map(a -> {
                    boolean isSubmitted = false;
                    if (studentId != null) {
                        isSubmitted = submissionRepository.findByAssignmentIdAndStudentId(a.getId(), studentId).isPresent();
                    }
                    return mapToDTO(a, isSubmitted);
                })
                .collect(Collectors.toList());
    }

    public List<AssignmentDTO> getAssignmentsByTeacher(Long teacherId) {
        return assignmentRepository.findByTeacherId(teacherId).stream()
                .map(a -> mapToDTO(a, null))
                .collect(Collectors.toList());
    }

    public AssignmentDTO getAssignmentById(Long id, Long studentId) {
        Assignment a = assignmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
        boolean isSubmitted = false;
        if (studentId != null) {
            isSubmitted = submissionRepository.findByAssignmentIdAndStudentId(a.getId(), studentId).isPresent();
        }
        return mapToDTO(a, isSubmitted);
    }

    private AssignmentDTO mapToDTO(Assignment a, Boolean isSubmitted) {
        return AssignmentDTO.builder()
                .id(a.getId())
                .courseId(a.getCourse().getId())
                .courseTitle(a.getCourse().getTitle())
                .teacherId(a.getTeacher().getId())
                .teacherName(a.getTeacher().getUsername())
                .title(a.getTitle())
                .description(a.getDescription())
                .dueDate(a.getDueDate())
                .maxMarks(a.getMaxMarks())
                .createdAt(a.getCreatedAt())
                .isSubmitted(isSubmitted)
                .build();
    }
}
