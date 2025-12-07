package com.antigravity.learningplatform.controller;

import com.antigravity.learningplatform.dto.DashboardStatsDTO;
import com.antigravity.learningplatform.entity.AuditLog;
import com.antigravity.learningplatform.entity.Course;
import com.antigravity.learningplatform.entity.User;
import com.antigravity.learningplatform.service.AdminService;
import com.antigravity.learningplatform.service.TeacherApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final TeacherApplicationService applicationService;

    @GetMapping("/applications")
    public ResponseEntity<List<com.antigravity.learningplatform.entity.TeacherApplication>> getPendingApplications() {
        return ResponseEntity.ok(applicationService.getPendingApplications());
    }

    @PostMapping("/applications/{id}/approve")
    public ResponseEntity<Void> approveApplication(@PathVariable Long id) {
        applicationService.approveApplication(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/applications/{id}/reject")
    public ResponseEntity<Void> rejectApplication(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String reason = payload.get("reason");
        applicationService.rejectApplication(id, reason);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{id}/suspend")
    public ResponseEntity<User> suspendUser(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String reason = payload.get("reason");
        return ResponseEntity.ok(adminService.suspendUser(id, reason));
    }

    @PutMapping("/users/{id}/activate")
    public ResponseEntity<User> activateUser(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.activateUser(id));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/courses")
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(adminService.getAllCourses());
    }

    @PutMapping("/courses/{id}/approve")
    public ResponseEntity<Course> approveCourse(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.approveCourse(id));
    }

    @PutMapping("/courses/{id}/reject")
    public ResponseEntity<Course> rejectCourse(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.rejectCourse(id));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        return ResponseEntity.ok(adminService.getAllAuditLogs());
    }
}
