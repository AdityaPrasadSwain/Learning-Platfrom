package com.antigravity.learningplatform.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class CourseMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "lesson_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Lesson lesson;

    @ManyToOne
    @JoinColumn(name = "course_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Course course;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String fileType; // PDF, VIDEO, IMAGE, DOCUMENT

    @Column(nullable = false)
    private String fileUrl; // Path or URL to the file

    private Long fileSize; // in bytes

    private LocalDateTime uploadedAt;

    private String description;
}
