package com.antigravity.learningplatform.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    @Value("${cloudinary.api-key}")
    private String apiKey;

    @Value("${cloudinary.api-secret}")
    private String apiSecret;

    private Cloudinary cloudinary;

    @PostConstruct
    public void init() {
        cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true));
        System.out.println("Cloudinary initialized with cloud_name: " + cloudName);
    }

    /**
     * Upload a video to Cloudinary
     * 
     * @param file the video file to upload
     * @return Map containing upload result with url and public_id
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> uploadVideo(MultipartFile file) throws IOException {
        Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "resource_type", "video",
                "folder", "learning-platform/videos"));
        return uploadResult;
    }

    /**
     * Upload a generic file (e.g. resume) to Cloudinary
     * 
     * @param file the file to upload
     * @return Map containing upload result with url and public_id
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> uploadFile(MultipartFile file) throws IOException {
        Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "resource_type", "auto",
                "folder", "learning-platform/documents"));
        return uploadResult;
    }

    /**
     * Delete a video from Cloudinary
     * 
     * @param publicId the public ID of the video to delete
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> deleteVideo(String publicId) throws IOException {
        return cloudinary.uploader().destroy(publicId, ObjectUtils.asMap(
                "resource_type", "video"));
    }

    /**
     * Get the secure URL for a video
     * 
     * @param publicId the public ID of the video
     * @return the secure URL for the video
     */
    public String getVideoUrl(String publicId) {
        return cloudinary.url()
                .resourceType("video")
                .secure(true)
                .generate(publicId);
    }
}
