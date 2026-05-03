import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Edit, Trash2, Plus, Eye, Clock, Users, CheckCircle, XCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyCourses, deleteCourse } from '../../api/courseApi';
import { showSuccess, showError, showConfirm, showLoading } from '../../utils/sweetAlert';
import Swal from 'sweetalert2';

const MyCourses = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const userId = localStorage.getItem('userId');
            const data = await getMyCourses(userId);
            setCourses(data);
        } catch (error) {
            showError('Error', 'Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCourses(); }, []);

    const handleDelete = async (id, title) => {
        const confirmed = await showConfirm('Delete Course?', `Are you sure you want to delete "${title}"?`);
        if (confirmed) {
            showLoading('Deleting course...');
            try {
                await deleteCourse(id);
                Swal.close();
                await showSuccess('Deleted!', `${title} has been deleted`);
                fetchCourses();
            } catch (error) {
                Swal.close();
                showError('Delete Failed', error.response?.data?.message || 'Failed to delete course.');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 text-white">
                <div className="text-xl font-orbitron animate-pulse">Loading courses...</div>
            </div>
        );
    }

    return (
        <div className="text-white space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold font-orbitron text-white">My Courses</h1>
                    <p className="text-gray-400 mt-1">Manage and edit your course content</p>
                </div>
                <Link to="/teacher/create-course">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all"
                    >
                        <Plus size={18} /> Create Course
                    </motion.button>
                </Link>
            </div>

            {/* Empty State */}
            {courses.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="glass-panel p-16 text-center"
                >
                    <BookOpen size={56} className="mx-auto text-gray-500 mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">No Courses Yet</h2>
                    <p className="text-gray-400 mb-6">Create your first course to get started</p>
                    <Link to="/teacher/create-course">
                        <button className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-6 py-3 rounded-xl hover:scale-105 transition-all">
                            <Plus size={18} /> Create Course
                        </button>
                    </Link>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {courses.map((course, index) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.07 }}
                            className="glass-panel overflow-hidden flex flex-col hover:border-purple-500/30 transition-all group"
                        >
                            {/* Color Bar */}
                            <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-pink-500" />

                            <div className="p-5 flex-1 flex flex-col">
                                {/* Title & Category */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base font-bold text-white mb-1 line-clamp-2 group-hover:text-purple-300 transition-colors">
                                            {course.title}
                                        </h3>
                                        {course.category && (
                                            <span className="inline-block px-2.5 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full text-xs font-medium">
                                                {course.category}
                                            </span>
                                        )}
                                    </div>
                                    <span className={`ml-2 shrink-0 flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                                        course.isPublished
                                            ? 'bg-green-400/10 text-green-400 border border-green-400/20'
                                            : 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20'
                                    }`}>
                                        {course.isPublished ? <CheckCircle size={10} /> : <XCircle size={10} />}
                                        {course.isPublished ? 'Live' : 'Draft'}
                                    </span>
                                </div>

                                <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">
                                    {course.description || 'No description provided.'}
                                </p>

                                {/* Stats row */}
                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 pt-3 border-t border-white/5">
                                    <span className="flex items-center gap-1"><Clock size={12} /> {course.duration || 0} min</span>
                                    <span className="flex items-center gap-1"><Users size={12} /> {course.enrollmentCount || 0} students</span>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => navigate(`/course/${course.id}`)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-cyan-400/10 text-cyan-400 rounded-lg hover:bg-cyan-400/20 border border-cyan-400/20 transition-all text-sm font-medium"
                                    >
                                        <Eye size={14} /> View
                                    </button>
                                    <button
                                        onClick={() => navigate(`/teacher/course/${course.id}/edit`)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-purple-400/10 text-purple-400 rounded-lg hover:bg-purple-400/20 border border-purple-400/20 transition-all text-sm font-medium"
                                    >
                                        <Edit size={14} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(course.id, course.title)}
                                        className="px-3 py-2 bg-red-400/10 text-red-400 rounded-lg hover:bg-red-400/20 border border-red-400/20 transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyCourses;
