import api from './axiosConfig';

// ==================== TEACHER QUIZ API ====================

export const createQuiz = async (quizData) => {
    const response = await api.post('/teacher/quiz', quizData);
    return response.data;
};

export const getTeacherQuizzes = async () => {
    const response = await api.get('/teacher/quiz');
    return response.data;
};

export const getTeacherQuiz = async (quizId) => {
    const response = await api.get(`/teacher/quiz/${quizId}`);
    return response.data;
};

export const updateQuiz = async (quizId, quizData) => {
    const response = await api.put(`/teacher/quiz/${quizId}`, quizData);
    return response.data;
};

export const deleteQuiz = async (quizId) => {
    const response = await api.delete(`/teacher/quiz/${quizId}`);
    return response.data;
};

export const toggleQuizPublish = async (quizId) => {
    const response = await api.post(`/teacher/quiz/${quizId}/publish`);
    return response.data;
};

export const addQuestion = async (quizId, questionData) => {
    const response = await api.post(`/teacher/quiz/${quizId}/question`, questionData);
    return response.data;
};

export const updateQuestion = async (questionId, questionData) => {
    const response = await api.put(`/teacher/quiz/question/${questionId}`, questionData);
    return response.data;
};

export const deleteQuestion = async (questionId) => {
    const response = await api.delete(`/teacher/quiz/question/${questionId}`);
    return response.data;
};

// ==================== STUDENT QUIZ API ====================

export const getAvailableQuizzes = async () => {
    const response = await api.get('/student/quiz');
    return response.data;
};

export const getQuizzesByCourse = async (courseId) => {
    const response = await api.get(`/student/quiz/course/${courseId}`);
    return response.data;
};

export const getStudentQuiz = async (quizId) => {
    const response = await api.get(`/student/quiz/${quizId}`);
    return response.data;
};

export const submitQuiz = async (quizId, answers) => {
    const response = await api.post(`/student/quiz/${quizId}/submit`, { quizId, answers });
    return response.data;
};

export const getMyAttempts = async () => {
    const response = await api.get('/student/quiz/attempts');
    return response.data;
};
