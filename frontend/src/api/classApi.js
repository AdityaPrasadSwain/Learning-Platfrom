import api from './axiosConfig';

// ---- Class Session APIs ----

export const startClass = (courseId) =>
    api.post('/class/start', { courseId }).then(r => r.data);

export const endClass = (sessionId) =>
    api.post('/class/end', { sessionId }).then(r => r.data);

export const getSessionsByCourse = (courseId) =>
    api.get(`/class/${courseId}`).then(r => r.data);

export const getAllSessions = () =>
    api.get('/class/all').then(r => r.data);

export const addRecording = (sessionId, recordingUrl) =>
    api.post('/class/recording/add', { sessionId, recordingUrl }).then(r => r.data);

export const getRecordingsByCourse = (courseId) =>
    api.get(`/class/recording/${courseId}`).then(r => r.data);

// ---- Attendance APIs ----

export const trackJoin = (sessionId) =>
    api.post('/attendance/track/join', { sessionId }).then(r => r.data);

export const trackLeave = (sessionId) =>
    api.post('/attendance/track/leave', { sessionId }).then(r => r.data);

export const getStudentAttendance = (username) =>
    api.get(`/attendance/student/${username}`).then(r => r.data);

export const getSessionAttendance = (sessionId) =>
    api.get(`/attendance/session/${sessionId}`).then(r => r.data);
