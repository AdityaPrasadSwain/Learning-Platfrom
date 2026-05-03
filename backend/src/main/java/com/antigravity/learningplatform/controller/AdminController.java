package com.antigravity.learningplatform.controller;

import com.antigravity.learningplatform.dto.DashboardStatsDTO;
import com.antigravity.learningplatform.entity.AuditLog;
import com.antigravity.learningplatform.entity.Course;
import com.antigravity.learningplatform.entity.Role;
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
    public ResponseEntity<?> getPendingApplications() {
        try {
            return ResponseEntity.ok(applicationService.getPendingApplications());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching applications: " + e.getMessage());
        }
    }

    @PostMapping("/applications/{id}/approve")
    public ResponseEntity<?> approveApplication(@PathVariable Long id) {
        try {
            applicationService.approveApplication(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error approving application: " + e.getMessage());
        }
    }

    @PostMapping("/applications/{id}/reject")
    public ResponseEntity<?> rejectApplication(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            String reason = payload.get("reason");
            applicationService.rejectApplication(id, reason);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error rejecting application: " + e.getMessage());
        }
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardStats() {
        try {
            return ResponseEntity.ok(adminService.getDashboardStats());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error fetching dashboard stats: " + e.getMessage());
        }
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) Boolean isSuspended,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        try {
            return ResponseEntity.ok(adminService.getAllUsers(search, role, isSuspended, page, size, sortBy, direction));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching users: " + e.getMessage());
        }
    }

    @PutMapping("/users/{id}/suspend")
    public ResponseEntity<?> suspendUser(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            String reason = payload.get("reason");
            return ResponseEntity.ok(adminService.suspendUser(id, reason));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error suspending user: " + e.getMessage());
        }
    }

    @PutMapping("/users/{id}/activate")
    public ResponseEntity<?> activateUser(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(adminService.activateUser(id));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error activating user: " + e.getMessage());
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            adminService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error deleting user: " + e.getMessage());
        }
    }

    @GetMapping("/courses")
    public ResponseEntity<?> getAllCourses() {
        try {
            return ResponseEntity.ok(adminService.getAllCourses());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching courses: " + e.getMessage());
        }
    }

    @PutMapping("/courses/{id}/approve")
    public ResponseEntity<?> approveCourse(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(adminService.approveCourse(id));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error approving course: " + e.getMessage());
        }
    }

    @PutMapping("/courses/{id}/reject")
    public ResponseEntity<?> rejectCourse(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(adminService.rejectCourse(id));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error rejecting course: " + e.getMessage());
        }
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<?> getAuditLogs() {
        try {
            return ResponseEntity.ok(adminService.getAllAuditLogs());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching audit logs: " + e.getMessage());
        }
    }
}
