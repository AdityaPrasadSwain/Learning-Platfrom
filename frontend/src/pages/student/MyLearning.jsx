import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Award, TrendingUp, Play, CheckCircle, Search, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getMyEnrollments, unenrollFromCourse } from '../../api/enrollmentApi';
import { showError, showSuccess, showConfirm, showLoading } from '../../utils/sweetAlert';
import Swal from 'sweetalert2';

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
            <div className="flex items-center justify-center h-64 text-white">
                <div className="text-xl font-orbitron animate-pulse text-cyan-400">Loading your journey...</div>
            </div>
        );
    }

    return (
        <div className="text-white">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-3xl font-bold font-orbitron">My <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Learning Journey</span></h1>
                <p className="text-gray-400 mt-1">Track your progress and continue where you left off.</p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <StatCard icon={BookOpen} gradient="from-cyan-500 to-blue-600" title="Enrolled" value={stats.totalEnrolled} />
                <StatCard icon={TrendingUp} gradient="from-yellow-400 to-orange-500" title="In Progress" value={stats.inProgress} />
                <StatCard icon={CheckCircle} gradient="from-green-400 to-emerald-600" title="Completed" value={stats.completed} />
                <StatCard icon={Clock} gradient="from-purple-500 to-pink-500" title="Hours Spent" value={stats.totalHours} />
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-3 mb-6">
                {['All Courses', 'In Progress', 'Completed'].map((tab) => (
                    <button key={tab} className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${tab === 'All Courses'
                        ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                        }`}>
                        {tab}
                    </button>
                ))}
            </div>

            {/* Enrolled Courses */}
            {enrolledCourses.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                    <BookOpen size={56} className="mx-auto mb-4 text-gray-600" />
                    <h2 className="text-xl font-bold mb-2">No enrolled courses yet</h2>
                    <p className="text-gray-400 mb-6 text-sm">Start learning by enrolling in a course</p>
                    <Link to="/courses">
                        <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity text-sm">
                            Browse Courses
                        </button>
                    </Link>
                </motion.div>
            ) : (
                <div className="grid gap-5">
                    {enrolledCourses.map((course, index) => (
                        <motion.div key={course.id}
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:border-cyan-500/30 transition-all group"
                        >
                            <div className="p-6 flex flex-col md:flex-row gap-6">
                                {/* Course Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="min-w-0 pr-4">
                                            <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors truncate">{course.title}</h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                                    By {course.instructorName}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${course.progress === 100
                                                    ? 'border-green-500/30 text-green-400 bg-green-500/5'
                                                    : 'border-cyan-500/30 text-cyan-400 bg-cyan-500/5'
                                                    }`}>
                                                    {course.progress === 100 ? 'COMPLETED' : 'IN PROGRESS'}
                                                </span>
                                            </div>
                                        </div>
                                        <button onClick={() => handleUnenroll(course.id, course.title)}
                                            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all" title="Unenroll">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <p className="text-gray-400 text-sm mb-5 line-clamp-2">{course.description}</p>

                                    {/* Progress Area */}
                                    <div className="mb-5">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-xs text-gray-500 font-medium">COURSE PROGRESS</span>
                                            <span className="text-xs font-bold text-cyan-400">{course.progress}%</span>
                                        </div>
                                        <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${course.progress}%` }}
                                                className={`h-full rounded-full ${course.progress === 100 ? 'bg-green-500' : 'bg-cyan-500'}`} />
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-6">
                                        <span className="flex items-center gap-1.5"><Clock size={14} /> {course.timeSpent}m Spent</span>
                                        <span className="flex items-center gap-1.5"><CheckCircle size={14} /> {course.completedLessons}/10 Lessons</span>
                                        <span className="text-gray-600">Last: {course.lastAccessed}</span>
                                    </div>

                                    <div className="flex gap-3">
                                        <Link to={`/course/${course.id}`} className="flex-1">
                                            <button className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:opacity-90 transition-all font-bold text-sm shadow-[0_0_15px_rgba(6,182,212,0.2)] flex items-center justify-center gap-2">
                                                <Play size={16} fill="currentColor" />
                                                CONTINUE LEARNING
                                            </button>
                                        </Link>
                                        {course.progress === 100 && (
                                            <button className="px-5 py-2.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl hover:bg-green-500/20 transition-all font-bold text-sm flex items-center gap-2">
                                                <Award size={16} />
                                                CERTIFICATE
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Right Image Side */}
                                <div className="hidden md:flex md:w-48 lg:w-56 h-auto min-h-[160px] bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-2xl items-center justify-center border border-white/5 group-hover:border-cyan-500/20 transition-all">
                                    <BookOpen size={48} className="text-cyan-500/40 group-hover:text-cyan-400/60 transition-all" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

const StatCard = ({ icon: Icon, gradient, title, value }) => (
    <motion.div whileHover={{ scale: 1.02 }}
        className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 relative overflow-hidden"
    >
        <div className={`absolute top-0 right-0 w-20 h-20 rounded-full bg-gradient-to-br ${gradient} opacity-10 -mr-5 -mt-5`} />
        <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${gradient} mb-3`}>
            <Icon size={20} className="text-white" />
        </div>
        <p className="text-3xl font-bold text-white mb-1">{value}</p>
        <p className="text-sm text-gray-400">{title}</p>
    </motion.div>
);

export default MyLearning;
