package com.antigravity.learningplatform.controller;

import com.antigravity.learningplatform.dto.ClassSessionDTO;
import com.antigravity.learningplatform.service.ClassSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/class")
@RequiredArgsConstructor
public class ClassSessionController {

    private final ClassSessionService classSessionService;
    
    @jakarta.annotation.PostConstruct
    public void init() {
        System.out.println("DEBUG: ClassSessionController initialized and mapped to /api/class");
    }

    /**
     * Teacher starts a live class for a course.
     * Generates a Jitsi meeting link automatically.
     */
    @PostMapping("/start")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> startClass(@RequestBody Map<String, Long> body, Principal principal) {
        System.out.println("DEBUG: startClass request received for course: " + body.get("courseId"));
        try {
            Long courseId = body.get("courseId");
            ClassSessionDTO session = classSessionService.startClass(courseId, principal.getName());
            return ResponseEntity.ok(session);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Teacher ends the live class.
     */
    @PostMapping("/end")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> endClass(@RequestBody Map<String, Long> body, Principal principal) {
        try {
            Long sessionId = body.get("sessionId");
            ClassSessionDTO session = classSessionService.endClass(sessionId, principal.getName());
            return ResponseEntity.ok(session);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Get all sessions for a specific course (teachers, students, admin).
     */
    @GetMapping("/{courseId}")
    @PreAuthorize("hasAnyRole('TEACHER', 'STUDENT', 'ADMIN')")
    public ResponseEntity<List<ClassSessionDTO>> getSessionsByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(classSessionService.getSessionsByCourse(courseId));
    }

    /**
     * Admin: Get all sessions across all courses.
     */
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ClassSessionDTO>> getAllSessions() {
        return ResponseEntity.ok(classSessionService.getAllSessions());
    }

    /**
     * Teacher adds a recording URL after the class ends.
     */
    @PostMapping("/recording/add")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> addRecording(@RequestBody Map<String, Object> body, Principal principal) {
        try {
            Long sessionId = Long.valueOf(body.get("sessionId").toString());
            String recordingUrl = body.get("recordingUrl").toString();
            ClassSessionDTO updated = classSessionService.addRecording(sessionId, recordingUrl, principal.getName());
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Get all sessions with recordings for a specific course.
     */
    @GetMapping("/recording/{courseId}")
    @PreAuthorize("hasAnyRole('TEACHER', 'STUDENT', 'ADMIN')")
    public ResponseEntity<List<ClassSessionDTO>> getRecordingsByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(classSessionService.getRecordingsByCourse(courseId));
    }
}
