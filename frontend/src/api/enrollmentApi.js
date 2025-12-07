import api from './axiosConfig';

export const enrollInCourse = async (courseId) => {
    const response = await api.post(`/enrollments/enroll/${courseId}`);
    return response.data;
};

export const unenrollFromCourse = async (courseId) => {
    await api.delete(`/enrollments/unenroll/${courseId}`);
};

export const getMyEnrollments = async () => {
    const response = await api.get('/enrollments/my-enrollments');
    return response.data;
};

export const isEnrolled = async (courseId) => {
    const response = await api.get(`/enrollments/is-enrolled/${courseId}`);
    return response.data.enrolled;
};

export const updateProgress = async (courseId, progress) => {
    const response = await api.put(`/enrollments/progress/${courseId}`, { progress });
    return response.data;
};
