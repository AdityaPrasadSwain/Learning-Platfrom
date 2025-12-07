import api from './axiosConfig';

export const uploadVideo = async (formData) => {
    const response = await api.post('/teacher/videos/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getTeacherVideos = async (teacherId) => {
    const response = await api.get(`/teacher/videos/instructor/${teacherId}`);
    return response.data;
};

export const getAllVideos = async () => {
    const response = await api.get('/teacher/videos/all');
    return response.data;
};

export const getVideoById = async (videoId) => {
    const response = await api.get(`/teacher/videos/video/${videoId}`);
    return response.data;
};

export const deleteVideo = async (videoId) => {
    await api.delete(`/teacher/videos/video/${videoId}`);
};

// Get stream URL - now returns Cloudinary URL directly from video object
export const getStreamUrl = (video) => {
    // If video has cloudinaryUrl, use it directly
    if (video && video.cloudinaryUrl) {
        return video.cloudinaryUrl;
    }
    // Fallback to old streaming endpoint (for backward compatibility)
    if (typeof video === 'string') {
        return `/api/teacher/videos/stream/${video}`;
    }
    return video?.fileName ? `/api/teacher/videos/stream/${video.fileName}` : '';
};
