package com.antigravity.learningplatform.controller;

import com.antigravity.learningplatform.entity.Video;
import com.antigravity.learningplatform.repository.VideoRepository;
import com.antigravity.learningplatform.repository.UserRepository;
import com.antigravity.learningplatform.service.CloudinaryService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/teacher/videos")
@CrossOrigin(origins = "*")
public class VideoController {

    private final VideoRepository videoRepository;
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;

    public VideoController(VideoRepository videoRepository,
            UserRepository userRepository,
            CloudinaryService cloudinaryService) {
        this.videoRepository = videoRepository;
        this.userRepository = userRepository;
        this.cloudinaryService = cloudinaryService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadVideo(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "teacherId", required = false) String teacherId) {

        System.out.println("Received upload request: " + title);
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Please select a file to upload");
            }

            // Upload to Cloudinary
            System.out.println("Uploading video to Cloudinary...");
            Map<String, Object> uploadResult = cloudinaryService.uploadVideo(file);

            String cloudinaryUrl = (String) uploadResult.get("secure_url");
            String publicId = (String) uploadResult.get("public_id");

            System.out.println("Video uploaded to Cloudinary: " + cloudinaryUrl);

            // Save metadata to database
            Video video = Video.builder()
                    .title(title)
                    .description(description)
                    .fileName(file.getOriginalFilename())
                    .fileSize(file.getSize())
                    .cloudinaryUrl(cloudinaryUrl)
                    .cloudinaryPublicId(publicId)
                    .uploadedAt(LocalDateTime.now())
                    .category("General")
                    .build();

            if (teacherId != null) {
                try {
                    Long id = Long.parseLong(teacherId);
                    userRepository.findById(id).ifPresent(video::setTeacher);
                } catch (NumberFormatException e) {
                    userRepository.findByUsername(teacherId).ifPresent(video::setTeacher);
                }
            }

            Video savedVideo = videoRepository.save(video);
            System.out.println("Video metadata saved with ID: " + savedVideo.getId());

            // Return video info including Cloudinary URL
            return ResponseEntity.ok(Map.of(
                    "id", savedVideo.getId(),
                    "fileName", savedVideo.getFileName(),
                    "cloudinaryUrl", cloudinaryUrl,
                    "title", title));
        } catch (IOException ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload video: " + ex.getMessage());
        }
    }

    @GetMapping("/stream/{fileName:.+}")
    public ResponseEntity<?> getVideoUrl(@PathVariable String fileName) {
        // Find video by fileName and return Cloudinary URL
        var videos = videoRepository.findByFileName(fileName);
        if (videos.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        var video = videos.get(0);
        if (video.getCloudinaryUrl() != null) {
            return ResponseEntity.ok(Map.of("url", video.getCloudinaryUrl()));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/details/{identifier:.+}")
    public ResponseEntity<?> getVideoDetails(@PathVariable String identifier) {
        try {
            Long id = Long.parseLong(identifier);
            return videoRepository.findById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (NumberFormatException e) {
            // Try finding by filename if not an ID
            var videos = videoRepository.findByFileName(identifier);
            return videos.isEmpty() ? ResponseEntity.notFound().build() : ResponseEntity.ok(videos.get(0));
        }
    }

    @GetMapping("/instructor/{teacherId}")
    public ResponseEntity<?> getTeacherVideos(@PathVariable String teacherId) {
        try {
            Long id = Long.parseLong(teacherId);
            return ResponseEntity.ok(videoRepository.findByTeacher_Id(id));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid teacher ID");
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Video>> getAllVideos() {
        return ResponseEntity.ok(videoRepository.findAll());
    }

    @DeleteMapping("/video/{videoId}")
    public ResponseEntity<Void> deleteVideo(@PathVariable Long videoId) {
        try {
            return videoRepository.findById(videoId).map(video -> {
                try {
                    // Delete from Cloudinary if public ID exists
                    if (video.getCloudinaryPublicId() != null) {
                        cloudinaryService.deleteVideo(video.getCloudinaryPublicId());
                        System.out.println("Deleted video from Cloudinary: " + video.getCloudinaryPublicId());
                    }
                    videoRepository.delete(video);
                    return ResponseEntity.noContent().<Void>build();
                } catch (IOException ex) {
                    ex.printStackTrace();
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).<Void>build();
                }
            }).orElse(ResponseEntity.notFound().build());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
