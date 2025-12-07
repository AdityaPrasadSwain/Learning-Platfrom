package com.antigravity.learningplatform.service;

import com.antigravity.learningplatform.dto.*;
import com.antigravity.learningplatform.entity.*;
import com.antigravity.learningplatform.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    // ==================== TEACHER METHODS ====================

    @Transactional
    public QuizDTO createQuiz(QuizDTO quizDTO, Long teacherId) {
        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        Quiz quiz = Quiz.builder()
                .title(quizDTO.getTitle())
                .description(quizDTO.getDescription())
                .createdBy(teacher)
                .isPublished(false)
                .totalMarks(quizDTO.getTotalMarks() != null ? quizDTO.getTotalMarks() : 0)
                .duration(quizDTO.getDuration())
                .build();

        if (quizDTO.getCourseId() != null) {
            Course course = courseRepository.findById(quizDTO.getCourseId())
                    .orElseThrow(() -> new RuntimeException("Course not found"));
            quiz.setCourse(course);
        }

        Quiz savedQuiz = quizRepository.save(quiz);
        return convertToDTO(savedQuiz, false, null);
    }

    @Transactional
    public QuestionDTO addQuestion(Long quizId, QuestionDTO questionDTO, Long teacherId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        if (!quiz.getCreatedBy().getId().equals(teacherId)) {
            throw new RuntimeException("Unauthorized: You can only add questions to your own quizzes");
        }

        Question question = Question.builder()
                .quiz(quiz)
                .questionText(questionDTO.getQuestionText())
                .optionA(questionDTO.getOptionA())
                .optionB(questionDTO.getOptionB())
                .optionC(questionDTO.getOptionC())
                .optionD(questionDTO.getOptionD())
                .correctAnswer(questionDTO.getCorrectAnswer().toUpperCase())
                .imageUrl(questionDTO.getImageUrl())
                .explanation(questionDTO.getExplanation())
                .marks(questionDTO.getMarks() != null ? questionDTO.getMarks() : 1)
                .build();

        Question savedQuestion = questionRepository.save(question);
        updateQuizTotalMarks(quizId);

        return convertQuestionToDTO(savedQuestion, true);
    }

    public List<QuizDTO> getTeacherQuizzes(Long teacherId) {
        List<Quiz> quizzes = quizRepository.findByCreatedById(teacherId);
        return quizzes.stream()
                .map(q -> convertToDTO(q, false, null))
                .collect(Collectors.toList());
    }

    public QuizDTO getQuizById(Long quizId, Long teacherId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        if (!quiz.getCreatedBy().getId().equals(teacherId)) {
            throw new RuntimeException("Unauthorized");
        }

        return convertToDTO(quiz, true, null);
    }

    @Transactional
    public QuizDTO updateQuiz(Long quizId, QuizDTO quizDTO, Long teacherId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        if (!quiz.getCreatedBy().getId().equals(teacherId)) {
            throw new RuntimeException("Unauthorized");
        }

        quiz.setTitle(quizDTO.getTitle());
        quiz.setDescription(quizDTO.getDescription());
        quiz.setDuration(quizDTO.getDuration());

        if (quizDTO.getCourseId() != null) {
            Course course = courseRepository.findById(quizDTO.getCourseId())
                    .orElseThrow(() -> new RuntimeException("Course not found"));
            quiz.setCourse(course);
        }

        Quiz savedQuiz = quizRepository.save(quiz);
        return convertToDTO(savedQuiz, true, null);
    }

    @Transactional
    public void deleteQuiz(Long quizId, Long teacherId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        if (!quiz.getCreatedBy().getId().equals(teacherId)) {
            throw new RuntimeException("Unauthorized");
        }

        quizRepository.delete(quiz);
    }

    @Transactional
    public QuizDTO togglePublish(Long quizId, Long teacherId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        if (!quiz.getCreatedBy().getId().equals(teacherId)) {
            throw new RuntimeException("Unauthorized");
        }

        quiz.setIsPublished(!quiz.getIsPublished());
        Quiz savedQuiz = quizRepository.save(quiz);
        return convertToDTO(savedQuiz, false, null);
    }

    @Transactional
    public QuestionDTO updateQuestion(Long questionId, QuestionDTO questionDTO, Long teacherId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        if (!question.getQuiz().getCreatedBy().getId().equals(teacherId)) {
            throw new RuntimeException("Unauthorized");
        }

        question.setQuestionText(questionDTO.getQuestionText());
        question.setOptionA(questionDTO.getOptionA());
        question.setOptionB(questionDTO.getOptionB());
        question.setOptionC(questionDTO.getOptionC());
        question.setOptionD(questionDTO.getOptionD());
        question.setCorrectAnswer(questionDTO.getCorrectAnswer().toUpperCase());
        question.setImageUrl(questionDTO.getImageUrl());
        question.setExplanation(questionDTO.getExplanation());
        question.setMarks(questionDTO.getMarks());

        Question savedQuestion = questionRepository.save(question);
        updateQuizTotalMarks(question.getQuiz().getId());

        return convertQuestionToDTO(savedQuestion, true);
    }

    @Transactional
    public void deleteQuestion(Long questionId, Long teacherId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        if (!question.getQuiz().getCreatedBy().getId().equals(teacherId)) {
            throw new RuntimeException("Unauthorized");
        }

        Long quizId = question.getQuiz().getId();
        questionRepository.delete(question);
        updateQuizTotalMarks(quizId);
    }

    // ==================== STUDENT METHODS ====================

    public List<QuizDTO> getPublishedQuizzes(Long studentId) {
        List<Quiz> quizzes = quizRepository.findByIsPublishedTrue();
        return quizzes.stream()
                .map(q -> convertToDTO(q, false, studentId))
                .collect(Collectors.toList());
    }

    public List<QuizDTO> getQuizzesByCourse(Long courseId, Long studentId) {
        List<Quiz> quizzes = quizRepository.findByCourseIdAndIsPublishedTrue(courseId);
        return quizzes.stream()
                .map(q -> convertToDTO(q, false, studentId))
                .collect(Collectors.toList());
    }

    public QuizDTO getQuizForStudent(Long quizId, Long studentId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        if (!quiz.getIsPublished()) {
            throw new RuntimeException("Quiz is not available");
        }

        // Return quiz with questions but without correct answers
        QuizDTO dto = convertToDTO(quiz, true, studentId);
        if (dto.getQuestions() != null) {
            dto.getQuestions().forEach(q -> {
                q.setCorrectAnswer(null);
                q.setExplanation(null);
            });
        }
        return dto;
    }

    @Transactional
    public QuizAttemptDTO submitQuiz(Long quizId, QuizSubmissionDTO submission, Long studentId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<Question> questions = questionRepository.findByQuizId(quizId);

        int score = 0;
        int correctCount = 0;
        List<QuestionResultDTO> results = new ArrayList<>();

        for (Question question : questions) {
            String selectedAnswer = submission.getAnswers().get(question.getId());
            boolean isCorrect = question.getCorrectAnswer().equalsIgnoreCase(selectedAnswer);

            if (isCorrect) {
                score += question.getMarks();
                correctCount++;
            }

            results.add(QuestionResultDTO.builder()
                    .questionId(question.getId())
                    .questionText(question.getQuestionText())
                    .optionA(question.getOptionA())
                    .optionB(question.getOptionB())
                    .optionC(question.getOptionC())
                    .optionD(question.getOptionD())
                    .selectedAnswer(selectedAnswer)
                    .correctAnswer(question.getCorrectAnswer())
                    .isCorrect(isCorrect)
                    .explanation(question.getExplanation())
                    .marks(question.getMarks())
                    .build());
        }

        QuizAttempt attempt = QuizAttempt.builder()
                .student(student)
                .quiz(quiz)
                .score(score)
                .totalMarks(quiz.getTotalMarks())
                .correctAnswers(correctCount)
                .totalQuestions(questions.size())
                .answers(submission.getAnswers())
                .submittedAt(LocalDateTime.now())
                .isCompleted(true)
                .build();

        QuizAttempt savedAttempt = quizAttemptRepository.save(attempt);

        return QuizAttemptDTO.builder()
                .id(savedAttempt.getId())
                .studentId(studentId)
                .studentName(student.getFirstName() + " " + student.getLastName())
                .quizId(quizId)
                .quizTitle(quiz.getTitle())
                .score(score)
                .totalMarks(quiz.getTotalMarks())
                .correctAnswers(correctCount)
                .totalQuestions(questions.size())
                .percentage(quiz.getTotalMarks() > 0 ? (score * 100.0 / quiz.getTotalMarks()) : 0)
                .answers(submission.getAnswers())
                .startedAt(savedAttempt.getStartedAt())
                .submittedAt(savedAttempt.getSubmittedAt())
                .isCompleted(true)
                .questionResults(results)
                .build();
    }

    public List<QuizAttemptDTO> getStudentAttempts(Long studentId) {
        List<QuizAttempt> attempts = quizAttemptRepository.findByStudentIdAndIsCompletedTrue(studentId);
        return attempts.stream()
                .map(this::convertAttemptToDTO)
                .collect(Collectors.toList());
    }

    public QuizAttemptDTO getStudentQuizResult(Long quizId, String username) {
        User student = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Find the latest completed attempt for this quiz
        List<QuizAttempt> attempts = quizAttemptRepository.findByStudentIdAndQuizId(student.getId(), quizId);

        QuizAttempt latestAttempt = attempts.stream()
                .filter(QuizAttempt::getIsCompleted)
                .max(Comparator.comparing(QuizAttempt::getSubmittedAt))
                .orElseThrow(() -> new RuntimeException("No completed attempt found for this quiz"));

        QuizAttemptDTO dto = convertAttemptToDTO(latestAttempt);

        // Populate question results with details
        List<Question> questions = questionRepository.findByQuizId(quizId);
        Map<Long, Question> questionMap = questions.stream()
                .collect(Collectors.toMap(Question::getId, q -> q));

        List<QuestionResultDTO> questionResults = new ArrayList<>();
        Map<Long, String> answers = latestAttempt.getAnswers();

        for (Map.Entry<Long, String> entry : answers.entrySet()) {
            Long questionId = entry.getKey();
            String selectedAnswer = entry.getValue();
            Question question = questionMap.get(questionId);

            if (question != null) {
                boolean isCorrect = question.getCorrectAnswer().equalsIgnoreCase(selectedAnswer);

                questionResults.add(QuestionResultDTO.builder()
                        .questionId(question.getId())
                        .questionText(question.getQuestionText())
                        .optionA(question.getOptionA())
                        .optionB(question.getOptionB())
                        .optionC(question.getOptionC())
                        .optionD(question.getOptionD())
                        .selectedAnswer(selectedAnswer)
                        .correctAnswer(question.getCorrectAnswer())
                        .isCorrect(isCorrect)
                        .explanation(question.getExplanation())
                        .marks(question.getMarks())
                        .build());
            }
        }

        dto.setQuestionResults(questionResults);
        return dto;
    }

    // ==================== HELPER METHODS ====================

    private void updateQuizTotalMarks(Long quizId) {
        List<Question> questions = questionRepository.findByQuizId(quizId);
        int totalMarks = questions.stream().mapToInt(Question::getMarks).sum();

        Quiz quiz = quizRepository.findById(quizId).orElseThrow();
        quiz.setTotalMarks(totalMarks);
        quizRepository.save(quiz);
    }

    private QuizDTO convertToDTO(Quiz quiz, boolean includeQuestions, Long studentId) {
        QuizDTO dto = QuizDTO.builder()
                .id(quiz.getId())
                .title(quiz.getTitle())
                .description(quiz.getDescription())
                .courseId(quiz.getCourse() != null ? quiz.getCourse().getId() : null)
                .courseName(quiz.getCourse() != null ? quiz.getCourse().getTitle() : null)
                .createdById(quiz.getCreatedBy().getId())
                .createdByName(quiz.getCreatedBy().getFirstName() + " " + quiz.getCreatedBy().getLastName())
                .isPublished(quiz.getIsPublished())
                .totalMarks(quiz.getTotalMarks())
                .duration(quiz.getDuration())
                .questionCount(questionRepository.countByQuizId(quiz.getId()))
                .createdAt(quiz.getCreatedAt())
                .updatedAt(quiz.getUpdatedAt())
                .build();

        if (includeQuestions && quiz.getQuestions() != null) {
            dto.setQuestions(quiz.getQuestions().stream()
                    .map(q -> convertQuestionToDTO(q, studentId == null))
                    .collect(Collectors.toList()));
        }

        if (studentId != null) {
            List<QuizAttempt> attempts = quizAttemptRepository.findByStudentIdAndQuizId(studentId, quiz.getId());
            dto.setHasAttempted(!attempts.isEmpty());
            if (!attempts.isEmpty()) {
                dto.setBestScore(attempts.stream()
                        .mapToInt(QuizAttempt::getScore)
                        .max()
                        .orElse(0));
            }
        }

        return dto;
    }

    private QuestionDTO convertQuestionToDTO(Question question, boolean includeAnswer) {
        return QuestionDTO.builder()
                .id(question.getId())
                .quizId(question.getQuiz().getId())
                .questionText(question.getQuestionText())
                .optionA(question.getOptionA())
                .optionB(question.getOptionB())
                .optionC(question.getOptionC())
                .optionD(question.getOptionD())
                .correctAnswer(includeAnswer ? question.getCorrectAnswer() : null)
                .imageUrl(question.getImageUrl())
                .explanation(includeAnswer ? question.getExplanation() : null)
                .marks(question.getMarks())
                .build();
    }

    private QuizAttemptDTO convertAttemptToDTO(QuizAttempt attempt) {
        return QuizAttemptDTO.builder()
                .id(attempt.getId())
                .studentId(attempt.getStudent().getId())
                .studentName(attempt.getStudent().getFirstName() + " " + attempt.getStudent().getLastName())
                .quizId(attempt.getQuiz().getId())
                .quizTitle(attempt.getQuiz().getTitle())
                .score(attempt.getScore())
                .totalMarks(attempt.getTotalMarks())
                .correctAnswers(attempt.getCorrectAnswers())
                .totalQuestions(attempt.getTotalQuestions())
                .percentage(attempt.getTotalMarks() > 0 ? (attempt.getScore() * 100.0 / attempt.getTotalMarks()) : 0)
                .startedAt(attempt.getStartedAt())
                .submittedAt(attempt.getSubmittedAt())
                .isCompleted(attempt.getIsCompleted())
                .build();
    }

    // ==================== ADMIN METHODS ====================

    public List<QuizDTO> getAllQuizzes() {
        List<Quiz> quizzes = quizRepository.findAll();
        return quizzes.stream()
                .map(q -> convertToDTO(q, false, null))
                .collect(Collectors.toList());
    }

    public QuizDTO getQuizDetailsForAdmin(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
        return convertToDTO(quiz, true, null);
    }

    public List<QuizAttemptDTO> getQuizAttempts(Long quizId) {
        List<QuizAttempt> attempts = quizAttemptRepository.findByQuizId(quizId);
        return attempts.stream()
                .map(this::convertAttemptToDTO)
                .collect(Collectors.toList());
    }

    public List<QuizAttemptDTO> getAllQuizAttempts() {
        List<QuizAttempt> attempts = quizAttemptRepository.findAll();
        return attempts.stream()
                .map(this::convertAttemptToDTO)
                .collect(Collectors.toList());
    }

    public Map<String, Object> getQuizStatistics() {
        long totalQuizzes = quizRepository.count();
        long publishedQuizzes = quizRepository.findByIsPublishedTrue().size();
        long totalAttempts = quizAttemptRepository.count();

        List<QuizAttempt> completedAttempts = quizAttemptRepository.findAll().stream()
                .filter(QuizAttempt::getIsCompleted)
                .collect(Collectors.toList());

        double averageScore = completedAttempts.isEmpty() ? 0.0
                : completedAttempts.stream()
                        .filter(a -> a.getTotalMarks() > 0)
                        .mapToDouble(a -> (a.getScore() * 100.0) / a.getTotalMarks())
                        .average()
                        .orElse(0.0);

        return Map.of(
                "totalQuizzes", totalQuizzes,
                "publishedQuizzes", publishedQuizzes,
                "unpublishedQuizzes", totalQuizzes - publishedQuizzes,
                "totalAttempts", totalAttempts,
                "averageScore", Math.round(averageScore * 100.0) / 100.0);
    }

    @Transactional
    public void deleteQuizByAdmin(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
        quizRepository.delete(quiz);
    }

    @Transactional
    public QuizDTO togglePublishByAdmin(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
        quiz.setIsPublished(!quiz.getIsPublished());
        Quiz savedQuiz = quizRepository.save(quiz);
        return convertToDTO(savedQuiz, false, null);
    }
}
