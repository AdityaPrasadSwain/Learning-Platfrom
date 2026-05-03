import api from './axiosConfig';

export const startOrGetSession = async (courseId) => {
    const response = await api.post(`/attendance/course/${courseId}/start`);
    return response.data;
};

export const markAttendance = async (sessionId, attendanceList) => {
    const response = await api.post(`/attendance/session/${sessionId}/mark`, attendanceList);
    return response.data;
};

export const getStudentAttendance = async (courseId, studentId) => {
    const response = await api.get(`/attendance/course/${courseId}/student/${studentId}`);
    return response.data;
};
