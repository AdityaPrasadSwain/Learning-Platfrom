import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { getDashboardStats } from '../api/adminApi';
import { showError } from '../utils/sweetAlert';
import { motion } from 'framer-motion';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { Users, BookOpen, GraduationCap, UserCheck, UserX, Shield } from 'lucide-react';

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
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem('role');
        if (role !== 'ADMIN') {
            navigate('/dashboard');
            return;
        }
        fetchDashboard();
    }, [navigate]);

    const fetchDashboard = async () => {
        try {
            const data = await getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch dashboard', error);
            showError('Error', 'Failed to load dashboard statistics');
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ icon: Icon, title, value, gradientFrom, gradientTo, iconColor, onClick, index }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5, type: 'spring', bounce: 0.4 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative group cursor-pointer"
            onClick={onClick}
            role="button"
            tabIndex={0}
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}></div>
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden relative">
                
                {/* Decorative background blob */}
                <div className={`absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>

                <div className="flex items-center justify-between relative z-10">
                    <div className="space-y-2">
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider">{title}</p>
                        <p className="text-5xl font-display font-bold text-slate-900 dark:text-white">{value}</p>
                    </div>
                    
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center p-0.5 transform group-hover:rotate-6 transition-transform duration-500 shadow-lg`}>
                        <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center">
                            <Icon className={`w-8 h-8 ${iconColor}`} />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    if (loading) {
        return (
            <div className="relative min-h-screen flex items-center justify-center bg-ai-soft dark:bg-ai-base">
                <div className="text-brand-primary text-xl font-display animate-pulse-soft">
                    Loading Admin Dashboard...
                </div>
            </div>
        );
    }

    return (
        <PageWrapper className="pt-24 px-4 lg:px-8 max-w-[1600px] mx-auto pb-20 w-full">
            {/* Master Application Window Container */}
            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border border-white/50 dark:border-white/10 rounded-[2.5rem] p-6 lg:p-12 shadow-2xl relative overflow-hidden">
                
                {/* Decorative background blobs for the master container */}
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-brand-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-brand-secondary/20 rounded-full blur-[120px] pointer-events-none"></div>

                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6"
                >
                    <div className="flex items-center space-x-6">
                        <div className="p-4 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl shadow-lg shadow-brand-primary/30 text-white">
                            <Shield className="w-10 h-10" />
                        </div>
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 dark:text-white tracking-tight">Admin Control Center</h1>
                            <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">Manage your entire AI learning platform with full visibility.</p>
                        </div>
                    </div>
                </motion.div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <StatCard
                    index={0}
                    icon={Users}
                    title="Total Users"
                    value={stats?.totalUsers || 0}
                    gradientFrom="from-blue-500"
                    gradientTo="to-cyan-400"
                    iconColor="text-cyan-500"
                    onClick={() => navigate('/admin/users')}
                />
                <StatCard
                    index={1}
                    icon={GraduationCap}
                    title="Students"
                    value={stats?.totalStudents || 0}
                    gradientFrom="from-emerald-500"
                    gradientTo="to-teal-400"
                    iconColor="text-emerald-500"
                />
                <StatCard
                    index={2}
                    icon={Users}
                    title="Teachers"
                    value={stats?.totalTeachers || 0}
                    gradientFrom="from-purple-500"
                    gradientTo="to-pink-400"
                    iconColor="text-purple-500"
                />
                <StatCard
                    index={3}
                    icon={BookOpen}
                    title="Total Courses"
                    value={stats?.totalCourses || 0}
                    gradientFrom="from-amber-500"
                    gradientTo="to-orange-400"
                    iconColor="text-orange-500"
                    onClick={() => navigate('/admin/courses')}
                />
                <StatCard
                    index={4}
                    icon={UserCheck}
                    title="Active Users"
                    value={stats?.activeUsers || 0}
                    gradientFrom="from-green-500"
                    gradientTo="to-emerald-400"
                    iconColor="text-green-500"
                />
                <StatCard
                    index={5}
                    icon={UserX}
                    title="Suspended Users"
                    value={stats?.suspendedUsers || 0}
                    gradientFrom="from-red-500"
                    gradientTo="to-rose-400"
                    iconColor="text-red-500"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Growth Chart */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-lg relative overflow-hidden"
                >
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none"></div>
                    <h2 className="text-2xl font-display font-bold mb-8 text-slate-900 dark:text-white relative z-10">User Growth</h2>
                    <div className="h-[320px] w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorTeachers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.05} vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                                    itemStyle={{ color: '#e2e8f0' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                                <Area type="monotone" dataKey="students" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" name="Students" />
                                <Area type="monotone" dataKey="teachers" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorTeachers)" name="Teachers" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Distribution Chart */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-lg relative overflow-hidden"
                >
                    <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    <h2 className="text-2xl font-display font-bold mb-8 text-slate-900 dark:text-white relative z-10">User Distribution</h2>
                    <div className="h-[320px] w-full flex justify-center items-center relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Students', value: stats?.totalStudents || 400 },
                                        { name: 'Teachers', value: stats?.totalTeachers || 50 },
                                        { name: 'Admins', value: Math.max(0, (stats?.totalUsers || 455) - (stats?.totalStudents || 400) - (stats?.totalTeachers || 50)) }
                                    ]}
                                    cx="50%"
                                    cy="45%"
                                    innerRadius={70}
                                    outerRadius={110}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                    cornerRadius={8}
                                >
                                    {[
                                        { name: 'Students', color: '#8b5cf6' },
                                        { name: 'Teachers', color: '#06b6d4' },
                                        { name: 'Admins', color: '#f59e0b' }
                                    ].map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }} 
                                    itemStyle={{ color: '#e2e8f0' }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-lg relative overflow-hidden"
            >
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5 blur-3xl pointer-events-none"></div>
                
                <h2 className="text-2xl font-display font-bold mb-8 text-slate-900 dark:text-white relative z-10">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                    <button
                        onClick={() => navigate('/admin/users')}
                        className="group flex flex-col items-center justify-center p-6 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 rounded-2xl hover:bg-white dark:hover:bg-slate-800 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 relative z-10"
                    >
                        <div className="w-14 h-14 bg-cyan-500/10 text-cyan-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300">
                            <Users size={28} />
                        </div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300 group-hover:text-cyan-500 transition-colors">Manage Users</span>
                    </button>
                    
                    <button
                        onClick={() => navigate('/admin/courses')}
                        className="group flex flex-col items-center justify-center p-6 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 rounded-2xl hover:bg-white dark:hover:bg-slate-800 hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 relative z-10"
                    >
                        <div className="w-14 h-14 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                            <BookOpen size={28} />
                        </div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300 group-hover:text-orange-500 transition-colors">Manage Courses</span>
                    </button>

                    <button
                        onClick={() => navigate('/admin/audit-logs')}
                        className="group flex flex-col items-center justify-center p-6 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 rounded-2xl hover:bg-white dark:hover:bg-slate-800 hover:border-yellow-500/50 hover:shadow-xl hover:shadow-yellow-500/10 transition-all duration-300 relative z-10"
                    >
                        <div className="w-14 h-14 bg-yellow-500/10 text-yellow-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-yellow-500 group-hover:text-white transition-all duration-300">
                            <Shield size={28} />
                        </div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300 group-hover:text-yellow-500 transition-colors">Audit Logs</span>
                    </button>

                    <button
                        onClick={() => navigate('/admin/applications')}
                        className="group flex flex-col items-center justify-center p-6 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 rounded-2xl hover:bg-white dark:hover:bg-slate-800 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 relative z-10"
                    >
                        <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                            <UserCheck size={28} />
                        </div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300 group-hover:text-emerald-500 transition-colors">Applications</span>
                    </button>
                </div>
            </motion.div>
            
            </div> {/* End Master Container */}
        </PageWrapper>
    );
};

export default AdminDashboard;
