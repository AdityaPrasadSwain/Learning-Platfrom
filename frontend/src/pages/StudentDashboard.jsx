import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Play, Clock, Award, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ThreeBackground from '../components/ThreeBackground';

import Footer from '../components/Footer';
import { getAllCourses } from '../api/courseApi';
import { enrollInCourse, isEnrolled } from '../api/enrollmentApi';
import { showError, showSuccess, showLoading } from '../utils/sweetAlert';
import Swal from 'sweetalert2';


const StudentDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const username = localStorage.getItem('username') || 'Student';

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const data = await getAllCourses();
            const publishedCourses = data.filter(course => course.isPublished);

            const coursesWithEnrollment = await Promise.all(
                publishedCourses.map(async (course) => {
                    try {
                        const enrolled = await isEnrolled(course.id);
                        return { ...course, isEnrolled: enrolled };
                    } catch {
                        return { ...course, isEnrolled: false };
                    }
                })
            );

            setCourses(coursesWithEnrollment);
        } catch (error) {
            console.error('Error fetching courses:', error);
            showError('Error', 'Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async (courseId, courseTitle) => {
        showLoading('Enrolling...');
        try {
            await enrollInCourse(courseId);
            Swal.close();
            await showSuccess('Enrolled!', `You have been enrolled in ${courseTitle}`);
            fetchCourses();
        } catch (error) {
            console.error('Error enrolling:', error);
            Swal.close();
            showError('Enrollment Failed', error.response?.data?.message || 'Failed to enroll in course');
        }
    };

    const categories = ['All', ...new Set(courses.map(course => course.category))];

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const stats = {
        totalCourses: courses.length,
        completedCourses: 0,
        inProgress: 0,
        certificates: 0
    };

    if (loading) {
        return (
            <div className="min-h-screen text-gray-900 dark:text-white relative overflow-hidden flex items-center justify-center">
                <div className="text-2xl">Loading courses...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-gray-900 dark:text-white relative overflow-hidden flex flex-col transition-colors duration-300">
            <ThreeBackground />
            <Navbar />

            <main className="container mx-auto px-6 pt-32 pb-12 flex-1 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl font-bold mb-4">Welcome back, {username}!</h1>
                    <p className="text-gray-600 dark:text-gray-400">Continue your learning journey and explore new courses.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard icon={BookOpen} color="text-blue-600 dark:text-blue-400" bg="bg-blue-100 dark:bg-blue-500/20" title="Available Courses" value={stats.totalCourses} />
                    <StatCard icon={Play} color="text-green-600 dark:text-green-400" bg="bg-green-100 dark:bg-green-500/20" title="In Progress" value={stats.inProgress} />
                    <StatCard icon={Award} color="text-yellow-600 dark:text-yellow-400" bg="bg-yellow-100 dark:bg-yellow-500/20" title="Completed" value={stats.completedCourses} />
                    <StatCard icon={Clock} color="text-purple-600 dark:text-purple-400" bg="bg-purple-100 dark:bg-purple-500/20" title="Certificates" value={stats.certificates} />
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 shadow-sm"
                        />
                    </div>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 shadow-sm"
                    >
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>

                {filteredCourses.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <BookOpen size={64} className="mx-auto mb-4 text-gray-600" />
                        <h3 className="text-2xl font-bold mb-2">No courses found</h3>
                        <p className="text-gray-400">
                            {searchTerm || selectedCategory !== 'All'
                                ? 'Try adjusting your search or filter criteria'
                                : 'No courses are available at the moment'}
                        </p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map((course, index) => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden hover:border-blue-500/50 transition-all group shadow-lg dark:shadow-none"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                                {course.title}
                                            </h3>
                                            <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 rounded-full text-sm font-medium">
                                                {course.category}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-slate-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                                        {course.description}
                                    </p>

                                    <div className="flex items-center justify-between text-sm text-slate-500 dark:text-gray-500 mb-4 pt-4 border-t border-gray-100 dark:border-white/10">
                                        <span className="flex items-center">
                                            <Clock size={16} className="mr-1" />
                                            {course.duration} min
                                        </span>
                                        <span className="text-slate-500 dark:text-gray-400">
                                            By {course.instructorName}
                                        </span>
                                    </div>

                                    {course.isEnrolled ? (
                                        <Link to={`/course/${course.id}`}>
                                            <button className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-500 hover:to-emerald-500 transition-all transform hover:scale-105 font-medium shadow-md shadow-green-500/20">
                                                Continue Learning
                                            </button>
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={() => handleEnroll(course.id, course.title)}
                                            className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all transform hover:scale-105 font-medium shadow-md shadow-blue-500/20"
                                        >
                                            Enroll Now
                                        </button>
                                    )}
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
        className="bg-white dark:bg-gray-900/50 backdrop-blur-md p-6 rounded-2xl border border-gray-200 dark:border-white/10 shadow-lg dark:shadow-none"
    >
        <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 ${bg} rounded-lg ${color}`}>
                <Icon size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">{title}</h3>
        </div>
        <p className="text-4xl font-bold text-gray-900 dark:text-white">{value}</p>
    </motion.div>
);

export default StudentDashboard;