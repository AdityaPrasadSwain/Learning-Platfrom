package com.antigravity.learningplatform.service;

import com.antigravity.learningplatform.dto.*;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {

    public byte[] generateQuizReport(List<QuizDTO> quizzes) throws FileNotFoundException, JRException {
        File file = ResourceUtils.getFile("classpath:reports/quiz_report.jrxml");
        JasperReport jasperReport = JasperCompileManager.compileReport(file.getAbsolutePath());

        JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(quizzes);
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("createdBy", "Admin");

        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, dataSource);

        return JasperExportManager.exportReportToPdf(jasperPrint);
    }

    public byte[] generateStudentQuizResultReport(QuizAttemptDTO attempt)
            throws FileNotFoundException, JRException {
        File file = ResourceUtils.getFile("classpath:reports/student_quiz_result.jrxml");
        JasperReport jasperReport = JasperCompileManager.compileReport(file.getAbsolutePath());

        JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(attempt.getQuestionResults());
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("studentName", attempt.getStudentName());
        parameters.put("quizTitle", attempt.getQuizTitle());
        parameters.put("score", attempt.getScore());
        parameters.put("totalMarks", attempt.getTotalMarks());
        parameters.put("percentage", attempt.getPercentage());

        String grade;
        double percentage = attempt.getPercentage();
        if (percentage >= 90)
            grade = "A+";
        else if (percentage >= 80)
            grade = "A";
        else if (percentage >= 70)
            grade = "B";
        else if (percentage >= 60)
            grade = "C";
        else if (percentage >= 50)
            grade = "D";
        else
            grade = "F";

        parameters.put("grade", grade);

        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, dataSource);

        return JasperExportManager.exportReportToPdf(jasperPrint);
    }
}
