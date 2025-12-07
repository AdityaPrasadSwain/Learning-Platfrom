package com.antigravity.learningplatform.service;

import com.antigravity.learningplatform.entity.Video;
import com.antigravity.learningplatform.entity.User;
import com.antigravity.learningplatform.repository.VideoRepository;
import com.antigravity.learningplatform.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class VideoServiceImpl implements VideoService {

    private final VideoRepository videoRepository;
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;

    public VideoServiceImpl(VideoRepository videoRepository,
            UserRepository userRepository,
            CloudinaryService cloudinaryService) {
        this.videoRepository = videoRepository;
        this.userRepository = userRepository;
        this.cloudinaryService = cloudinaryService;
    }

    @Override
    public Video saveVideo(MultipartFile file, String title, String description, Long teacherId) throws IOException {
        // Upload to Cloudinary
        Map<String, Object> uploadResult = cloudinaryService.uploadVideo(file);
        String cloudinaryUrl = (String) uploadResult.get("secure_url");
        String publicId = (String) uploadResult.get("public_id");

        // Get teacher user
        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        Video video = Video.builder()
                .title(title)
                .description(description)
                .fileName(file.getOriginalFilename())
                .fileSize(file.getSize())
                .cloudinaryUrl(cloudinaryUrl)
                .cloudinaryPublicId(publicId)
                .teacher(teacher)
                .uploadedAt(LocalDateTime.now())
                .build();

        return videoRepository.save(video);
    }

    @Override
    public Video getVideoById(Long videoId) {
        return videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found with id: " + videoId));
    }

    @Override
    public Video getVideoByTitle(String title) {
        return videoRepository.findByTitle(title)
                .orElseThrow(() -> new RuntimeException("Video not found with title: " + title));
    }

    @Override
    public List<Video> getAllVideosByTeacher(Long teacherId) {
        return videoRepository.findByTeacher_Id(teacherId);
    }

    @Override
    public void deleteVideo(Long videoId) throws IOException {
        Video video = getVideoById(videoId);

        // Delete from Cloudinary if public ID exists
        if (video.getCloudinaryPublicId() != null) {
            cloudinaryService.deleteVideo(video.getCloudinaryPublicId());
        }

        videoRepository.delete(video);
    }
}
