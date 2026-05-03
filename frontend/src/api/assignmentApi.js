import api from './axiosConfig';

export const createAssignment = async (assignmentData) => {
    const response = await api.post('/assignments', assignmentData);
    return response.data;
};

export const getAssignmentsByCourse = async (courseId, studentId = null) => {
    const response = await api.get(`/assignments/course/${courseId}`, {
        params: { studentId }
    });
    return response.data;
};

export const getAssignmentsByTeacher = async (teacherId) => {
    const response = await api.get(`/assignments/teacher/${teacherId}`);
    return response.data;
};

export const getAssignmentById = async (id, studentId = null) => {
    const response = await api.get(`/assignments/${id}`, {
        params: { studentId }
    });
    return response.data;
};

// Submissions
export const submitAssignment = async (submissionData) => {
    const response = await api.post('/submissions', submissionData);
    return response.data;
};

export const gradeSubmission = async (gradeData) => {
    const response = await api.post('/submissions/grade', null, {
        params: gradeData
    });
    return response.data;
};

export const getSubmissionsByAssignment = async (assignmentId) => {
    const response = await api.get(`/submissions/assignment/${assignmentId}`);
    return response.data;
};

export const getStudentSubmission = async (assignmentId, studentId) => {
    const response = await api.get(`/submissions/assignment/${assignmentId}/student/${studentId}`);
    return response.data;
};
