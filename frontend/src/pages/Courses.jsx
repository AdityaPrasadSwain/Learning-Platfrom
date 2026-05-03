import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, User, Search, Filter, CheckCircle, GraduationCap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllCourses } from '../api/courseApi';
import { enrollInCourse, isEnrolled } from '../api/enrollmentApi';
import { showSuccess, showError, showLoading } from '../utils/sweetAlert';
import Swal from 'sweetalert2';

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

    const categories = ['All', ...new Set(courses.map(course => course.category).filter(Boolean))];

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 text-white">
                <div className="text-xl font-orbitron animate-pulse text-cyan-400">Loading catalog...</div>
            </div>
        );
    }

    return (
        <div className="text-white">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-3xl font-bold font-orbitron">Explore <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Courses</span></h1>
                <p className="text-gray-400 mt-1">Discover premium educational content and start your journey.</p>
            </motion.div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input type="text" placeholder="Search courses..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-all" />
                </div>
                <div className="modern-dropdown w-full md:w-48">
                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

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
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                    <BookOpen size={56} className="mx-auto mb-4 text-gray-600" />
                    <h2 className="text-xl font-bold mb-2">No courses found</h2>
                    <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredCourses.map((course, index) => (
                        <motion.div key={course.id}
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link to={`/course/${course.id}`}>
                                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:border-cyan-500/40 transition-all group h-full">
                                    <div className="h-40 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-cyan-500/10" />
                                        <GraduationCap size={48} className="text-cyan-400 relative z-10 group-hover:scale-110 transition-transform" />
                                    </div>

                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-3">
                                            <span className="inline-block px-2.5 py-0.5 bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 rounded-full text-[10px] font-bold">
                                                {course.category?.toUpperCase() || 'GENERAL'}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold mb-2 line-clamp-1 text-white group-hover:text-cyan-400 transition-colors">
                                            {course.title}
                                        </h3>

                                        <p className="text-gray-400 text-sm mb-4 line-clamp-2 h-10">
                                            {course.description || 'Master the essential skills in this comprehensive course.'}
                                        </p>

                                        <div className="flex items-center justify-between text-[11px] text-gray-500 mb-5 pt-4 border-t border-white/5">
                                            <div className="flex items-center gap-1.5">
                                                <User size={13} />
                                                <span>{course.instructorName || 'Instructor'}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={13} />
                                                <span>{course.duration}m</span>
                                            </div>
                                        </div>

                                        {isStudent && (
                                            <div onClick={(e) => e.preventDefault()}>
                                                {course.isEnrolled ? (
                                                    <div className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 rounded-xl border border-green-500/20 text-xs font-bold">
                                                        <CheckCircle size={14} />
                                                        <span>ENROLLED</span>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={(e) => handleEnroll(e, course.id, course.title)}
                                                        className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:opacity-90 transition-all font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                                                    >
                                                        ENROLL NOW
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
        </div>
    );
};

export default Courses;
