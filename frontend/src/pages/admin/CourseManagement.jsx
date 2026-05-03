import React, { useState, useEffect } from 'react';
import { Search, Eye, CheckCircle, XCircle, ArrowLeft, BookOpen, User, Tag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllCoursesAdmin, approveCourse, rejectCourse } from '../../api/adminApi';
import { showSuccess, showError, showConfirm, showLoading } from '../../utils/sweetAlert';
import Swal from 'sweetalert2';

const CourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem('role');
        if (role !== 'ADMIN') {
            showError('Access Denied', 'You must be logged in as an admin to access this page');
            setLoading(false);
            navigate('/dashboard');
            return;
        }
        fetchCourses();
    }, [navigate]);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllCoursesAdmin();
            if (Array.isArray(data)) {
                setCourses(data);
            } else {
                setCourses([]);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
            setError(error.response?.data?.message || error.message || 'Failed to load courses.');
            showError('Error', 'Failed to load courses.');
            setCourses([]);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (course) => {
        const confirmed = await showConfirm(
            'Approve Course?',
            `Are you sure you want to publish "${course.title}"?`
        );
        if (confirmed) {
            showLoading('Publishing course...');
            try {
                await approveCourse(course.id);
                Swal.close();
                await showSuccess('Published!', `${course.title} is now published`);
                fetchCourses();
            } catch (error) {
                Swal.close();
                showError('Error', 'Failed to publish course');
            }
        }
    };

    const handleReject = async (course) => {
        const confirmed = await showConfirm(
            'Unpublish Course?',
            `Are you sure you want to unpublish "${course.title}"?`
        );
        if (confirmed) {
            showLoading('Unpublishing course...');
            try {
                await rejectCourse(course.id);
                Swal.close();
                await showSuccess('Unpublished!', `${course.title} has been unpublished`);
                fetchCourses();
            } catch (error) {
                Swal.close();
                showError('Error', 'Failed to unpublish course');
            }
        }
    };

    const filteredCourses = Array.isArray(courses) ? courses.filter(course => {
        const titleMatch = course.title?.toLowerCase().includes(searchTerm.toLowerCase());
        const instructorMatch = course.instructor?.username?.toLowerCase().includes(searchTerm.toLowerCase());
        return titleMatch || instructorMatch;
    }) : [];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="text-slate-500 dark:text-slate-400 font-orbitron">Loading Catalog...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12 transition-colors duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <Link
                        to="/admin/dashboard"
                        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-500 transition-colors group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Dashboard</span>
                    </Link>
                    <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">Course Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Oversee and moderate all courses on the platform.</p>
                </div>

                <div className="relative group max-w-md w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search by title or instructor..."
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table Section */}
            <div className="glass-panel overflow-hidden border border-slate-200 dark:border-white/10 shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-white/[0.02] border-b border-slate-200 dark:border-white/10">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Course Info</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">Instructor</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">Category</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {filteredCourses.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 italic">No courses found matching your search.</td>
                                </tr>
                            ) : (
                                filteredCourses.map(course => (
                                    <tr key={course.id} className="group hover:bg-slate-50 dark:hover:bg-white/[0.01] transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                                                    <BookOpen size={20} />
                                                </div>
                                                <div className="font-bold text-slate-900 dark:text-white">{course.title}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 text-sm font-medium border border-slate-200 dark:border-white/5">
                                                <User size={14} className="text-slate-400" />
                                                {course.instructor ? course.instructor.username : 'Unknown'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm">
                                                <Tag size={14} className="text-slate-400" />
                                                {course.category}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className={`px-3 py-1 inline-flex text-[10px] font-bold uppercase tracking-widest rounded-full ${course.isPublished ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'}`}>
                                                {course.isPublished ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link to={`/course/${course.id}`}>
                                                    <button className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-500/10 rounded-lg transition-all" title="View Details">
                                                        <Eye size={18} />
                                                    </button>
                                                </Link>
                                                {!course.isPublished ? (
                                                    <button onClick={() => handleApprove(course)} className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-all" title="Publish Course">
                                                        <CheckCircle size={18} />
                                                    </button>
                                                ) : (
                                                    <button onClick={() => handleReject(course)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all" title="Unpublish Course">
                                                        <XCircle size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CourseManagement;
