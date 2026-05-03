package com.antigravity.learningplatform.controller;

import com.antigravity.learningplatform.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    /**
     * Student tracks join time when entering a live Jitsi class.
     */
    @PostMapping("/track/join")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> trackJoin(@RequestBody Map<String, Long> body, Principal principal) {
        try {
            Long sessionId = body.get("sessionId");
            attendanceService.trackJoin(sessionId, principal.getName());
            return ResponseEntity.ok("Join time recorded.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Student tracks leave time when leaving the Jitsi class.
     */
    @PostMapping("/track/leave")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> trackLeave(@RequestBody Map<String, Long> body, Principal principal) {
        try {
            Long sessionId = body.get("sessionId");
            attendanceService.trackLeave(sessionId, principal.getName());
            return ResponseEntity.ok("Leave time recorded and attendance calculated.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Student/Teacher/Admin views attendance history for a student.
     */
    @GetMapping("/student/{username}")
    @PreAuthorize("hasAnyRole('STUDENT', 'TEACHER', 'ADMIN')")
    public ResponseEntity<?> getStudentAttendance(@PathVariable String username) {
        try {
            return ResponseEntity.ok(attendanceService.getStudentAttendance(username));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Teacher/Admin views all attendance records for a session.
     */
    @GetMapping("/session/{sessionId}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<?> getSessionAttendance(@PathVariable Long sessionId) {
        try {
            return ResponseEntity.ok(attendanceService.getSessionAttendance(sessionId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
