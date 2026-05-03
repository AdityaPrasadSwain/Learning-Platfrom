import api from './api';

export const startClassSession = async (courseId) => {
    const response = await api.post('/class/start', { courseId });
    return response.data;
};

export const endClassSession = async (sessionId) => {
    const response = await api.post('/class/end', { sessionId });
    return response.data;
};

export const getSessionsByCourse = async (courseId) => {
    const response = await api.get(`/class/${courseId}`);
    return response.data;
};

export const getAllSessions = async () => {
    const response = await api.get('/class/all');
    return response.data;
};

export const addRecording = async (sessionId, recordingUrl) => {
    const response = await api.post('/class/recording/add', { sessionId, recordingUrl });
    return response.data;
};

export const getRecordingsByCourse = async (courseId) => {
    const response = await api.get(`/class/recording/${courseId}`);
    return response.data;
};

export const trackJoin = async (sessionId) => {
    const response = await api.post('/attendance/track/join', { sessionId });
    return response.data;
};

export const trackLeave = async (sessionId) => {
    const response = await api.post('/attendance/track/leave', { sessionId });
    return response.data;
};

export const getStudentAttendance = async (username) => {
    const response = await api.get(`/attendance/student/${username}`);
    return response.data;
};

export const getSessionAttendance = async (sessionId) => {
    const response = await api.get(`/attendance/session/${sessionId}`);
    return response.data;
};
