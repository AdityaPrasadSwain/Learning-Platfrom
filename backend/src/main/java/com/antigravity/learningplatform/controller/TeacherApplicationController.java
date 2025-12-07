package com.antigravity.learningplatform.controller;

import com.antigravity.learningplatform.dto.TeacherApplicationRequest;
import com.antigravity.learningplatform.service.TeacherApplicationService;
import com.antigravity.learningplatform.service.TeacherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teacher")
@RequiredArgsConstructor
public class TeacherApplicationController {

    private final TeacherApplicationService applicationService;
    private final TeacherService teacherService; // Using existing logic from TeacherService/AppService

    @PostMapping("/apply")
    public ResponseEntity<?> applyToTeach(
            @RequestParam("userId") Long userId,
            @RequestParam("experience") String experience,
            @RequestParam("bio") String bio,
            @RequestParam(value = "resume", required = false) org.springframework.web.multipart.MultipartFile resume,
            @RequestParam(value = "resumeUrl", required = false) String resumeUrl) {
        TeacherApplicationRequest request = TeacherApplicationRequest.builder()
                .userId(userId)
                .experience(experience)
                .bio(bio)
                .resumeUrl(resumeUrl)
                .build();

        teacherService.submitApplication(request, resume);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/application-status")
    public ResponseEntity<?> getApplicationStatus(@RequestParam Long userId) {
        return ResponseEntity.ok(teacherService.getApplicationStatus(userId));
    }
}
