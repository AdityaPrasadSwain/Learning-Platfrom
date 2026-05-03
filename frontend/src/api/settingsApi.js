import api from './axiosConfig';

export const getUserSettings = async (userId) => {
    const response = await api.get(`/settings/${userId}`);
    return response.data;
};

export const updateUserSettings = async (userId, settings) => {
    const response = await api.post(`/settings/update/${userId}`, settings);
    return response.data;
};

export const getSystemSettings = async () => {
    const response = await api.get('/system/settings');
    return response.data;
};

export const updateSystemSetting = async (key, value) => {
    const response = await api.post('/system/settings/update', { key, value });
    return response.data;
};

export const getFeatureToggles = async () => {
    const response = await api.get('/system/feature-toggles');
    return response.data;
};
