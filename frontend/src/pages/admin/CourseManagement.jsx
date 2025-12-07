import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import ThreeBackground from '../../components/ThreeBackground';
import { Search, Eye, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
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
            console.log('Fetched courses:', data);

            if (Array.isArray(data)) {
                setCourses(data);
            } else {
                console.error('Data is not an array:', data);
                setCourses([]);
                if (data && data.message) {
                    setError(data.message);
                }
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
            console.error('Error details:', error.response);
            setError(error.response?.data?.message || error.message || 'Failed to load courses.');
            showError('Error', error.response?.data?.message || 'Failed to load courses.');
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
                console.error('Error approving course:', error);
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
                console.error('Error rejecting course:', error);
                Swal.close();
                showError('Error', 'Failed to unpublish course');
            }
        }
    };

    const filteredCourses = Array.isArray(courses) ? courses.filter(course => {
        try {
            const titleMatch = course.title?.toLowerCase().includes(searchTerm.toLowerCase());
            const instructorMatch = course.instructor?.username?.toLowerCase().includes(searchTerm.toLowerCase());
            return titleMatch || instructorMatch;
        } catch (e) {
            console.warn('Error filtering course:', course, e);
            return false;
        }
    }) : [];

    if (loading) {
        return (
            <div className="relative min-h-screen flex items-center justify-center text-white">
                <ThreeBackground />
                <Navbar />
                <div className="relative z-10 text-2xl font-orbitron animate-pulse">Loading courses...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="relative min-h-screen text-white">
                <ThreeBackground />
                <Navbar />
                <div className="relative z-10 pt-24 px-6 max-w-7xl mx-auto text-center">
                    <h2 className="text-2xl text-red-500 font-bold mb-4">Error Loading Courses</h2>
                    <p className="text-gray-300 mb-4">{error}</p>
                    <button
                        onClick={fetchCourses}
                        className="px-4 py-2 bg-neon-blue text-white rounded hover:bg-blue-600 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen text-white">
            <ThreeBackground />
            <Navbar />
            <div className="relative z-10 pt-24 px-6 max-w-7xl mx-auto space-y-6 pb-12">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link
                            to="/admin/dashboard"
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft size={20} />
                            <span>Back to Dashboard</span>
                        </Link>
                        <h1 className="text-2xl font-bold font-orbitron text-white neon-text">Course Management</h1>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neon-blue" size={20} />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            className="pl-10 pr-4 py-2 glass-panel text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="glass-panel overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-neon-blue uppercase tracking-wider">Course Title</th>
                                <th className="px-6 py-3 text-xs font-semibold text-neon-blue uppercase tracking-wider">Instructor</th>
                                <th className="px-6 py-3 text-xs font-semibold text-neon-blue uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-xs font-semibold text-neon-blue uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-xs font-semibold text-neon-blue uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {filteredCourses.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-400">No courses found</td>
                                </tr>
                            ) : (
                                filteredCourses.map(course => (
                                    <tr key={course.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">{course.title}</td>
                                        <td className="px-6 py-4 text-gray-300">
                                            {course.instructor ? course.instructor.username : 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-300">{course.category}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${course.isPublished ? 'bg-green-500/20 text-green-400 border border-green-500' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500'}`}>
                                                {course.isPublished ? 'Published' : 'Draft/Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium space-x-2">
                                            <Link to={`/course/${course.id}`}>
                                                <button className="text-neon-blue hover:text-blue-300 transition-colors" title="View">
                                                    <Eye size={18} />
                                                </button>
                                            </Link>
                                            {!course.isPublished && (
                                                <button onClick={() => handleApprove(course)} className="text-green-400 hover:text-green-300 transition-colors" title="Approve/Publish">
                                                    <CheckCircle size={18} />
                                                </button>
                                            )}
                                            {course.isPublished && (
                                                <button onClick={() => handleReject(course)} className="text-orange-400 hover:text-orange-300 transition-colors" title="Unpublish">
                                                    <XCircle size={18} />
                                                </button>
                                            )}
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
