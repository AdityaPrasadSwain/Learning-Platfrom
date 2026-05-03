package com.antigravity.learningplatform.repository;

import com.antigravity.learningplatform.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findBySessionId(Long sessionId);
    List<Attendance> findByStudentId(Long studentId);
    List<Attendance> findBySessionCourseIdAndStudentId(Long courseId, Long studentId);
    int countBySessionId(Long sessionId);
}
