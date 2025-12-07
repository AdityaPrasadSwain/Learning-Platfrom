package com.antigravity.learningplatform.service;

import com.antigravity.learningplatform.dto.CourseMaterialDTO;
import com.antigravity.learningplatform.dto.LessonDTO;
import com.antigravity.learningplatform.entity.Course;
import com.antigravity.learningplatform.entity.CourseMaterial;
import com.antigravity.learningplatform.entity.Lesson;
import com.antigravity.learningplatform.repository.CourseMaterialRepository;
import com.antigravity.learningplatform.repository.CourseRepository;
import com.antigravity.learningplatform.repository.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LessonService {

    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;
    private final CourseMaterialRepository courseMaterialRepository;

    private final String UPLOAD_DIR = "uploads/course-materials/";

    @Transactional
    public LessonDTO createLesson(Long courseId, LessonDTO lessonDTO) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Lesson lesson = Lesson.builder()
                .title(lessonDTO.getTitle())
                .content(lessonDTO.getContent())
                .orderIndex(lessonDTO.getOrderIndex())
                .course(course)
                .build();

        Lesson savedLesson = lessonRepository.save(lesson);
        return convertToDTO(savedLesson);
    }

    @Transactional
    public LessonDTO updateLesson(Long lessonId, LessonDTO lessonDTO) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        lesson.setTitle(lessonDTO.getTitle());
        lesson.setContent(lessonDTO.getContent());
        lesson.setOrderIndex(lessonDTO.getOrderIndex());

        Lesson updatedLesson = lessonRepository.save(lesson);
        return convertToDTO(updatedLesson);
    }

    public void deleteLesson(Long lessonId) {
        lessonRepository.deleteById(lessonId);
    }

    public List<LessonDTO> getLessonsByCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        return course.getLessons().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public CourseMaterialDTO uploadMaterial(Long lessonId, MultipartFile file, String description) throws IOException {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

        // Save file
        Path filePath = uploadPath.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Determine file type
        String fileType = determineFileType(file.getContentType());

        // Create material record
        CourseMaterial material = CourseMaterial.builder()
                .lesson(lesson)
                .fileName(originalFilename)
                .fileType(fileType)
                .fileUrl("/uploads/course-materials/" + uniqueFilename)
                .fileSize(file.getSize())
                .description(description)
                .uploadedAt(LocalDateTime.now())
                .build();

        CourseMaterial savedMaterial = courseMaterialRepository.save(material);
        return convertMaterialToDTO(savedMaterial);
    }

    public List<CourseMaterialDTO> getMaterialsByLesson(Long lessonId) {
        return courseMaterialRepository.findByLessonId(lessonId).stream()
                .map(this::convertMaterialToDTO)
                .collect(Collectors.toList());
    }

    public void deleteMaterial(Long materialId) throws IOException {
        CourseMaterial material = courseMaterialRepository.findById(materialId)
                .orElseThrow(() -> new RuntimeException("Material not found"));

        // Delete file from filesystem
        String filename = material.getFileUrl().substring(material.getFileUrl().lastIndexOf("/") + 1);
        Path filePath = Paths.get(UPLOAD_DIR + filename);
        Files.deleteIfExists(filePath);

        courseMaterialRepository.delete(material);
    }

    private String determineFileType(String contentType) {
        if (contentType == null)
            return "DOCUMENT";
        if (contentType.startsWith("video/"))
            return "VIDEO";
        if (contentType.startsWith("image/"))
            return "IMAGE";
        if (contentType.contains("pdf"))
            return "PDF";
        return "DOCUMENT";
    }

    private LessonDTO convertToDTO(Lesson lesson) {
        return LessonDTO.builder()
                .id(lesson.getId())
                .title(lesson.getTitle())
                .content(lesson.getContent())
                .orderIndex(lesson.getOrderIndex())
                .courseId(lesson.getCourse().getId())
                .build();
    }

    private CourseMaterialDTO convertMaterialToDTO(CourseMaterial material) {
        return CourseMaterialDTO.builder()
                .id(material.getId())
                .lessonId(material.getLesson().getId())
                .fileName(material.getFileName())
                .fileType(material.getFileType())
                .fileUrl(material.getFileUrl())
                .fileSize(material.getFileSize())
                .description(material.getDescription())
                .build();
    }
}
