import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Play, Clock, Award, Search, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
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
            <div className="flex items-center justify-center h-64 text-white">
                <div className="text-xl font-orbitron animate-pulse text-cyan-400">Loading courses...</div>
            </div>
        );
    }

    return (
        <div className="text-white">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-3xl font-bold font-orbitron">Welcome back, <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">{username}!</span></h1>
                <p className="text-gray-400 mt-1">Continue your learning journey and explore new courses.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <StatCard icon={BookOpen} gradient="from-cyan-500 to-blue-600" title="Available Courses" value={stats.totalCourses} />
                <StatCard icon={Play} gradient="from-green-400 to-emerald-600" title="In Progress" value={stats.inProgress} />
                <StatCard icon={Award} gradient="from-yellow-400 to-orange-500" title="Completed" value={stats.completedCourses} />
                <StatCard icon={GraduationCap} gradient="from-purple-500 to-pink-500" title="Certificates" value={stats.certificates} />
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search courses..."
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-all" />
                </div>
                <div className="modern-dropdown w-full md:w-48">
                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>
            </div>

            {filteredCourses.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                    <BookOpen size={56} className="mx-auto mb-4 text-gray-600" />
                    <h3 className="text-xl font-bold mb-2 text-white">No courses found</h3>
                    <p className="text-gray-400 text-sm">
                        {searchTerm || selectedCategory !== 'All' ? 'Try adjusting your search or filter' : 'No courses are available at the moment'}
                    </p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredCourses.map((course, index) => (
                        <motion.div key={course.id}
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.06 }}
                            className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:border-cyan-500/40 transition-all group"
                        >
                            <div className="p-5">
                                <div className="mb-3">
                                    <h3 className="text-lg font-bold mb-1.5 text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                                        {course.title}
                                    </h3>
                                    <span className="inline-block px-2.5 py-0.5 bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 rounded-full text-xs font-medium">
                                        {course.category}
                                    </span>
                                </div>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-3">{course.description}</p>
                                <div className="flex items-center justify-between text-xs text-gray-500 mb-4 pt-3 border-t border-white/5">
                                    <span className="flex items-center gap-1"><Clock size={13} /> {course.duration} min</span>
                                    <span>By {course.instructorName}</span>
                                </div>
                                {course.isEnrolled ? (
                                    <Link to={`/course/${course.id}`}>
                                        <button className="w-full py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:opacity-90 transition-all font-semibold text-sm shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                            Continue Learning
                                        </button>
                                    </Link>
                                ) : (
                                    <button onClick={() => handleEnroll(course.id, course.title)}
                                        className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:opacity-90 transition-all font-semibold text-sm shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                                        Enroll Now
                                    </button>
                                )}
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

export default StudentDashboard;
