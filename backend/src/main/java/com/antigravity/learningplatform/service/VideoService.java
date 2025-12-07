package com.antigravity.learningplatform.service;

import com.antigravity.learningplatform.entity.Video;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface VideoService {
    Video saveVideo(MultipartFile file, String title, String description, Long teacherId) throws IOException;

    Video getVideoById(Long videoId);

    Video getVideoByTitle(String title);

    List<Video> getAllVideosByTeacher(Long teacherId);

    void deleteVideo(Long videoId) throws IOException;
}
