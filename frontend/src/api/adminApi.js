import api from './axiosConfig';

// Dashboard
export const getDashboardStats = async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
};

// User Management
export const getAllUsers = async () => {
    const response = await api.get('/admin/users');
    return response.data;
};

export const suspendUser = async (userId, reason) => {
    const response = await api.put(`/admin/users/${userId}/suspend`, { reason });
    return response.data;
};

export const activateUser = async (userId) => {
    const response = await api.put(`/admin/users/${userId}/activate`);
    return response.data;
};

export const deleteUser = async (userId) => {
    await api.delete(`/admin/users/${userId}`);
};

// Course Management
export const getAllCoursesAdmin = async () => {
    const response = await api.get('/admin/courses');
    return response.data;
};

export const approveCourse = async (courseId) => {
    const response = await api.put(`/admin/courses/${courseId}/approve`);
    return response.data;
};

export const rejectCourse = async (courseId) => {
    const response = await api.put(`/admin/courses/${courseId}/reject`);
    return response.data;
};

// Application Management
export const getPendingApplications = async () => {
    const response = await api.get('/admin/applications');
    return response.data;
};

export const approveApplication = async (applicationId) => {
    await api.post(`/admin/applications/${applicationId}/approve`);
};

export const rejectApplication = async (applicationId, reason) => {
    await api.post(`/admin/applications/${applicationId}/reject`, { reason });
};

// Audit Logs
export const getAuditLogs = async () => {
    const response = await api.get('/admin/audit-logs');
    return response.data;
};
