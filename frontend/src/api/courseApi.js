import api from './axiosConfig';

export const getAllCourses = async () => {
    const response = await api.get('/courses');
    return response.data;
};

export const getMyCourses = async (teacherId) => {
    const response = await api.get(`/teacher/courses`, { params: { teacherId } });
    return response.data;
};

export const getCourseById = async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
};

export const createCourse = async (courseData) => {
    const response = await api.post('/courses', courseData);
    return response.data;
};

export const updateCourse = async (id, courseData) => {
    const response = await api.put(`/courses/${id}`, courseData);
    return response.data;
};

export const deleteCourse = async (id) => {
    await api.delete(`/courses/${id}`);
};

export const uploadCourseMaterials = async (courseId, files) => {
    const formData = new FormData();
    files.forEach((file) => {
        formData.append('files', file);
    });

    const response = await api.post(`/courses/${courseId}/materials`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getCourseMaterials = async (courseId) => {
    const response = await api.get(`/courses/${courseId}/materials`);
    return response.data;
};
