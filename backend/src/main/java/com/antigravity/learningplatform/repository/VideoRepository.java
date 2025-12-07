package com.antigravity.learningplatform.repository;

import com.antigravity.learningplatform.entity.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VideoRepository extends JpaRepository<Video, Long> {

    Optional<Video> findByTitle(String title);

    List<Video> findByFileName(String fileName);

    List<Video> findByTeacher_Id(Long teacherId);

    List<Video> findAllByOrderByUploadedAtDesc();

}
