package com.antigravity.learningplatform.service;

import com.antigravity.learningplatform.entity.TeacherApplication;
import com.antigravity.learningplatform.entity.User;
import com.antigravity.learningplatform.repository.TeacherApplicationRepository;
import com.antigravity.learningplatform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TeacherApplicationService {

    private final TeacherApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public TeacherApplication submitApplication(Long userId, String resumeUrl, String experience, String bio) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getIsApproved()) {
            throw new RuntimeException("User is already approved.");
        }

        TeacherApplication app = TeacherApplication.builder()
                .user(user)
                .resumeUrl(resumeUrl)
                .experience(experience)
                .bio(bio)
                .status(TeacherApplication.ApplicationStatus.PENDING)
                .submittedAt(LocalDateTime.now())
                .build();

        return applicationRepository.save(app);
    }

    public List<TeacherApplication> getPendingApplications() {
        return applicationRepository.findByStatus(TeacherApplication.ApplicationStatus.PENDING);
    }

    public void approveApplication(Long applicationId) {
        TeacherApplication app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        User user = app.getUser();
        user.setIsApproved(true);
        userRepository.save(user);

        app.setStatus(TeacherApplication.ApplicationStatus.APPROVED);
        applicationRepository.save(app);
    }

    public void rejectApplication(Long applicationId, String reason) {
        TeacherApplication app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        app.setStatus(TeacherApplication.ApplicationStatus.REJECTED);
        app.setRejectionReason(reason);
        applicationRepository.save(app);
    }
}
