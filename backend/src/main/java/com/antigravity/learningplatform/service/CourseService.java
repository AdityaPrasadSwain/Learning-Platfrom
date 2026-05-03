package com.antigravity.learningplatform.service;

import com.antigravity.learningplatform.dto.CourseDTO;
import com.antigravity.learningplatform.entity.Course;
import com.antigravity.learningplatform.entity.User;
import com.antigravity.learningplatform.entity.CourseMaterial;
import com.antigravity.learningplatform.repository.CourseRepository;
import com.antigravity.learningplatform.repository.CourseMaterialRepository;
import com.antigravity.learningplatform.repository.UserRepository;
import com.antigravity.learningplatform.repository.EnrollmentRepository;
import org.springframework.web.multipart.MultipartFile;
import java.util.ArrayList;
import java.util.List;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final CourseMaterialRepository courseMaterialRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // ... (existing code)

    @Transactional
    public void deleteCourse(Long id) {
        System.out.println("DEBUG: Attempting to delete course with ID: " + id);
        // Explicitly delete related data to avoid FK constraints
        try {
            enrollmentRepository.deleteByCourseId(id);
            System.out.println("DEBUG: Successfully deleted enrollments for course ID: " + id);
        } catch (Exception e) {
            System.err.println("DEBUG: Failed to delete enrollments: " + e.getMessage());
            e.printStackTrace();
        }

        courseRepository.deleteById(id);
        System.out.println("DEBUG: Successfully deleted course with ID: " + id);
    }

    public CourseDTO createCourse(Course course) {
        // Get current user as instructor
        User instructor = null;
        try {
            var auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated()) {
                String username = auth.getName();
                instructor = userRepository.findByUsername(username).orElse(null);
            }
        } catch (Exception e) {
            System.err.println("DEBUG: Auth error in createCourse: " + e.getMessage());
        }

        course.setInstructor(instructor);
        course.setCreatedAt(LocalDateTime.now());
        course.setUpdatedAt(LocalDateTime.now());
        course.setIsPublished(false);
        Course saved = courseRepository.save(course);
        return convertToDTO(saved);
    }

    public Course getCourseById(Long id) {
        return courseRepository.findById(id).orElseThrow(() -> new RuntimeException("Course not found"));
    }

    public CourseDTO updateCourse(Long id, Course courseDetails) {
        Course course = getCourseById(id);
        course.setTitle(courseDetails.getTitle());
        course.setDescription(courseDetails.getDescription());
        course.setCategory(courseDetails.getCategory());
        course.setDuration(courseDetails.getDuration());
        course.setIsPublished(courseDetails.getIsPublished());
        course.setUpdatedAt(LocalDateTime.now());
        Course updatedCourse = courseRepository.save(course);
        return convertToDTO(updatedCourse);
    }

    // Add materials (videos, PDFs, etc.) to a course
    public List<CourseMaterial> addMaterials(Long courseId, MultipartFile[] files) {
        Course course = getCourseById(courseId);
        List<CourseMaterial> savedMaterials = new ArrayList<>();
        Path uploadDir = Path.of("uploads", "course-materials");
        try {
            Files.createDirectories(uploadDir);
            for (MultipartFile file : files) {
                String originalFilename = file.getOriginalFilename();
                String fileType = file.getContentType();
                Path targetPath = uploadDir.resolve(originalFilename);
                Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
                CourseMaterial material = CourseMaterial.builder()
                        .course(course) // Associate with course
                        .lesson(null) // TODO: associate with lesson if needed
                        .fileName(originalFilename)
                        .fileType(fileType)
                        .fileUrl(targetPath.toString())
                        .fileSize(file.getSize())
                        .uploadedAt(LocalDateTime.now())
                        .description("")
                        .build();
                savedMaterials.add(courseMaterialRepository.save(material));
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to store course materials", e);
        }
        return savedMaterials;
    }

    public List<CourseMaterial> getMaterialsByCourseId(Long courseId) {
        return courseMaterialRepository.findByCourseId(courseId);
    }

    public List<CourseDTO> getTeacherCourses() {
        try {
            // Get current logged-in teacher from SecurityContext
            var authentication = org.springframework.security.core.context.SecurityContextHolder
                    .getContext().getAuthentication();
            
            if (authentication == null || !authentication.isAuthenticated()) {
                System.out.println("DEBUG: Authentication is null or not authenticated");
                return new ArrayList<>();
            }
            
            String currentUsername = authentication.getName();
            System.out.println("DEBUG: Current username from SecurityContext: " + currentUsername);
            
            java.util.Optional<User> teacherOptional = userRepository.findByUsername(currentUsername);
            if (!teacherOptional.isPresent()) {
                System.out.println("DEBUG: Teacher not found with username: " + currentUsername);
                return new ArrayList<>();
            }
            
            User teacher = teacherOptional.get();
            System.out.println("DEBUG: Found teacher with ID: " + teacher.getId() + ", Role: " + teacher.getRole());
            
            // For development/flexibility, teachers can see and manage ALL courses
            List<Course> courses = courseRepository.findAll();
            
            System.out.println("DEBUG: Teacher " + currentUsername + " (ID: " + teacher.getId() + ") is accessing ALL " + courses.size() + " courses.");
            
            System.out.println("DEBUG: Found " + courses.size() + " courses for teacher " + currentUsername);
            
            return courses.stream()
                    .map(this::convertToDTO)
                    .collect(java.util.stream.Collectors.toList());
        } catch (Exception e) {
            System.err.println("DEBUG: Error in getTeacherCourses: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
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
