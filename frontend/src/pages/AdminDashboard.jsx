import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ThreeBackground from '../components/ThreeBackground';
import { getDashboardStats } from '../api/adminApi';
import { showError } from '../utils/sweetAlert';
import { Users, BookOpen, GraduationCap, UserCheck, UserX, Shield } from 'lucide-react';

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

    const StatCard = ({ icon: Icon, title, value, color, onClick }) => (
        <div
            className={`bg-white dark:bg-gray-900/50 backdrop-blur-md border border-gray-200 dark:border-white/10 p-6 border-l-4 ${color} cursor-pointer hover:scale-105 transition-transform rounded-xl shadow-lg dark:shadow-none`}
            onClick={onClick}
            role="button"
            tabIndex={0}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
                </div>
                <Icon className="w-12 h-12 opacity-50 dark:text-white text-gray-700" />
            </div>
        </div>
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
        <div className="relative min-h-screen bg-ai-soft dark:bg-ai-base transition-colors duration-300">
            {/* Background Blobs - subtle availability */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[100px] animate-pulse-soft" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-secondary/10 rounded-full blur-[100px] animate-pulse-soft delay-1000" />
            </div>

            <Navbar />

            <div className="relative z-10 pt-24 px-6 max-w-7xl mx-auto">
                <div className="glass-panel p-8 mb-8 animate-float-slow">
                    <div className="flex items-center space-x-3 mb-2">
                        <Shield className="w-8 h-8 text-brand-accent" />
                        <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white">Admin Control Center</h1>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">Manage your AI learning platform</p>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <StatCard
                        icon={Users}
                        title="Total Users"
                        value={stats?.totalUsers || 0}
                        color="border-brand-secondary"
                        onClick={() => navigate('/admin/users')}
                    />
                    <StatCard
                        icon={GraduationCap}
                        title="Students"
                        value={stats?.totalStudents || 0}
                        color="border-brand-primary"
                    />
                    <StatCard
                        icon={Users}
                        title="Teachers"
                        value={stats?.totalTeachers || 0}
                        color="border-blue-500"
                    />
                    <StatCard
                        icon={BookOpen}
                        title="Total Courses"
                        value={stats?.totalCourses || 0}
                        color="border-brand-accent"
                        onClick={() => navigate('/admin/courses')}
                    />
                    <StatCard
                        icon={UserCheck}
                        title="Active Users"
                        value={stats?.activeUsers || 0}
                        color="border-green-500"
                    />
                    <StatCard
                        icon={UserX}
                        title="Suspended Users"
                        value={stats?.suspendedUsers || 0}
                        color="border-red-500"
                    />
                </div>

                {/* Quick Actions */}
                <div className="glass-panel p-8">
                    <h2 className="text-2xl font-display font-bold mb-6 text-slate-900 dark:text-white">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={() => navigate('/admin/users')}
                            className="bg-brand-secondary/10 hover:bg-brand-secondary/20 border border-brand-secondary/50 text-brand-secondary py-4 px-6 rounded-xl transition-all font-semibold"
                        >
                            Manage Users
                        </button>
                        <button
                            onClick={() => navigate('/admin/courses')}
                            className="bg-brand-primary/10 hover:bg-brand-primary/20 border border-brand-primary/50 text-brand-primary py-4 px-6 rounded-xl transition-all font-semibold"
                        >
                            Manage Courses
                        </button>

                        <button
                            onClick={() => navigate('/admin/audit-logs')}
                            className="bg-yellow-100 dark:bg-yellow-500/10 hover:bg-yellow-200 dark:hover:bg-yellow-500/20 border border-yellow-500/50 text-yellow-700 dark:text-yellow-500 py-4 px-6 rounded-xl transition-all font-semibold"
                        >
                            View Audit Logs
                        </button>
                        <button
                            onClick={() => navigate('/admin/applications')}
                            className="bg-brand-accent/10 hover:bg-brand-accent/20 border border-brand-accent/50 text-brand-accent py-4 px-6 rounded-xl transition-all font-semibold"
                        >
                            Teacher Applications
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
