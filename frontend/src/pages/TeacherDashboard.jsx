import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Upload, Play, Video, BookOpen, Users, Plus, 
    FileQuestion, TrendingUp, ArrowRight, FileText, 
    Zap, Award, Clock, ChevronRight, Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getTeacherVideos } from '../api/videoApi';
import api from '../services/api';

const TeacherDashboard = () => {
    const [stats, setStats] = useState({ totalVideos: 0, totalViews: 0, totalCourses: 0, totalStudents: 0 });
    const [recentContent, setRecentContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const teacherId = localStorage.getItem('userId');
    const username = localStorage.getItem('username') || 'Teacher';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const videos = await getTeacherVideos(teacherId);
                setRecentContent(videos?.slice(0, 3) || []);
                
                let courses = [];
                let totalStudents = 0;
                try {
                    const coursesRes = await api.get('/courses/teacher/my-courses');
                    courses = coursesRes.data || [];
                    totalStudents = courses.reduce((sum, course) => sum + (course.enrollmentCount || 0), 0);
                } catch (e) { courses = []; }
                
                setStats({
                    totalVideos: videos?.length || 0,
                    totalViews: videos?.reduce((sum, v) => sum + (v.views || 0), 0) || 0,
                    totalCourses: courses.length,
                    totalStudents
                });
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        if (teacherId) fetchData();
    }, [teacherId]);

    const statCards = [
        { 
            icon: Video, 
            label: 'Total Library', 
            value: stats.totalVideos, 
            unit: 'Videos',
            color: 'from-indigo-500 to-blue-600', 
            glow: 'rgba(99,102,241,0.3)',
            trend: '+12% this month'
        },
        { 
            icon: BookOpen, 
            label: 'Active Path', 
            value: stats.totalCourses, 
            unit: 'Courses',
            color: 'from-purple-500 to-indigo-600', 
            glow: 'rgba(168,85,247,0.3)',
            trend: 'Stable'
        },
        { 
            icon: Users, 
            label: 'Total Learners', 
            value: stats.totalStudents, 
            unit: 'Students',
            color: 'from-cyan-500 to-blue-600', 
            glow: 'rgba(6,182,212,0.3)',
            trend: '+5.4% new'
        },
        { 
            icon: Activity, 
            label: 'Global Reach', 
            value: stats.totalViews > 1000 ? (stats.totalViews / 1000).toFixed(1) + 'k' : stats.totalViews, 
            unit: 'Views',
            color: 'from-emerald-500 to-teal-600', 
            glow: 'rgba(16,185,129,0.3)',
            trend: '+2.1k today'
        },
    ];

    const quickActions = [
        { to: '/teacher/upload', icon: Upload, label: 'Upload Module', desc: 'Deploy new video intelligence', gradient: 'from-indigo-600 to-blue-700' },
        { to: '/teacher/create-course', icon: Plus, label: 'Architect Course', desc: 'Design a new learning trajectory', gradient: 'from-purple-600 to-indigo-700' },
        { to: '/teacher/quizzes', icon: FileQuestion, label: 'Strategic Quiz', desc: 'Configure automated assessments', gradient: 'from-emerald-600 to-teal-700' },
        { to: '/teacher/assignments', icon: FileText, label: 'Mission Tasks', desc: 'Manage submissions & grading', gradient: 'from-cyan-600 to-blue-700' },
    ];

    if (loading) return null;

    return (
        <div className="space-y-10 pb-10">
            {/* High-Fidelity Hero Header */}
            <div className="relative group overflow-hidden p-10 rounded-[2.5rem] bg-slate-900 border border-white/5 shadow-2xl">
                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Award size={180} className="text-indigo-500 animate-float-slow" />
                </div>
                
                <div className="relative z-10 max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6"
                    >
                        <Zap size={14} />
                        Instructor Dashboard
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-display font-black text-white leading-tight"
                    >
                        Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">{username}</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 mt-6 text-lg leading-relaxed"
                    >
                        Your platform performance is optimal. You have <span className="text-white font-bold">{stats.totalVideos}</span> active modules delivering knowledge to <span className="text-white font-bold">{stats.totalStudents}</span> concurrent learners.
                    </motion.p>

                    <div className="flex flex-wrap gap-4 mt-10">
                        <Link to="/teacher/upload">
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/25 flex items-center gap-3 transition-all hover:bg-indigo-400"
                            >
                                <Upload size={20} />
                                New Content
                            </motion.button>
                        </Link>
                        <Link to="/teacher/live-class">
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl backdrop-blur-xl flex items-center gap-3 hover:bg-white/10 transition-all"
                            >
                                <Video size={20} className="text-indigo-400" />
                                Start Live Session
                            </motion.button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Core Metrics Engine */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, i) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="glass-panel p-8 relative group overflow-hidden border-indigo-500/5 hover:border-indigo-500/20 transition-all"
                    >
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity blur-2xl rounded-full translate-x-10 -translate-y-10`} />
                        
                        <div className="flex items-center justify-between mb-8">
                            <div className={`p-4 rounded-2xl bg-gradient-to-br ${card.color} text-white shadow-lg`}
                                style={{ boxShadow: `0 10px 25px ${card.glow}` }}>
                                <card.icon size={22} />
                            </div>
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter bg-emerald-500/10 px-2 py-1 rounded-md">
                                {card.trend}
                            </span>
                        </div>
                        
                        <div className="space-y-1">
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-black text-white leading-none">{card.value}</h3>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{card.unit}</span>
                            </div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{card.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Unified Command Grid */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Deployment Console</h2>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {quickActions.map((action, i) => (
                            <Link to={action.to} key={action.label}>
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="p-6 rounded-3xl bg-slate-900/50 border border-white/5 hover:border-indigo-500/30 transition-all group cursor-pointer"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.gradient} text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110`}>
                                            <action.icon size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{action.label}</h3>
                                            <p className="text-xs text-slate-500 font-medium mt-1">{action.desc}</p>
                                        </div>
                                        <ChevronRight size={18} className="text-slate-700 group-hover:text-white transition-colors group-hover:translate-x-1" />
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>

                    {/* Recent Intelligence Feed */}
                    <div className="pt-6">
                        <div className="flex items-center justify-between px-2 mb-6">
                            <h2 className="text-lg font-bold text-slate-300">Recent Publications</h2>
                            <Link to="/teacher/my-courses" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                                View Library <ArrowRight size={14} />
                            </Link>
                        </div>
                        
                        <div className="space-y-3">
                            {recentContent.length > 0 ? recentContent.map((item, idx) => (
                                <motion.div 
                                    key={idx}
                                    whileHover={{ x: 10 }}
                                    className="p-5 rounded-[1.5rem] bg-white/[0.02] border border-white/5 flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center overflow-hidden">
                                            <Play size={18} className="text-indigo-400 group-hover:scale-125 transition-transform" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white truncate max-w-[200px]">{item.title}</h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1 uppercase">
                                                    <Clock size={10} /> {new Date(item.createdAt).toLocaleDateString()}
                                                </span>
                                                <span className="text-[10px] font-bold text-indigo-500/80 uppercase">
                                                    {item.views || 0} Views
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-8 w-px bg-white/5 hidden sm:block"></div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase ${item.status === 'PUBLISHED' ? 'text-emerald-500 bg-emerald-500/10' : 'text-amber-500 bg-amber-500/10'}`}>
                                            {item.status || 'Active'}
                                        </span>
                                    </div>
                                </motion.div>
                            )) : (
                                <div className="p-10 rounded-[1.5rem] bg-white/[0.02] border border-dashed border-white/10 flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                                        <Activity size={20} className="text-slate-600" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-500">No recent deployments found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Live Activity & Notifications */}
                <div className="space-y-8">
                    <div className="glass-panel p-8 border-indigo-500/5 min-h-full">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Live Course Activity</h2>
                        </div>
                        
                        <div className="relative pl-6 space-y-10 border-l border-white/5">
                            {[
                                { user: 'Alice Smith', action: 'completed', target: 'Quantum Mechanics Quiz', time: '2m ago', color: 'bg-emerald-500' },
                                { user: 'Bob Johnson', action: 'enrolled in', target: 'Advanced React Architecture', time: '14m ago', color: 'bg-blue-500' },
                                { user: 'Charlie Davis', action: 'commented on', target: 'Module 4: Performance', time: '1h ago', color: 'bg-amber-500' },
                                { user: 'Diana Prince', action: 'submitted', target: 'Strategic Final Assignment', time: '3h ago', color: 'bg-purple-500' }
                            ].map((activity, idx) => (
                                <div key={idx} className="relative">
                                    <div className={`absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-slate-950 ${activity.color}`}></div>
                                    <div>
                                        <p className="text-sm text-slate-300">
                                            <span className="font-bold text-white">{activity.user}</span> {activity.action}
                                        </p>
                                        <p className="text-xs font-bold text-indigo-400 mt-1">{activity.target}</p>
                                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block mt-2">{activity.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full mt-10 py-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-slate-400 hover:text-white hover:bg-white/10 transition-all uppercase tracking-[0.2em]"
                        >
                            View All Intelligence
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
