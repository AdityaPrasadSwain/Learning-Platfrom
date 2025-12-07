import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Edit, Trash2, Plus, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyCourses, deleteCourse } from '../../api/courseApi';
import { showSuccess, showError, showConfirm, showLoading } from '../../utils/sweetAlert';
import Swal from 'sweetalert2';
import Navbar from '../../components/Navbar';


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
            console.error('Error fetching courses:', error);
            showError('Error', 'Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleDelete = async (id, title) => {
        const confirmed = await showConfirm(
            'Delete Course?',
            `Are you sure you want to delete "${title}"? This action cannot be undone.`
        );

        if (confirmed) {
            showLoading('Deleting course...');
            try {
                await deleteCourse(id);
                Swal.close();
                await showSuccess('Deleted!', `${title} has been deleted successfully`);
                // Refresh the list
                fetchCourses();
            } catch (error) {
                console.error('Error deleting course:', error);
                Swal.close();
                showError('Delete Failed', error.response?.data?.message || 'Failed to delete course. Please try again.');
            }
        }
    };

    if (loading) {
        return (

            <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white relative overflow-hidden flex items-center justify-center transition-colors duration-300">
                <div className="text-2xl font-semibold">Loading courses...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-ai-soft dark:bg-ai-base text-gray-900 dark:text-white relative overflow-hidden transition-colors duration-300">

            <Navbar />

            <main className="container mx-auto px-6 pt-32 pb-12">
                <div className="flex justify-between items-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl font-bold mb-2">My Courses</h1>
                        <p className="text-slate-600 dark:text-gray-400">Manage and edit your courses</p>
                    </motion.div>

                    <Link to="/teacher/create-course">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center shadow-lg shadow-purple-500/20"
                        >
                            <Plus size={20} className="mr-2" />
                            Create New Course
                        </motion.button>
                    </Link>
                </div>

                {courses.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >

                        <BookOpen size={64} className="mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                        <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">No courses yet</h2>
                        <p className="text-slate-600 dark:text-gray-400 mb-6">Create your first course to get started</p>
                        <Link to="/teacher/create-course">
                            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity">
                                Create Course
                            </button>
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course, index) => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}

                                className="bg-white dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden hover:border-purple-500/50 transition-all shadow-lg dark:shadow-none hover:shadow-xl dark:hover:shadow-purple-500/10"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold mb-2 line-clamp-2 text-slate-900 dark:text-white">{course.title}</h3>
                                            <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 rounded-full text-sm font-medium">
                                                {course.category}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-slate-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                                        {course.description}
                                    </p>

                                    <div className="flex items-center justify-between text-sm text-slate-500 dark:text-gray-400 mb-4 pt-4 border-t border-gray-100 dark:border-white/10">
                                        <span>{course.duration} minutes</span>
                                        <span className={`px-2 py-1 rounded font-medium ${course.isPublished ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-300' : 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-300'}`}>
                                            {course.isPublished ? 'Published' : 'Draft'}
                                        </span>
                                    </div>

                                    <div className="flex gap-2">

                                        <button
                                            onClick={() => navigate(`/course/${course.id}`)}
                                            className="flex-1 px-4 py-2 bg-blue-100 dark:bg-blue-600/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-600/30 transition-colors flex items-center justify-center font-medium"
                                        >
                                            <Eye size={16} className="mr-2" />
                                            View
                                        </button>

                                        <button
                                            onClick={() => navigate(`/teacher/course/${course.id}/edit`)}
                                            className="flex-1 px-4 py-2 bg-purple-100 dark:bg-purple-600/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-600/30 transition-colors flex items-center justify-center font-medium"
                                        >
                                            <Edit size={16} className="mr-2" />
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => handleDelete(course.id, course.title)}
                                            className="px-4 py-2 bg-red-100 dark:bg-red-600/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-600/30 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyCourses;
