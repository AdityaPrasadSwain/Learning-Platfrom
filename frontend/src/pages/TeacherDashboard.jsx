import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Play, Video, BookOpen, Users, Plus, FileQuestion, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getTeacherVideos } from '../api/videoApi';
import api from '../services/api';

const TeacherDashboard = () => {
    const [stats, setStats] = useState({ totalVideos: 0, totalViews: 0, totalCourses: 0, totalStudents: 0 });
    const teacherId = localStorage.getItem('id');
    const username = localStorage.getItem('username') || 'Teacher';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const videos = await getTeacherVideos(teacherId);
                let courses = [];
                let totalStudents = 0;
                try {
                    const coursesRes = await api.get('/courses/teacher/my-courses');
                    courses = coursesRes.data || [];
                    totalStudents = courses.reduce((sum, course) => sum + (course.enrollmentCount || 0), 0);
                } catch (e) { courses = []; }
                setStats({
                    totalVideos: videos?.length || 0,
                    totalViews: 0,
                    totalCourses: courses.length,
                    totalStudents
                });
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };
        if (teacherId) fetchData();
    }, [teacherId]);

    const statCards = [
        { icon: Video, label: 'Total Videos', value: stats.totalVideos, color: 'from-purple-500 to-violet-600', glow: 'rgba(168,85,247,0.3)' },
        { icon: BookOpen, label: 'My Courses', value: stats.totalCourses, color: 'from-cyan-500 to-blue-600', glow: 'rgba(6,182,212,0.3)' },
        { icon: Users, label: 'Total Students', value: stats.totalStudents, color: 'from-emerald-500 to-teal-600', glow: 'rgba(16,185,129,0.3)' },
        { icon: TrendingUp, label: 'Total Views', value: stats.totalViews, color: 'from-orange-500 to-rose-600', glow: 'rgba(249,115,22,0.3)' },
    ];

    const quickActions = [
        { to: '/teacher/upload', icon: Upload, label: 'Upload Video', desc: 'Share new content with students', gradient: 'from-purple-600 to-pink-600', glow: 'rgba(168,85,247,0.35)' },
        { to: '/teacher/create-course', icon: Plus, label: 'Create Course', desc: 'Build a new learning path', gradient: 'from-cyan-600 to-blue-700', glow: 'rgba(6,182,212,0.35)' },
        { to: '/teacher/my-courses', icon: BookOpen, label: 'My Courses', desc: 'Manage existing courses', gradient: 'from-emerald-600 to-teal-700', glow: 'rgba(16,185,129,0.35)' },
        { to: '/teacher/quizzes', icon: FileQuestion, label: 'My Quizzes', desc: 'Create and manage assessments', gradient: 'from-orange-600 to-rose-600', glow: 'rgba(249,115,22,0.35)' },
        { to: '/teacher/live-class', icon: Video, label: 'Live Classes', desc: 'Start or view class sessions', gradient: 'from-violet-600 to-indigo-700', glow: 'rgba(124,58,237,0.35)' },
    ];

    return (
        <div className="text-white space-y-8">
            {/* Welcome Header */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-bold font-orbitron">
                    Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">{username}</span> 👋
                </h1>
                <p className="text-gray-400 mt-2">Here's a summary of your teaching activity.</p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card, i) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="glass-panel p-5 relative overflow-hidden group"
                    >
                        <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full bg-gradient-to-br ${card.color} opacity-10 group-hover:opacity-20 transition-opacity blur-xl`} />
                        <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} shadow-lg mb-4`}
                            style={{ boxShadow: `0 0 20px ${card.glow}` }}>
                            <card.icon size={20} className="text-white" />
                        </div>
                        <p className="text-4xl font-bold text-white">{card.value}</p>
                        <p className="text-gray-400 text-sm mt-1">{card.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-lg font-bold font-orbitron text-gray-300 mb-4 uppercase tracking-wider">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {quickActions.map((action, i) => (
                        <Link to={action.to} key={action.label}>
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + i * 0.07 }}
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className={`relative overflow-hidden bg-gradient-to-br ${action.gradient} p-6 rounded-2xl flex items-center justify-between cursor-pointer group`}
                                style={{ boxShadow: `0 8px 30px ${action.glow}` }}
                            >
                                <div>
                                    <h3 className="text-lg font-bold text-white">{action.label}</h3>
                                    <p className="text-white/70 text-sm mt-0.5">{action.desc}</p>
                                </div>
                                <div className="flex items-center gap-1 text-white/80 group-hover:translate-x-1 transition-transform">
                                    <action.icon size={32} className="opacity-90" />
                                </div>
                                {/* Subtle shine effect */}
                                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
