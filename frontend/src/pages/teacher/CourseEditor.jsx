import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import ThreeBackground from '../../components/ThreeBackground';
import { getCourseById, updateCourse } from '../../api/courseApi';
import {
    createLesson,
    updateLesson,
    deleteLesson,
    getLessonsByCourse,
    uploadLessonMaterial,
    getLessonMaterials,
    deleteLessonMaterial
} from '../../api/lessonApi';
import {
    Plus, Save, Trash2, Upload, FileText, Video, Image,
    File, ArrowLeft, Edit, X, Settings
} from 'lucide-react';
import Swal from 'sweetalert2';

const CourseEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [showLessonModal, setShowLessonModal] = useState(false);
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [lessonForm, setLessonForm] = useState({
        title: '',
        content: '',
        orderIndex: 0
    });
    const [courseForm, setCourseForm] = useState({
        title: '',
        description: '',
        category: '',
        duration: '',
        isPublished: false
    });
    const [materials, setMaterials] = useState([]);
    const [uploadingFile, setUploadingFile] = useState(false);

    useEffect(() => {
        fetchCourseDetails();
        fetchLessons();
    }, [id]);

    useEffect(() => {
        if (selectedLesson) {
            fetchMaterials(selectedLesson.id);
        }
    }, [selectedLesson]);

    const fetchCourseDetails = async () => {
        try {
            const data = await getCourseById(id);
            setCourse(data);
            setCourseForm({
                title: data.title,
                description: data.description,
                category: data.category,
                duration: data.duration,
                isPublished: data.isPublished
            });
        } catch (error) {
            console.error('Failed to fetch course', error);
            Swal.fire({ title: 'Error', text: 'Failed to load course details', icon: 'error', background: '#1f2937', color: '#fff', confirmButtonColor: '#ef4444' });
        }
    };

    const fetchLessons = async () => {
        try {
            const data = await getLessonsByCourse(id);
            setLessons(data.sort((a, b) => a.orderIndex - b.orderIndex));
        } catch (error) {
            console.error('Failed to fetch lessons', error);
        }
    };

    const fetchMaterials = async (lessonId) => {
        try {
            const data = await getLessonMaterials(lessonId);
            setMaterials(data);
        } catch (error) {
            console.error('Failed to fetch materials', error);
        }
    };

    const handleCreateLesson = () => {
        setLessonForm({
            title: '',
            content: '',
            orderIndex: lessons.length
        });
        setShowLessonModal(true);
    };

    const handleEditLesson = (lesson) => {
        setLessonForm({
            title: lesson.title,
            content: lesson.content,
            orderIndex: lesson.orderIndex
        });
        setSelectedLesson(lesson);
        setShowLessonModal(true);
    };

    const handleSaveLesson = async (e) => {
        e.preventDefault();

        try {
            if (selectedLesson && selectedLesson.id) {
                // Update existing lesson
                await updateLesson(selectedLesson.id, lessonForm);
                Swal.fire({ title: 'Success', text: 'Lesson updated successfully', icon: 'success', background: '#1f2937', color: '#fff', confirmButtonColor: '#9333ea' });
            } else {
                // Create new lesson
                await createLesson(id, lessonForm);
                Swal.fire({ title: 'Success', text: 'Lesson created successfully', icon: 'success', background: '#1f2937', color: '#fff', confirmButtonColor: '#9333ea' });
            }

            setShowLessonModal(false);
            setSelectedLesson(null);
            fetchLessons();
        } catch (error) {
            console.error('Failed to save lesson', error);
            Swal.fire({ title: 'Error', text: 'Failed to save lesson', icon: 'error', background: '#1f2937', color: '#fff', confirmButtonColor: '#ef4444' });
        }
    };

    const handleDeleteLesson = async (lessonId, lessonTitle) => {
        const result = await Swal.fire({
            title: 'Delete Lesson?',
            text: `Are you sure you want to delete "${lessonTitle}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            background: '#1f2937',
            color: '#fff'
        });

        if (result.isConfirmed) {
            try {
                await deleteLesson(lessonId);
                Swal.fire({ title: 'Deleted', text: 'Lesson deleted successfully', icon: 'success', background: '#1f2937', color: '#fff', confirmButtonColor: '#9333ea' });
                fetchLessons();
                if (selectedLesson?.id === lessonId) {
                    setSelectedLesson(null);
                }
            } catch (error) {
                console.error('Failed to delete lesson', error);
                Swal.fire({ title: 'Error', text: 'Failed to delete lesson', icon: 'error', background: '#1f2937', color: '#fff', confirmButtonColor: '#ef4444' });
            }
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !selectedLesson) return;

        setUploadingFile(true);
        try {
            await uploadLessonMaterial(selectedLesson.id, file, file.name);
            Swal.fire({ title: 'Success', text: 'File uploaded successfully', icon: 'success', background: '#1f2937', color: '#fff', confirmButtonColor: '#9333ea' });
            fetchMaterials(selectedLesson.id);
        } catch (error) {
            console.error('Failed to upload file', error);
            Swal.fire({ title: 'Error', text: 'Failed to upload file', icon: 'error', background: '#1f2937', color: '#fff', confirmButtonColor: '#ef4444' });
        } finally {
            setUploadingFile(false);
            e.target.value = '';
        }
    };

    const handleDeleteMaterial = async (materialId, fileName) => {
        const result = await Swal.fire({
            title: 'Delete File?',
            text: `Are you sure you want to delete "${fileName}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            background: '#1f2937',
            color: '#fff'
        });

        if (result.isConfirmed) {
            try {
                await deleteLessonMaterial(materialId);
                Swal.fire({ title: 'Deleted', text: 'File deleted successfully', icon: 'success', background: '#1f2937', color: '#fff', confirmButtonColor: '#9333ea' });
                fetchMaterials(selectedLesson.id);
            } catch (error) {
                console.error('Failed to delete material', error);
                Swal.fire({ title: 'Error', text: 'Failed to delete file', icon: 'error', background: '#1f2937', color: '#fff', confirmButtonColor: '#ef4444' });
            }
        }
    };

    const handleUpdateCourse = async (e) => {
        e.preventDefault();
        try {
            await updateCourse(id, courseForm);
            Swal.fire({ title: 'Success', text: 'Course updated successfully', icon: 'success', background: '#1f2937', color: '#fff', confirmButtonColor: '#9333ea' });
            setShowCourseModal(false);
            fetchCourseDetails();
        } catch (error) {
            console.error('Failed to update course', error);
            Swal.fire({ title: 'Error', text: 'Failed to update course', icon: 'error', background: '#1f2937', color: '#fff', confirmButtonColor: '#ef4444' });
        }
    };

    const getFileIcon = (fileType) => {
        switch (fileType) {
            case 'VIDEO': return <Video className="w-5 h-5" />;
            case 'IMAGE': return <Image className="w-5 h-5" />;
            case 'PDF': return <FileText className="w-5 h-5" />;
            default: return <File className="w-5 h-5" />;
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    if (!course) {
        return (
            <div className="relative min-h-screen flex items-center justify-center">
                <ThreeBackground />
                <div className="relative z-10 text-neon-blue text-xl font-orbitron animate-pulse">
                    Loading Course Editor...
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen">
            <ThreeBackground />
            <Navbar />

            <div className="relative z-10 pt-24 px-6 max-w-7xl mx-auto pb-12">
                {/* Header */}
                <div className="glass-panel p-6 mb-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <button
                                onClick={() => navigate('/teacher/dashboard')}
                                className="flex items-center space-x-2 text-neon-blue hover:text-white transition-colors mb-4"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span>Back to Dashboard</span>
                            </button>
                            <h1 className="text-3xl font-orbitron neon-text mb-2">{course.title}</h1>
                            <p className="text-gray-400">{course.description}</p>
                        </div>
                        <button
                            onClick={() => setShowCourseModal(true)}
                            className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors border border-gray-600"
                        >
                            <Settings className="w-4 h-4" />
                            <span>Edit Course</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Lessons List */}
                    <div className="lg:col-span-1">
                        <div className="glass-panel p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-orbitron">Lessons</h2>
                                <button
                                    onClick={handleCreateLesson}
                                    className="flex items-center space-x-1 bg-neon-blue/20 hover:bg-neon-blue/40 border border-neon-blue text-white px-3 py-2 rounded transition-all"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Add</span>
                                </button>
                            </div>

                            <div className="space-y-2">
                                {lessons.map((lesson, index) => (
                                    <div
                                        key={lesson.id}
                                        className={`p-3 rounded border cursor-pointer transition-all ${selectedLesson?.id === lesson.id
                                            ? 'bg-neon-blue/20 border-neon-blue'
                                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                                            }`}
                                        onClick={() => setSelectedLesson(lesson)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-neon-blue font-bold">{index + 1}</span>
                                                <span className="text-sm">{lesson.title}</span>
                                            </div>
                                            <div className="flex space-x-1">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditLesson(lesson);
                                                    }}
                                                    className="text-neon-blue hover:text-white p-1"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteLesson(lesson.id, lesson.title);
                                                    }}
                                                    className="text-red-400 hover:text-red-300 p-1"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {lessons.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>No lessons yet</p>
                                        <p className="text-sm">Click "Add" to create your first lesson</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Lesson Content & Materials */}
                    <div className="lg:col-span-2">
                        {selectedLesson ? (
                            <div className="space-y-6">
                                {/* Lesson Content */}
                                <div className="glass-panel p-6">
                                    <h2 className="text-2xl font-orbitron mb-4">{selectedLesson.title}</h2>
                                    <div className="prose prose-invert max-w-none">
                                        <p className="text-gray-300 whitespace-pre-wrap">{selectedLesson.content || 'No content yet'}</p>
                                    </div>
                                </div>

                                {/* Course Materials */}
                                <div className="glass-panel p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl font-orbitron">Course Materials</h3>
                                        <label className="flex items-center space-x-2 bg-neon-purple/20 hover:bg-neon-purple/40 border border-neon-purple text-white px-4 py-2 rounded cursor-pointer transition-all">
                                            <Upload className="w-4 h-4" />
                                            <span>{uploadingFile ? 'Uploading...' : 'Upload File'}</span>
                                            <input
                                                type="file"
                                                onChange={handleFileUpload}
                                                className="hidden"
                                                disabled={uploadingFile}
                                            />
                                        </label>
                                    </div>

                                    <div className="space-y-2">
                                        {materials.map((material) => (
                                            <div
                                                key={material.id}
                                                className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded hover:bg-white/10 transition-colors"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="text-neon-blue">
                                                        {getFileIcon(material.fileType)}
                                                    </div>
                                                    <div>
                                                        <a
                                                            href={`http://localhost:8089${material.fileUrl}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm font-medium hover:text-neon-blue transition-colors"
                                                        >
                                                            {material.fileName}
                                                        </a>
                                                        <p className="text-xs text-gray-400">
                                                            {material.fileType} • {formatFileSize(material.fileSize)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteMaterial(material.id, material.fileName)}
                                                    className="text-red-400 hover:text-red-300 p-2"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                        {materials.length === 0 && (
                                            <div className="text-center py-8 text-gray-500">
                                                <Upload className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                                <p>No materials uploaded yet</p>
                                                <p className="text-sm">Upload PDFs, videos, images, or documents</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="glass-panel p-12 text-center">
                                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50 text-neon-blue" />
                                <p className="text-xl text-gray-400">Select a lesson to view and edit content</p>
                                <p className="text-sm text-gray-500 mt-2">Or create a new lesson to get started</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Course Modal */}
            {showCourseModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="glass-panel p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-orbitron neon-text">Edit Course Details</h2>
                            <button onClick={() => setShowCourseModal(false)} className="text-gray-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateCourse} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Course Title</label>
                                <input
                                    type="text"
                                    value={courseForm.title}
                                    onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                                    className="w-full bg-black/30 border border-gray-600 rounded p-3 focus:border-neon-blue focus:outline-none text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Description</label>
                                <textarea
                                    value={courseForm.description}
                                    onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                                    className="w-full bg-black/30 border border-gray-600 rounded p-3 focus:border-neon-blue focus:outline-none text-white h-32"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Category</label>
                                    <input
                                        type="text"
                                        value={courseForm.category}
                                        onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                                        className="w-full bg-black/30 border border-gray-600 rounded p-3 focus:border-neon-blue focus:outline-none text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Duration (mins)</label>
                                    <input
                                        type="number"
                                        value={courseForm.duration}
                                        onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                                        className="w-full bg-black/30 border border-gray-600 rounded p-3 focus:border-neon-blue focus:outline-none text-white"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Update Course
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Lesson Modal */}
            {showLessonModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="glass-panel p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-orbitron neon-text">
                                {selectedLesson?.id ? 'Edit Lesson' : 'Create New Lesson'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowLessonModal(false);
                                    setSelectedLesson(null);
                                }}
                                className="text-gray-400 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveLesson} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Lesson Title *</label>
                                <input
                                    type="text"
                                    value={lessonForm.title}
                                    onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                                    className="w-full bg-black/30 border border-gray-600 rounded p-3 focus:border-neon-blue focus:outline-none text-white"
                                    placeholder="e.g., Introduction to the Topic"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Content *</label>
                                <textarea
                                    value={lessonForm.content}
                                    onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                                    className="w-full bg-black/30 border border-gray-600 rounded p-3 focus:border-neon-blue focus:outline-none text-white h-64"
                                    placeholder="Write your lesson content here..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Order</label>
                                <input
                                    type="number"
                                    value={lessonForm.orderIndex}
                                    onChange={(e) => setLessonForm({ ...lessonForm, orderIndex: parseInt(e.target.value) })}
                                    className="w-full bg-black/30 border border-gray-600 rounded p-3 focus:border-neon-blue focus:outline-none text-white"
                                    min="0"
                                />
                            </div>

                            <div className="flex space-x-4 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
                                >
                                    <Save className="w-5 h-5" />
                                    <span>Save Lesson</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowLessonModal(false);
                                        setSelectedLesson(null);
                                    }}
                                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseEditor;
