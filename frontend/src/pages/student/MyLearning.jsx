import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Award, TrendingUp, Play, CheckCircle, Circle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getMyEnrollments, unenrollFromCourse } from '../../api/enrollmentApi';
import { showError, showSuccess, showConfirm, showLoading } from '../../utils/sweetAlert';
import Swal from 'sweetalert2';
import Navbar from '../../components/Navbar';

import Footer from '../../components/Footer';

const MyLearning = () => {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const username = localStorage.getItem('username') || 'Student';

    useEffect(() => {
        fetchEnrolledCourses();
    }, []);

    const fetchEnrolledCourses = async () => {
        try {
            setLoading(true);
            const data = await getMyEnrollments();

            // Transform enrollment data to include course details
            const coursesWithProgress = data.map(enrollment => ({
                id: enrollment.courseId,
                title: enrollment.courseTitle,
                description: enrollment.courseDescription,
                category: enrollment.courseCategory,
                duration: enrollment.courseDuration,
                instructorName: enrollment.instructorName,
                progress: enrollment.progress || 0,
                completed: enrollment.completed,
                enrolledAt: enrollment.enrolledAt,
                lastAccessed: enrollment.lastAccessed ? new Date(enrollment.lastAccessed).toLocaleDateString() : 'Never',
                completedLessons: Math.floor((enrollment.progress || 0) / 10),
                totalLessons: 10,
                timeSpent: Math.floor((enrollment.progress || 0) * 1.2)
            }));

            setEnrolledCourses(coursesWithProgress);
        } catch (error) {
            console.error('Error fetching courses:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to load your courses';
            showError('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleUnenroll = async (courseId, courseTitle) => {
        const confirmed = await showConfirm(
            'Unenroll from Course?',
            `Are you sure you want to unenroll from "${courseTitle}"? Your progress will be lost.`
        );

        if (confirmed) {
            showLoading('Unenrolling...');
            try {
                await unenrollFromCourse(courseId);
                Swal.close();
                await showSuccess('Unenrolled!', `You have been unenrolled from ${courseTitle}`);
                fetchEnrolledCourses();
            } catch (error) {
                console.error('Error unenrolling:', error);
                Swal.close();
                showError('Error', 'Failed to unenroll from course');
            }
        }
    };

    const stats = {
        totalEnrolled: enrolledCourses.length,
        inProgress: enrolledCourses.filter(c => c.progress > 0 && c.progress < 100).length,
        completed: enrolledCourses.filter(c => c.progress === 100).length,
        totalHours: Math.floor(enrolledCourses.reduce((sum, c) => sum + c.timeSpent, 0) / 60)
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white relative overflow-hidden flex items-center justify-center transition-colors duration-300">

                <Navbar />
                <div className="text-2xl font-semibold">Loading your courses...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white relative overflow-hidden flex flex-col transition-colors duration-300">

            <Navbar />

            <main className="container mx-auto px-6 pt-32 pb-12 flex-1">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">My Learning</h1>
                    <p className="text-gray-600 dark:text-gray-400">Track your progress and continue learning</p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard
                        icon={BookOpen}
                        color="text-blue-600 dark:text-blue-400"
                        bg="bg-blue-100 dark:bg-blue-500/20"
                        title="Enrolled Courses"
                        value={stats.totalEnrolled}
                    />
                    <StatCard
                        icon={TrendingUp}
                        color="text-yellow-600 dark:text-yellow-400"
                        bg="bg-yellow-100 dark:bg-yellow-500/20"
                        title="In Progress"
                        value={stats.inProgress}
                    />
                    <StatCard
                        icon={Award}
                        color="text-green-600 dark:text-green-400"
                        bg="bg-green-100 dark:bg-green-500/20"
                        title="Completed"
                        value={stats.completed}
                    />
                    <StatCard
                        icon={Clock}
                        color="text-purple-600 dark:text-purple-400"
                        bg="bg-purple-100 dark:bg-purple-500/20"
                        title="Hours Learned"
                        value={stats.totalHours}
                    />
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-4 mb-8">
                    <button className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium shadow-md">
                        All Courses
                    </button>
                    <button className="px-6 py-2 bg-white dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors border border-gray-200 dark:border-transparent">
                        In Progress
                    </button>
                    <button className="px-6 py-2 bg-white dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors border border-gray-200 dark:border-transparent">
                        Completed
                    </button>
                </div>

                {/* Enrolled Courses */}
                {enrolledCourses.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <BookOpen size={64} className="mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                        <h2 className="text-2xl font-bold mb-2">No enrolled courses yet</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">Start learning by enrolling in a course</p>
                        <Link to="/courses">
                            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity">
                                Browse Courses
                            </button>
                        </Link>
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        {enrolledCourses.map((course, index) => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}

                                className="bg-white dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden hover:border-purple-500/50 transition-all shadow-md dark:shadow-none"
                            >
                                <div className="p-6">
                                    <div className="flex flex-col lg:flex-row gap-6">
                                        {/* Course Info */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{course.title}</h3>
                                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{course.description}</p>
                                                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                                        <span className="flex items-center gap-1">
                                                            <BookOpen size={16} />
                                                            {course.completedLessons}/{course.totalLessons} lessons
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock size={16} />
                                                            {course.timeSpent} min spent
                                                        </span>
                                                        <span className="text-gray-400">
                                                            Last accessed: {course.lastAccessed}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-sm ${course.progress === 100
                                                    ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300'
                                                    : course.progress > 0
                                                        ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300'
                                                        : 'bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-300'
                                                    }`}>
                                                    {course.progress === 100 ? 'Completed' : course.progress > 0 ? 'In Progress' : 'Not Started'}
                                                </span>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                                                    <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{course.progress}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${course.progress}%` }}
                                                        transition={{ duration: 1, delay: index * 0.1 }}
                                                        className={`h-full rounded-full ${course.progress === 100
                                                            ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                                                            : 'bg-gradient-to-r from-purple-600 to-pink-600'
                                                            }`}
                                                    />
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-3">
                                                <Link to={`/course/${course.id}`} className="flex-1">
                                                    <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 font-medium">
                                                        <Play size={18} />
                                                        {course.progress === 0 ? 'Start Course' : 'Continue Learning'}
                                                    </button>
                                                </Link>
                                                {course.progress === 100 && (
                                                    <button className="px-6 py-3 bg-green-600/20 text-green-300 border border-green-500/30 rounded-lg hover:bg-green-600/30 transition-colors flex items-center gap-2 font-medium">
                                                        <Award size={18} />
                                                        View Certificate
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Course Thumbnail */}
                                        <div className="lg:w-64 h-40 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-600/20 dark:to-pink-600/20 rounded-xl flex items-center justify-center">
                                            <BookOpen size={64} className="text-purple-500 dark:text-purple-400" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>

            <div className="relative z-10">
                <Footer />
            </div>
        </div>
    );
};

const StatCard = ({ icon: Icon, color, bg, title, value }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white dark:bg-gray-900/50 backdrop-blur-md p-6 rounded-2xl border border-gray-200 dark:border-white/10 shadow-md dark:shadow-none"
    >
        <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 ${bg} rounded-lg ${color}`}>
                <Icon size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">{title}</h3>
        </div>
        <p className="text-4xl font-bold text-gray-900 dark:text-white">{value}</p>
    </motion.div>
);

export default MyLearning;
