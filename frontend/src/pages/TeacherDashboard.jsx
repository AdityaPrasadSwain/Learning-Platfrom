import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Play, Video, BookOpen, Users, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ThreeBackground from '../components/ThreeBackground';

import { getTeacherVideos } from '../api/videoApi';
import api from '../services/api';

const TeacherDashboard = () => {
    const [stats, setStats] = useState({
        totalVideos: 0,
        totalViews: 0,
        totalCourses: 0,
        totalStudents: 0
    });
    const teacherId = localStorage.getItem('id');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Teacher's Videos
                console.log("DEBUG: Fetching teacher videos for teacherId:", teacherId);
                const videos = await getTeacherVideos(teacherId);
                console.log("DEBUG: Videos fetched:", videos);

                // Fetch Teacher's Courses
                let courses = [];
                let totalStudents = 0;
                try {
                    console.log("DEBUG: Calling /courses/teacher/my-courses endpoint...");
                    const coursesRes = await api.get('/courses/teacher/my-courses');
                    console.log("DEBUG: API response received:", coursesRes);
                    console.log("DEBUG: API response data:", coursesRes.data);
                    courses = coursesRes.data || [];
                    console.log("DEBUG: Parsed courses:", courses);
                    
                    // Count total students enrolled across all teacher's courses
                    totalStudents = courses.reduce((sum, course) => {
                        console.log("DEBUG: Processing course:", course.id, "enrollment count:", course.enrollmentCount);
                        return sum + (course.enrollmentCount || 0);
                    }, 0);
                    console.log("DEBUG: Total students calculated:", totalStudents);
                } catch (e) {
                    console.error("ERROR: Could not fetch teacher courses:", e);
                    console.error("ERROR: Full error details:", e.response?.data || e.message);
                    courses = [];
                    totalStudents = 0;
                }

                console.log("DEBUG: Setting stats with courses:", courses.length, "students:", totalStudents);
                setStats({
                    totalVideos: videos?.length || 0,
                    totalViews: 0, // TODO: implement views tracking
                    totalCourses: courses.length,
                    totalStudents: totalStudents
                });
            } catch (error) {
                console.error("ERROR: Error fetching dashboard data:", error);
            }
        };
        
        if (teacherId) {
            fetchData();
        }
    }, [teacherId]);

    return (
        <div className="min-h-screen text-gray-900 dark:text-white relative overflow-hidden transition-colors duration-300">
            <ThreeBackground />
            <Navbar />

            <main className="container mx-auto px-6 pt-32 pb-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl font-bold mb-4">Welcome back, Teacher!</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage your courses, videos, and track performance.</p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard icon={Video} color="text-purple-600 dark:text-purple-400" bg="bg-purple-100 dark:bg-purple-500/20" title="Total Videos" value={stats.totalVideos} />
                    <StatCard icon={BookOpen} color="text-indigo-600 dark:text-indigo-400" bg="bg-indigo-100 dark:bg-indigo-500/20" title="Total Courses" value={stats.totalCourses} />
                    <StatCard icon={Users} color="text-emerald-600 dark:text-emerald-400" bg="bg-emerald-100 dark:bg-emerald-500/20" title="Total Students" value={stats.totalStudents} />
                    <StatCard icon={Play} color="text-blue-600 dark:text-blue-400" bg="bg-blue-100 dark:bg-blue-500/20" title="Total Views" value={stats.totalViews} />
                </div>

                {/* Quick Actions */}
                <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    <Link to="/teacher/upload">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-br from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 p-8 rounded-2xl border border-white/10 flex items-center justify-between cursor-pointer shadow-lg shadow-purple-500/20"
                        >
                            <div>
                                <h3 className="text-2xl font-bold mb-2 text-white">Upload Video</h3>
                                <p className="text-white/80">Share new content with your students</p>
                            </div>
                            <Upload size={48} className="text-white/90" />
                        </motion.div>
                    </Link>

                    <Link to="/teacher/create-course">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-br from-indigo-500 to-blue-500 dark:from-indigo-600 dark:to-blue-600 p-8 rounded-2xl border border-white/10 flex items-center justify-between cursor-pointer shadow-lg shadow-indigo-500/20"
                        >
                            <div>
                                <h3 className="text-2xl font-bold mb-2 text-white">Create Course</h3>
                                <p className="text-white/80">Build a new structured learning path</p>
                            </div>
                            <Plus size={48} className="text-white/90" />
                        </motion.div>
                    </Link>

                    <Link to="/teacher/my-courses">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-br from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600 p-8 rounded-2xl border border-white/10 flex items-center justify-between cursor-pointer shadow-lg shadow-emerald-500/20"
                        >
                            <div>
                                <h3 className="text-2xl font-bold mb-2 text-white">My Courses</h3>
                                <p className="text-white/80">View and manage your courses</p>
                            </div>
                            <BookOpen size={48} className="text-white/90" />
                        </motion.div>
                    </Link>
                </div>
            </main>
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

export default TeacherDashboard;
// Dashboard verified
