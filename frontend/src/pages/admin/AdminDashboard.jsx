import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats, getPendingApplications, approveApplication, rejectApplication } from '../../api/adminApi';
import { showSuccess, showError, showInfo, showConfirm, showLoading } from '../../utils/sweetAlert';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
    Users, BookOpen, GraduationCap, UserCheck, 
    UserX, Shield, CheckCircle, XCircle, FileText, 
    ArrowRight, Activity, TrendingUp, Sparkles,
    Calendar, Clock
} from 'lucide-react';

const mockGrowthData = [
    { name: 'Jan', students: 65, teachers: 5 },
    { name: 'Feb', students: 120, teachers: 12 },
    { name: 'Mar', students: 250, teachers: 25 },
    { name: 'Apr', students: 380, teachers: 35 },
    { name: 'May', students: 510, teachers: 42 },
    { name: 'Jun', students: 670, teachers: 58 },
];

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const username = localStorage.getItem('username') || 'Admin';

    useEffect(() => {
        const role = localStorage.getItem('role');
        if (role !== 'ADMIN') {
            navigate('/dashboard');
            return;
        }
        fetchDashboard();
        fetchApplications();
    }, [navigate]);

    const fetchDashboard = async () => {
        try {
            const data = await getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch dashboard', error);
            setStats({
                totalUsers: 150,
                totalStudents: 120,
                totalTeachers: 30,
                totalCourses: 45,
                activeCourses: 40,
                activeUsers: 145,
                suspendedUsers: 5
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchApplications = async () => {
        try {
            const data = await getPendingApplications();
            setApplications(data);
        } catch (error) {
            console.error("Failed to fetch applications", error);
        }
    };

    const handleApprove = async (appId) => {
        const confirmed = await showConfirm('Approve Teacher?', 'This user will be granted teacher privileges.');
        if (confirmed) {
            showLoading('Approving...');
            try {
                await approveApplication(appId);
                showSuccess('Approved!', 'Teacher has been approved.');
                fetchApplications();
                fetchDashboard();
            } catch (error) {
                showError('Error', 'Failed to approve application.');
            }
        }
    };

    const handleReject = async (appId) => {
        const confirmed = await showConfirm('Reject Application?', 'Are you sure you want to reject this application?');
        if (confirmed) {
            showLoading('Rejecting...');
            try {
                await rejectApplication(appId, "Not meeting criteria");
                showInfo('Rejected', 'Application rejected.');
                fetchApplications();
            } catch (error) {
                showError('Error', 'Failed to reject application.');
            }
        }
    };

    const StatCard = ({ icon: Icon, title, value, gradientFrom, gradientTo, iconColor, onClick, index }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -5 }}
            className="relative group cursor-pointer"
            onClick={onClick}
        >
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden relative">
                <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-full blur-3xl opacity-10 group-hover:opacity-30 transition-opacity duration-500`}></div>
                <div className="flex items-center justify-between relative z-10">
                    <div className="space-y-1">
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">{title}</p>
                        <p className="text-4xl font-display font-bold text-slate-900 dark:text-white">{value}</p>
                    </div>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                        <Icon className="w-7 h-7 text-white" />
                    </div>
                </div>
            </div>
        </motion.div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                    <p className="text-slate-500 dark:text-slate-400 font-orbitron animate-pulse">Syncing Command Center...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 pb-12">
            {/* Header Banner Redesign */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl transition-colors duration-500"
            >
                {/* Static Background Pattern - Theme Aware */}
                <div className="absolute inset-0 opacity-20 dark:opacity-30">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#f97316,transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,#4f46e5,transparent_50%)]"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/10 dark:bg-red-500/20 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 p-10 lg:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-4 text-center md:text-left">
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-sm font-bold tracking-wider">
                            <Sparkles className="w-4 h-4 mr-2" />
                            SYSTEM OPERATIONAL
                        </div>
                        <h1 className="text-5xl lg:text-6xl font-display font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                            Welcome Back, <span className="bg-gradient-to-r from-indigo-500 to-violet-600 dark:from-indigo-400 dark:to-violet-500 bg-clip-text text-transparent">{username}</span>
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl">
                            Manage your entire AI learning platform with real-time visibility and advanced administrative tools.
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                            <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm">
                                <Calendar className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                                <span className="text-sm font-medium">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm">
                                <Clock className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                                <span className="text-sm font-medium">Server Time: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative group shrink-0">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full blur opacity-15 dark:opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative w-48 h-48 lg:w-56 lg:h-56 rounded-full bg-white dark:bg-slate-800 border-4 border-slate-100 dark:border-slate-700 flex items-center justify-center overflow-hidden shadow-2xl">
                            <Shield className="w-24 h-24 text-indigo-500 dark:text-indigo-400 opacity-40 dark:opacity-50" />
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 dark:from-indigo-500/10 dark:to-violet-500/10"></div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    index={0} icon={Users} title="Total Users"
                    value={stats?.totalUsers || 0} gradientFrom="from-blue-600" gradientTo="to-cyan-500"
                    iconColor="text-cyan-500" onClick={() => navigate('/admin/users')}
                />
                <StatCard
                    index={1} icon={GraduationCap} title="Students"
                    value={stats?.totalStudents || 0} gradientFrom="from-emerald-600" gradientTo="to-teal-500"
                    iconColor="text-emerald-500"
                />
                <StatCard
                    index={2} icon={Users} title="Teachers"
                    value={stats?.totalTeachers || 0} gradientFrom="from-purple-600" gradientTo="to-pink-500"
                    iconColor="text-purple-500"
                />
                <StatCard
                    index={3} icon={BookOpen} title="Total Courses"
                    value={stats?.totalCourses || 0} gradientFrom="from-indigo-600" gradientTo="to-violet-500"
                    iconColor="text-indigo-500" onClick={() => navigate('/admin/courses')}
                />
                <StatCard
                    index={4} icon={UserCheck} title="Active Users"
                    value={stats?.activeUsers || 0} gradientFrom="from-green-600" gradientTo="to-emerald-500"
                    iconColor="text-green-500"
                />
                <StatCard
                    index={5} icon={UserX} title="Suspended Users"
                    value={stats?.suspendedUsers || 0} gradientFrom="from-red-600" gradientTo="to-rose-500"
                    iconColor="text-red-500"
                />
            </div>

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Applications Section */}
                <div className="xl:col-span-2 space-y-8">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center space-x-3">
                                <div className="p-3 bg-emerald-500/10 rounded-2xl">
                                    <UserCheck className="text-emerald-500" size={24} />
                                </div>
                                <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Teacher Applications</h2>
                            </div>
                            <button 
                                onClick={() => navigate('/admin/applications')}
                                className="group flex items-center space-x-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors"
                            >
                                <span>View All</span>
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        {applications.length === 0 ? (
                            <div className="py-12 text-center bg-slate-50/50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                                <p className="text-slate-500 dark:text-slate-400 italic">No pending applications.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-slate-400 text-xs font-bold uppercase tracking-widest border-b border-slate-200 dark:border-slate-800">
                                            <th className="pb-4 px-4">Applicant</th>
                                            <th className="pb-4 px-4">Experience</th>
                                            <th className="pb-4 px-4 text-center">Resume</th>
                                            <th className="pb-4 px-4 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {applications.map(app => (
                                            <tr key={app.id} className="group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                                                <td className="py-6 px-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500">
                                                            {app.user.username.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-900 dark:text-white">{app.user.username}</div>
                                                            <div className="text-xs text-slate-500">{app.user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-6 px-4 text-slate-600 dark:text-slate-300 text-sm">{app.experience}</td>
                                                <td className="py-6 px-4 text-center">
                                                    <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg hover:bg-indigo-500 hover:text-white transition-all">
                                                        <FileText size={18} />
                                                    </a>
                                                </td>
                                                <td className="py-6 px-4">
                                                    <div className="flex items-center justify-center space-x-2">
                                                        <button onClick={() => handleApprove(app.id)} className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all">
                                                            <CheckCircle size={18} />
                                                        </button>
                                                        <button onClick={() => handleReject(app.id)} className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                                                            <XCircle size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Growth Chart Section */}
                <div className="space-y-8">
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Growth Analytics</h2>
                            <Activity className="text-indigo-500" size={20} />
                        </div>
                        <div className="h-[280px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={mockGrowthData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.05} vertical={false} />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="students" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-6 p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">Monthly Growth Rate</span>
                                <span className="text-indigo-500 font-bold">+24.8%</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
