package com.antigravity.learningplatform.service;

import com.antigravity.learningplatform.dto.ClassSessionDTO;
import com.antigravity.learningplatform.entity.*;
import com.antigravity.learningplatform.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClassSessionService {

    private final ClassSessionRepository classSessionRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final AttendanceRepository attendanceRepository;

    @Transactional
    public ClassSessionDTO startClass(Long courseId, String teacherUsername) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        User teacher = userRepository.findByUsername(teacherUsername)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        // If no instructor is assigned, the teacher who starts the class claims the course
        if (course.getInstructor() == null) {
            System.out.println("DEBUG: Assigning teacher " + teacherUsername + " as instructor for course: " + course.getTitle());
            course.setInstructor(teacher);
            courseRepository.save(course);
        } else if (!course.getInstructor().getId().equals(teacher.getId())) {
            // For development/flexibility, allow ANY teacher to start a session but log a warning
            System.out.println("DEBUG: Warning: Teacher " + teacherUsername + " is starting a class for a course owned by instructor " + course.getInstructor().getUsername());
        }

        // Check if there's already a live session for this course
        boolean hasLiveSession = classSessionRepository.findByCourseId(courseId).stream()
                .anyMatch(s -> s.getStatus() == SessionStatus.LIVE);
        if (hasLiveSession) {
            throw new RuntimeException("A live class session is already running for this course.");
        }

        // Generate a unique Jitsi meeting link
        String roomId = "LMS-Course" + courseId + "-" + System.currentTimeMillis();
        String meetingLink = "https://meet.jit.si/" + roomId;

        ClassSession session = ClassSession.builder()
                .course(course)
                .teacher(teacher)
                .meetingLink(meetingLink)
                .startTime(LocalDateTime.now())
                .status(SessionStatus.LIVE)
                .build();

        ClassSession saved = classSessionRepository.save(session);
        return toDTO(saved);
    }

    @Transactional
    public ClassSessionDTO endClass(Long sessionId, String teacherUsername) {
        ClassSession session = classSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        User teacher = userRepository.findByUsername(teacherUsername)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        if (!session.getTeacher().getId().equals(teacher.getId())) {
            throw new RuntimeException("You are not authorized to end this session.");
        }

        if (session.getStatus() != SessionStatus.LIVE) {
            throw new RuntimeException("This session is not currently live.");
        }

        session.setEndTime(LocalDateTime.now());
        session.setStatus(SessionStatus.COMPLETED);
        return toDTO(classSessionRepository.save(session));
    }

    public List<ClassSessionDTO> getSessionsByCourse(Long courseId) {
        return classSessionRepository.findByCourseIdOrderByStartTimeDesc(courseId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<ClassSessionDTO> getAllSessions() {
        return classSessionRepository.findAll().stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public ClassSessionDTO addRecording(Long sessionId, String recordingUrl, String teacherUsername) {
        ClassSession session = classSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        User teacher = userRepository.findByUsername(teacherUsername)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        if (!session.getTeacher().getId().equals(teacher.getId())) {
            throw new RuntimeException("You are not authorized to add recording to this session.");
        }

        session.setRecordingUrl(recordingUrl);
        return toDTO(classSessionRepository.save(session));
    }

    public List<ClassSessionDTO> getRecordingsByCourse(Long courseId) {
        return classSessionRepository.findByCourseIdOrderByStartTimeDesc(courseId)
                .stream()
                .filter(s -> s.getRecordingUrl() != null && !s.getRecordingUrl().isBlank())
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private ClassSessionDTO toDTO(ClassSession s) {
        return ClassSessionDTO.builder()
                .id(s.getId())
                .courseId(s.getCourse().getId())
                .courseName(s.getCourse().getTitle())
                .teacherId(s.getTeacher().getId())
                .teacherName(s.getTeacher().getUsername())
                .meetingLink(s.getMeetingLink())
                .startTime(s.getStartTime())
                .endTime(s.getEndTime())
                .status(s.getStatus())
                .recordingUrl(s.getRecordingUrl())
                .attendanceCount(attendanceRepository.countBySessionId(s.getId()))
                .build();
    }
}
