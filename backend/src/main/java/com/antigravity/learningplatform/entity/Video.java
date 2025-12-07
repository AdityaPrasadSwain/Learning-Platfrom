package com.antigravity.learningplatform.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "video")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Video {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "duration")
    private String duration;

    @ManyToOne
    @JoinColumn(name = "teacher_id")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler", "password", "authorities" }) // Handle proxy and
                                                                                                // sensitive data
    private User teacher;

    @Column(name = "views")
    @Builder.Default
    private Long views = 0L;

    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;

    @Column(name = "category")
    private String category;

    @Column(name = "cloudinary_url")
    private String cloudinaryUrl;

    @Column(name = "cloudinary_public_id")
    private String cloudinaryPublicId;
}
