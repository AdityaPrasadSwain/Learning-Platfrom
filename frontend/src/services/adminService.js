import api from './api';

// Dashboard
export const getDashboard = () => api.get('/admin/dashboard');

// User Management
export const getAllUsers = (page = 0, size = 10) => 
  api.get(`/admin/users?page=${page}&size=${size}`);

export const searchUsers = (keyword) => 
  api.get(`/admin/users/search?keyword=${keyword}`);

export const getUserById = (id) => 
  api.get(`/admin/users/${id}`);

export const updateUser = (id, data) => 
  api.put(`/admin/users/${id}`, data);

export const deleteUser = (id) => 
  api.delete(`/admin/users/${id}`);

export const suspendUser = (id, reason) => 
  api.post(`/admin/users/${id}/suspend`, { reason });

export const unsuspendUser = (id) => 
  api.post(`/admin/users/${id}/unsuspend`);

// Course Management
export const getAllCourses = (page = 0, size = 10) => 
  api.get(`/admin/courses?page=${page}&size=${size}`);

export const publishCourse = (id) => 
  api.post(`/admin/courses/${id}/publish`);

export const unpublishCourse = (id) => 
  api.post(`/admin/courses/${id}/unpublish`);

export const deleteCourse = (id) => 
  api.delete(`/admin/courses/${id}`);

// Audit Logs
export const getAuditLogs = (page = 0, size = 20) => 
  api.get(`/admin/audit-logs?page=${page}&size=${size}`);
