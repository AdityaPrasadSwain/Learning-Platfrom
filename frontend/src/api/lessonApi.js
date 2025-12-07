import api from './axiosConfig';

export const createLesson = async (courseId, lessonData) => {
    const response = await api.post(`/lessons/course/${courseId}`, lessonData);
    return response.data;
};

export const updateLesson = async (lessonId, lessonData) => {
    const response = await api.put(`/lessons/${lessonId}`, lessonData);
    return response.data;
};

export const deleteLesson = async (lessonId) => {
    await api.delete(`/lessons/${lessonId}`);
};

export const getLessonsByCourse = async (courseId) => {
    const response = await api.get(`/lessons/course/${courseId}`);
    return response.data;
};

export const uploadLessonMaterial = async (lessonId, file, description) => {
    const formData = new FormData();
    formData.append('file', file);
    if (description) {
        formData.append('description', description);
    }

    const response = await api.post(`/lessons/${lessonId}/materials`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getLessonMaterials = async (lessonId) => {
    const response = await api.get(`/lessons/${lessonId}/materials`);
    return response.data;
};

export const deleteLessonMaterial = async (materialId) => {
    await api.delete(`/lessons/materials/${materialId}`);
};
