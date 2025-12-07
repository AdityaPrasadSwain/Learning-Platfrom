package com.antigravity.learningplatform.service;

import com.antigravity.learningplatform.dto.CourseDTO;
import com.antigravity.learningplatform.entity.Course;
import com.antigravity.learningplatform.entity.User;
import com.antigravity.learningplatform.repository.CourseRepository;
import com.antigravity.learningplatform.repository.CourseMaterialRepository;
import com.antigravity.learningplatform.entity.CourseMaterial;
import org.springframework.web.multipart.MultipartFile;
import java.util.ArrayList;
import java.util.List;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final CourseMaterialRepository courseMaterialRepository;
    private final com.antigravity.learningplatform.repository.UserRepository userRepository;
    private final com.antigravity.learningplatform.repository.EnrollmentRepository enrollmentRepository;

    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // ... (existing code)

    @org.springframework.transaction.annotation.Transactional
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
            if (auth != null && auth.getPrincipal() instanceof User) {
                instructor = (User) auth.getPrincipal();
            }
        } catch (Exception e) {
            // Ignore auth errors
        }

        // Fallback for testing/unauthenticated access
        if (instructor == null) {
            // Try to find a default teacher or admin
            instructor = userRepository.findByUsername("teacher").orElse(null);
            if (instructor == null) {
                instructor = userRepository.findByUsername("admin").orElse(null);
            }

            // If still null, create a dummy user (should ideally exist in DB)
            if (instructor == null) {
                // Try to find ANY user
                List<User> users = userRepository.findAll();
                if (!users.isEmpty()) {
                    instructor = users.get(0);
                } else {
                    // Create a default user if absolutely no users exist
                    User defaultUser = new User();
                    defaultUser.setUsername("teacher");
                    defaultUser.setPassword("password"); // Encoded in real app
                    defaultUser.setEmail("teacher@example.com");
                    defaultUser.setRole(com.antigravity.learningplatform.entity.Role.TEACHER);
                    instructor = userRepository.save(defaultUser);
                }
            }
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
            
            // Get all courses taught by this teacher
            List<Course> courses = courseRepository.findAll().stream()
                    .filter(course -> {
                        boolean isInstructor = course.getInstructor() != null && 
                               course.getInstructor().getId().equals(teacher.getId());
                        System.out.println("DEBUG: Course " + course.getId() + " (" + course.getTitle() + 
                                ") instructor check: " + isInstructor);
                        return isInstructor;
                    })
                    .collect(java.util.stream.Collectors.toList());
            
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
