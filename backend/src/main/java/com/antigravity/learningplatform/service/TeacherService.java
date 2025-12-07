package com.antigravity.learningplatform.service;

import com.antigravity.learningplatform.entity.Course;
import com.antigravity.learningplatform.entity.Lesson;
import com.antigravity.learningplatform.entity.User;
import com.antigravity.learningplatform.repository.CourseRepository;
import com.antigravity.learningplatform.repository.LessonRepository;
import com.antigravity.learningplatform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TeacherService {

    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final UserRepository userRepository;
    private final com.antigravity.learningplatform.repository.TeacherApplicationRepository teacherApplicationRepository;
    private final CloudinaryService cloudinaryService;

    public void submitApplication(com.antigravity.learningplatform.dto.TeacherApplicationRequest request,
            org.springframework.web.multipart.MultipartFile resumeFile) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        java.util.Optional<com.antigravity.learningplatform.entity.TeacherApplication> existingApp = teacherApplicationRepository
                .findByUser_Id(user.getId());

        com.antigravity.learningplatform.entity.TeacherApplication application;

        if (existingApp.isPresent()) {
            com.antigravity.learningplatform.entity.TeacherApplication app = existingApp.get();
            if (app.getStatus() != com.antigravity.learningplatform.entity.TeacherApplication.ApplicationStatus.REJECTED) {
                throw new RuntimeException("Application already submitted");
            }
            application = app;
        } else {
            application = com.antigravity.learningplatform.entity.TeacherApplication.builder()
                    .user(user)
                    .build();
        }

        String resumeUrl = request.getResumeUrl();
        if (resumeFile != null && !resumeFile.isEmpty()) {
            try {
                java.util.Map<String, Object> uploadResult = cloudinaryService.uploadFile(resumeFile);
                resumeUrl = (String) uploadResult.get("url");
            } catch (java.io.IOException e) {
                throw new RuntimeException("Failed to upload resume", e);
            }
        }

        application.setResumeUrl(resumeUrl);
        application.setExperience(request.getExperience());
        application.setBio(request.getBio());
        application.setStatus(com.antigravity.learningplatform.entity.TeacherApplication.ApplicationStatus.PENDING);
        application.setSubmittedAt(LocalDateTime.now());
        application.setRejectionReason(null);

        teacherApplicationRepository.save(application);
    }

    public com.antigravity.learningplatform.entity.TeacherApplication getApplicationStatus(Long userId) {
        return teacherApplicationRepository.findByUser_Id(userId)
                .orElse(null);
    }

    public List<Course> getMyCourses(Long teacherId) {
        // Assuming we can filter by instructor. If not, we might need to add a method
        // to repository.
        // For now, let's assume we can fetch all and filter or add a custom query.
        // Ideally: return courseRepository.findByInstructorId(teacherId);
        // Since we don't have that method yet, let's add it or filter manually (less
        // efficient but works for now).
        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        // Better approach: Add findByInstructor to CourseRepository.
        // For this step, I will assume I can add it or use Example matcher, but let's
        // stick to simple logic.
        // Let's rely on the fact that we will update the repository in the next step if
        // needed.
        // Actually, let's just use findAll and filter stream for MVP to avoid
        // compilation error if repo doesn't have it.
        return courseRepository.findByInstructor_Id(teacherId);
    }

    @Transactional
    public Course createCourse(Course course, Long teacherId) {
        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        if (!teacher.getIsApproved()) {
            throw new RuntimeException("Unauthorized: Teacher account not approved.");
        }

        course.setInstructor(teacher);
        course.setCreatedAt(LocalDateTime.now());
        course.setUpdatedAt(LocalDateTime.now());
        course.setIsPublished(false); // Default to draft

        return courseRepository.save(course);
    }

    @Transactional
    public Course updateCourse(Long courseId, Course updatedCourse, Long teacherId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (!course.getInstructor().getId().equals(teacherId)) {
            throw new RuntimeException("Unauthorized: You are not the instructor of this course");
        }

        course.setTitle(updatedCourse.getTitle());
        course.setDescription(updatedCourse.getDescription());
        course.setCategory(updatedCourse.getCategory());
        course.setDuration(updatedCourse.getDuration());
        course.setUpdatedAt(LocalDateTime.now());

        return courseRepository.save(course);
    }

    @Transactional
    public Lesson addLesson(Long courseId, Lesson lesson, Long teacherId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (!course.getInstructor().getId().equals(teacherId)) {
            throw new RuntimeException("Unauthorized: You are not the instructor of this course");
        }

        lesson.setCourse(course);
        return lessonRepository.save(lesson);
    }
}
