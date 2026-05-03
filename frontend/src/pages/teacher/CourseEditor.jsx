import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getCourseById, updateCourse } from '../../api/courseApi';
import {
    createLesson, updateLesson, deleteLesson,
    getLessonsByCourse, uploadLessonMaterial,
    getLessonMaterials, deleteLessonMaterial
} from '../../api/lessonApi';
import {
    Plus, Save, Trash2, Upload, FileText, Video, Image,
    File, ArrowLeft, Edit, X, Settings, BookOpen,
    CheckCircle, XCircle, GripVertical, ChevronRight
} from 'lucide-react';
import { showSuccess, showError, showConfirm } from '../../utils/sweetAlert';


const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 transition-all";
const labelClass = "block text-sm font-semibold text-gray-300 mb-2";

const CourseEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [showLessonModal, setShowLessonModal] = useState(false);
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [lessonForm, setLessonForm] = useState({ title: '', content: '', orderIndex: 0 });
    const [courseForm, setCourseForm] = useState({ title: '', description: '', category: '', duration: '', isPublished: false });
    const [materials, setMaterials] = useState([]);
    const [uploadingFile, setUploadingFile] = useState(false);

    useEffect(() => { fetchCourseDetails(); fetchLessons(); }, [id]);
    useEffect(() => { if (selectedLesson) fetchMaterials(selectedLesson.id); }, [selectedLesson]);

    const fetchCourseDetails = async () => {
        try {
            const data = await getCourseById(id);
            setCourse(data);
            setCourseForm({ title: data.title, description: data.description, category: data.category, duration: data.duration, isPublished: data.isPublished });
        } catch (error) {
            showError('Error', 'Failed to load course details');
        }
    };

    const fetchLessons = async () => {
        try {
            const data = await getLessonsByCourse(id);
            setLessons(data.sort((a, b) => a.orderIndex - b.orderIndex));
        } catch (error) { console.error('Failed to fetch lessons', error); }
    };

    const fetchMaterials = async (lessonId) => {
        try { setMaterials(await getLessonMaterials(lessonId)); }
        catch (error) { console.error('Failed to fetch materials', error); }
    };

    const handleCreateLesson = () => {
        setLessonForm({ title: '', content: '', orderIndex: lessons.length });
        setSelectedLesson(null);
        setShowLessonModal(true);
    };

    const handleEditLesson = (lesson) => {
        setLessonForm({ title: lesson.title, content: lesson.content, orderIndex: lesson.orderIndex });
        setSelectedLesson(lesson);
        setShowLessonModal(true);
    };

    const handleSaveLesson = async (e) => {
        e.preventDefault();
        try {
            if (selectedLesson?.id) {
                await updateLesson(selectedLesson.id, lessonForm);
            } else {
                await createLesson(id, lessonForm);
            }
            setShowLessonModal(false);
            setSelectedLesson(null);
            fetchLessons();
            showSuccess('Saved!', 'Lesson saved successfully');
        } catch (error) {
            showError('Error', 'Failed to save lesson');
        }
    };

    const handleDeleteLesson = async (lessonId, lessonTitle) => {
        const confirmed = await showConfirm(
            'Delete Lesson?',
            `"${lessonTitle}" will be permanently deleted.`
        );
        if (confirmed) {
            try {
                await deleteLesson(lessonId);
                fetchLessons();
                if (selectedLesson?.id === lessonId) setSelectedLesson(null);
                showSuccess('Deleted', 'Lesson has been deleted');
            } catch (error) {
                showError('Error', 'Failed to delete lesson');
            }
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !selectedLesson) return;
        setUploadingFile(true);
        try {
            await uploadLessonMaterial(selectedLesson.id, file, file.name);
            fetchMaterials(selectedLesson.id);
            showSuccess('Uploaded!', 'File uploaded successfully');
        } catch (error) {
            showError('Upload Failed', 'Could not upload file');
        } finally {
            setUploadingFile(false);
            e.target.value = '';
        }
    };

    const handleDeleteMaterial = async (materialId, fileName) => {
        const confirmed = await showConfirm(
            'Delete File?',
            `"${fileName}" will be removed.`
        );
        if (confirmed) {
            try {
                await deleteLessonMaterial(materialId);
                fetchMaterials(selectedLesson.id);
            } catch (error) {
                showError('Error', 'Failed to delete file');
            }
        }
    };

    const handleUpdateCourse = async (e) => {
        e.preventDefault();
        try {
            await updateCourse(id, courseForm);
            setShowCourseModal(false);
            fetchCourseDetails();
            showSuccess('Course Updated!', 'Changes saved successfully');
        } catch (error) {
            showError('Error', 'Failed to update course');
        }
    };

    const getFileIcon = (fileType) => {
        const props = { size: 18 };
        switch (fileType) {
            case 'VIDEO': return <Video {...props} className="text-cyan-400" />;
            case 'IMAGE': return <Image {...props} className="text-green-400" />;
            case 'PDF': return <FileText {...props} className="text-orange-400" />;
            default: return <File {...props} className="text-gray-400" />;
        }
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return '—';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    if (!course) {
        return (
            <div className="flex items-center justify-center h-64 text-white">
                <div className="text-xl font-orbitron animate-pulse text-cyan-400">Loading Course Editor...</div>
            </div>
        );
    }

    return (
        <div className="text-white space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <button
                        onClick={() => navigate('/teacher/my-courses')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white mb-3 transition group text-sm"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to My Courses
                    </button>
                    <h1 className="text-2xl font-bold font-orbitron text-white">{course.title}</h1>
                    <p className="text-gray-400 text-sm mt-1">{course.description}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${course.isPublished ? 'bg-green-400/10 text-green-400 border-green-400/30' : 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30'}`}>
                        {course.isPublished ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {course.isPublished ? 'Published' : 'Draft'}
                    </span>
                    <button
                        onClick={() => setShowCourseModal(true)}
                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 px-4 py-2 rounded-xl transition-all text-sm font-medium"
                    >
                        <Settings size={15} /> Edit Info
                    </button>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Lessons Sidebar */}
                <div className="lg:col-span-1">
                    <div className="glass-panel overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b border-white/10">
                            <h2 className="font-bold text-white flex items-center gap-2">
                                <BookOpen size={16} className="text-cyan-400" /> Lessons
                            </h2>
                            <button
                                onClick={handleCreateLesson}
                                className="flex items-center gap-1.5 bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/30 text-cyan-400 px-3 py-1.5 rounded-lg text-sm transition-all"
                            >
                                <Plus size={15} /> Add
                            </button>
                        </div>

                        <div className="p-2">
                            {lessons.length === 0 ? (
                                <div className="text-center py-10 text-gray-500">
                                    <BookOpen size={32} className="mx-auto mb-2 opacity-30" />
                                    <p className="text-sm">No lessons yet</p>
                                    <p className="text-xs mt-1">Click "Add" to create your first</p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {lessons.map((lesson, index) => (
                                        <div
                                            key={lesson.id}
                                            onClick={() => setSelectedLesson(lesson)}
                                            className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all group ${selectedLesson?.id === lesson.id
                                                ? 'bg-cyan-400/10 border border-cyan-400/30'
                                                : 'hover:bg-white/5 border border-transparent'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <span className={`text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shrink-0 ${selectedLesson?.id === lesson.id ? 'bg-cyan-400 text-black' : 'bg-white/10 text-gray-400'}`}>
                                                    {index + 1}
                                                </span>
                                                <span className="text-sm truncate text-gray-200">{lesson.title}</span>
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleEditLesson(lesson); }}
                                                    className="p-1.5 text-purple-400 hover:bg-purple-400/10 rounded-lg transition-all"
                                                >
                                                    <Edit size={13} />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteLesson(lesson.id, lesson.title); }}
                                                    className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-2 space-y-4">
                    {selectedLesson ? (
                        <>
                            {/* Lesson Content */}
                            <motion.div
                                key={selectedLesson.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass-panel p-6"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-white">{selectedLesson.title}</h2>
                                    <button
                                        onClick={() => handleEditLesson(selectedLesson)}
                                        className="flex items-center gap-1.5 text-sm text-purple-400 hover:text-purple-300 px-3 py-1.5 rounded-lg border border-purple-400/20 hover:bg-purple-400/10 transition-all"
                                    >
                                        <Edit size={14} /> Edit
                                    </button>
                                </div>
                                <div className="bg-white/3 rounded-xl p-4 border border-white/5">
                                    <p className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
                                        {selectedLesson.content || 'No content yet. Click "Edit" to add lesson content.'}
                                    </p>
                                </div>
                            </motion.div>

                            {/* Materials */}
                            <div className="glass-panel overflow-hidden">
                                <div className="flex justify-between items-center p-4 border-b border-white/10">
                                    <h3 className="font-bold flex items-center gap-2">
                                        <Upload size={15} className="text-purple-400" /> Course Materials
                                    </h3>
                                    <label className={`flex items-center gap-2 cursor-pointer text-sm px-3 py-1.5 rounded-lg border transition-all ${uploadingFile ? 'opacity-50 cursor-not-allowed bg-white/5 border-white/10 text-gray-400' : 'bg-purple-400/10 border-purple-400/30 text-purple-400 hover:bg-purple-400/20'}`}>
                                        <Upload size={14} />
                                        {uploadingFile ? 'Uploading...' : 'Upload File'}
                                        <input type="file" onChange={handleFileUpload} className="hidden" disabled={uploadingFile} />
                                    </label>
                                </div>
                                <div className="p-3">
                                    {materials.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            <Upload size={28} className="mx-auto mb-2 opacity-30" />
                                            <p className="text-sm">No materials yet</p>
                                            <p className="text-xs">Upload PDFs, videos, images or docs</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {materials.map((material) => (
                                                <div key={material.id} className="flex items-center justify-between p-3 bg-white/3 border border-white/5 rounded-xl hover:bg-white/8 transition-colors group">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        {getFileIcon(material.fileType)}
                                                        <div className="min-w-0">
                                                            <a
                                                                href={`http://localhost:8089${material.fileUrl}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-sm font-medium text-white hover:text-cyan-400 transition-colors truncate block"
                                                            >
                                                                {material.fileName}
                                                            </a>
                                                            <p className="text-xs text-gray-500">{material.fileType} • {formatFileSize(material.fileSize)}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteMaterial(material.id, material.fileName)}
                                                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="glass-panel p-16 text-center">
                            <ChevronRight size={48} className="mx-auto mb-4 opacity-20 text-cyan-400" />
                            <p className="text-lg text-gray-400">Select a lesson to view content</p>
                            <p className="text-sm text-gray-500 mt-1">Or create a new lesson to get started</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Course Edit Modal */}
            <AnimatePresence>
                {showCourseModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
                            className="glass-panel p-7 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold font-orbitron text-white">Edit Course Info</h2>
                                <button onClick={() => setShowCourseModal(false)} className="text-gray-400 hover:text-white p-1 hover:bg-white/10 rounded-lg transition">
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleUpdateCourse} className="space-y-4">
                                <div>
                                    <label className={labelClass}>Course Title</label>
                                    <input type="text" value={courseForm.title}
                                        onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                                        className={inputClass} required />
                                </div>
                                <div>
                                    <label className={labelClass}>Description</label>
                                    <textarea value={courseForm.description} rows={4}
                                        onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                                        className={inputClass + " resize-none"} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Category</label>
                                        <input type="text" value={courseForm.category}
                                            onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                                            className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Duration (mins)</label>
                                        <input type="number" value={courseForm.duration}
                                            onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                                            className={inputClass} />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 py-2">
                                    <button type="button"
                                        onClick={() => setCourseForm(p => ({ ...p, isPublished: !p.isPublished }))}
                                        className={`relative w-12 h-6 rounded-full transition-colors ${courseForm.isPublished ? 'bg-green-500' : 'bg-gray-700'}`}
                                    >
                                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${courseForm.isPublished ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </button>
                                    <span className="text-sm text-gray-300">{courseForm.isPublished ? 'Published' : 'Draft (not visible to students)'}</span>
                                </div>
                                <button type="submit"
                                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                                    <Save size={18} /> Save Changes
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Lesson Modal */}
            <AnimatePresence>
                {showLessonModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
                            className="glass-panel p-7 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold font-orbitron text-white">
                                    {selectedLesson?.id ? 'Edit Lesson' : 'New Lesson'}
                                </h2>
                                <button onClick={() => { setShowLessonModal(false); setSelectedLesson(null); }}
                                    className="text-gray-400 hover:text-white p-1 hover:bg-white/10 rounded-lg transition">
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleSaveLesson} className="space-y-4">
                                <div>
                                    <label className={labelClass}>Lesson Title *</label>
                                    <input type="text" value={lessonForm.title}
                                        onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                                        className={inputClass} placeholder="e.g., Introduction to the Topic" required />
                                </div>
                                <div>
                                    <label className={labelClass}>Content *</label>
                                    <textarea value={lessonForm.content} rows={8}
                                        onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                                        className={inputClass + " resize-none"}
                                        placeholder="Write your lesson content here..." required />
                                </div>
                                <div>
                                    <label className={labelClass}>Order</label>
                                    <input type="number" value={lessonForm.orderIndex} min="0"
                                        onChange={(e) => setLessonForm({ ...lessonForm, orderIndex: parseInt(e.target.value) })}
                                        className={inputClass} />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button type="submit"
                                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-xl hover:opacity-90 transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                                        <Save size={18} /> Save Lesson
                                    </button>
                                    <button type="button"
                                        onClick={() => { setShowLessonModal(false); setSelectedLesson(null); }}
                                        className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-bold py-3 rounded-xl transition-all">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CourseEditor;
