package com.antigravity.learningplatform.service;

import com.antigravity.learningplatform.entity.*;
import com.antigravity.learningplatform.repository.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final ClassSessionRepository classSessionRepository;
    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

    /**
     * Called when a student joins a live class (tracks joinTime)
     */
    @Transactional
    public void trackJoin(Long sessionId, String studentUsername) {
        ClassSession session = classSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (session.getStatus() != SessionStatus.LIVE) {
            throw new RuntimeException("No live session is currently active.");
        }

        User student = userRepository.findByUsername(studentUsername)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // Ensure student is enrolled
        enrollmentRepository.findByStudentIdAndCourseId(student.getId(), session.getCourse().getId())
                .orElseThrow(() -> new RuntimeException("You are not enrolled in this course."));

        // Prevent duplicate join record for same session
        boolean alreadyJoined = attendanceRepository.findBySessionId(sessionId).stream()
                .anyMatch(a -> a.getStudent().getId().equals(student.getId()));
        if (alreadyJoined) return;

        Attendance attendance = Attendance.builder()
                .session(session)
                .student(student)
                .joinTime(LocalDateTime.now())
                .status("PRESENT")
                .build();

        attendanceRepository.save(attendance);
    }

    /**
     * Called when a student leaves (tracks leaveTime and auto-calculates status)
     */
    @Transactional
    public void trackLeave(Long sessionId, String studentUsername) {
        ClassSession session = classSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        User student = userRepository.findByUsername(studentUsername)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Attendance attendance = attendanceRepository.findBySessionId(sessionId).stream()
                .filter(a -> a.getStudent().getId().equals(student.getId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No join record found for this student in this session."));

        attendance.setLeaveTime(LocalDateTime.now());

        // Auto-calculate: if joined within 15 minutes of start = PRESENT, else LATE
        long joinOffsetMinutes = java.time.Duration.between(session.getStartTime(), attendance.getJoinTime()).toMinutes();
        if (joinOffsetMinutes > 15) {
            attendance.setStatus("LATE");
        } else {
            attendance.setStatus("PRESENT");
        }

        attendanceRepository.save(attendance);
    }

    /**
     * Get full attendance summary for a student across all sessions
     */
    public StudentAttendanceSummary getStudentAttendance(String studentUsername) {
        User student = userRepository.findByUsername(studentUsername)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<Attendance> records = attendanceRepository.findByStudentId(student.getId());

        long totalSessions = records.size();
        long presentCount = records.stream()
                .filter(a -> "PRESENT".equals(a.getStatus()) || "LATE".equals(a.getStatus()))
                .count();
        double percentage = totalSessions == 0 ? 0 : ((double) presentCount / totalSessions) * 100;

        List<AttendanceRecordDTO> history = records.stream().map(a -> {
            ClassSession s = a.getSession();
            return new AttendanceRecordDTO(
                    s.getId(),
                    s.getCourse().getTitle(),
                    s.getStartTime(),
                    a.getJoinTime(),
                    a.getLeaveTime(),
                    a.getStatus()
            );
        }).collect(Collectors.toList());

        return new StudentAttendanceSummary(student.getId(), student.getUsername(), totalSessions, presentCount, percentage, history);
    }

    /**
     * Get all attendance records for a specific session (for teacher/admin)
     */
    public List<Map<String, Object>> getSessionAttendance(Long sessionId) {
        List<Attendance> records = attendanceRepository.findBySessionId(sessionId);
        return records.stream().map(a -> Map.<String, Object>of(
                "studentId", a.getStudent().getId(),
                "studentName", a.getStudent().getUsername(),
                "joinTime", a.getJoinTime() != null ? a.getJoinTime().toString() : null,
                "leaveTime", a.getLeaveTime() != null ? a.getLeaveTime().toString() : null,
                "status", a.getStatus()
        )).collect(Collectors.toList());
    }

    // ---- DTOs & Result classes ----

    @Data
    @AllArgsConstructor
    public static class StudentAttendanceSummary {
        private Long studentId;
        private String studentName;
        private long totalSessions;
        private long presentCount;
        private double percentage;
        private List<AttendanceRecordDTO> history;
    }

    @Data
    @AllArgsConstructor
    public static class AttendanceRecordDTO {
        private Long sessionId;
        private String courseName;
        private LocalDateTime sessionStartTime;
        private LocalDateTime joinTime;
        private LocalDateTime leaveTime;
        private String status;
    }
}
