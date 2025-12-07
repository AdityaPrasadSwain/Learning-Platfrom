package com.antigravity.learningplatform.repository;

import com.antigravity.learningplatform.entity.TeacherApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TeacherApplicationRepository extends JpaRepository<TeacherApplication, Long> {
    List<TeacherApplication> findByStatus(TeacherApplication.ApplicationStatus status);

    Optional<TeacherApplication> findByUser_Id(Long userId);
}
