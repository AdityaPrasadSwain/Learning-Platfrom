import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, User, Search, Filter, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllCourses } from '../api/courseApi';
import { enrollInCourse, isEnrolled } from '../api/enrollmentApi';
import { showSuccess, showError, showLoading } from '../utils/sweetAlert';
import Swal from 'sweetalert2';
import Navbar from '../components/Navbar';

import Footer from '../components/Footer';


const Courses = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const role = localStorage.getItem('role');
    const isStudent = role === 'STUDENT';

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const data = await getAllCourses();

            // Check enrollment status for students
            if (isStudent) {
                const coursesWithEnrollment = await Promise.all(
                    data.map(async (course) => {
                        try {
                            const enrolled = await isEnrolled(course.id);
                            return { ...course, isEnrolled: enrolled };
                        } catch {
                            return { ...course, isEnrolled: false };
                        }
                    })
                );
                setCourses(coursesWithEnrollment);
            } else {
                setCourses(data);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async (e, courseId, courseTitle) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isStudent) {
            showError('Login Required', 'Please login as a student to enroll in courses');
            navigate('/login');
            return;
        }

        showLoading('Enrolling...');
        try {
            await enrollInCourse(courseId);
            Swal.close();
            // Show success message briefly then navigate
            Swal.fire({
                icon: 'success',
                title: 'Enrolled!',
                text: `You have been enrolled in ${courseTitle}`,
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                navigate(`/payment/${courseId}`);
            });
        } catch (error) {
            console.error('Error enrolling:', error);
            Swal.close();
            showError('Enrollment Failed', error.response?.data?.message || 'Failed to enroll in course');
        }
    };

    // Get unique categories
    const categories = ['All', ...new Set(courses.map(course => course.category))];

    // Filter courses
    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white relative overflow-hidden flex items-center justify-center transition-colors duration-300">

                <Navbar />
                <div className="text-2xl">Loading courses...</div>
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
                    className="mb-12 text-center"
                >
                    <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 dark:from-purple-400 dark:via-pink-500 dark:to-cyan-500">
                        Explore Courses
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Discover amazing courses and start your learning journey
                    </p>
                </motion.div>

                {/* Search and Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8 flex flex-col md:flex-row gap-4"
                >
                    {/* Search Bar */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-purple-400 z-10 pointer-events-none" size={20} />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200 dark:border-purple-500/30 rounded-xl pl-12 pr-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors relative z-0 shadow-sm dark:shadow-none"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="w-full md:w-auto min-w-[180px]">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full bg-white dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200 dark:border-purple-500/30 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors shadow-sm dark:shadow-none"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </motion.div>

                {/* Results Count */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6 text-gray-400"
                >
                    Found {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
                </motion.div>

                {/* Courses Grid */}
                {filteredCourses.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <BookOpen size={64} className="mx-auto mb-4 text-gray-600" />
                        <h2 className="text-2xl font-bold mb-2">No courses found</h2>
                        <p className="text-gray-400">Try adjusting your search or filters</p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map((course, index) => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link to={`/course/${course.id}`}>
                                    <div className="bg-white dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden hover:border-purple-500/50 transition-all hover:scale-105 cursor-pointer h-full shadow-lg dark:shadow-none">
                                        {/* Course Header */}
                                        <div className="h-40 bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                                            <BookOpen size={48} className="text-purple-600 dark:text-purple-400" />
                                        </div>

                                        {/* Course Content */}
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-3">
                                                <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 rounded-full text-sm font-medium">
                                                    {course.category}
                                                </span>
                                                {course.isPublished && (
                                                    <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-300 rounded-full text-sm font-medium">
                                                        Published
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="text-xl font-bold mb-2 line-clamp-2 text-slate-900 dark:text-white">
                                                {course.title}
                                            </h3>

                                            <p className="text-slate-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                                                {course.description}
                                            </p>

                                            <div className="flex items-center justify-between text-sm text-slate-500 dark:text-gray-500 mb-4 pt-4 border-t border-gray-100 dark:border-white/10">
                                                <div className="flex items-center gap-2">
                                                    <User size={16} />
                                                    <span>{course.instructorName || 'Instructor'}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock size={16} />
                                                    <span>{course.duration} min</span>
                                                </div>
                                            </div>

                                            {/* Enrollment Button for Students */}
                                            {isStudent && (
                                                <div onClick={(e) => e.preventDefault()}>
                                                    {course.isEnrolled ? (
                                                        <div className="flex items-center justify-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-300 rounded-lg border border-green-200 dark:border-green-500/30">
                                                            <CheckCircle size={18} />
                                                            <span className="font-medium">Enrolled</span>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={(e) => handleEnroll(e, course.id, course.title)}
                                                            className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium shadow-md shadow-purple-500/20"
                                                        >
                                                            Enroll Now
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Courses;
