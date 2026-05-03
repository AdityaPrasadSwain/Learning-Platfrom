import api from './axiosConfig';

export const getUserNotifications = async (userId) => {
    const response = await api.get(`/notifications/user/${userId}`);
    return response.data;
};

export const getUnreadCount = async (userId) => {
    const response = await api.get(`/notifications/user/${userId}/unread-count`);
    return response.data;
};

export const markAsRead = async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
};

export const markAllAsRead = async (userId) => {
    const response = await api.put(`/notifications/user/${userId}/read-all`);
    return response.data;
};
