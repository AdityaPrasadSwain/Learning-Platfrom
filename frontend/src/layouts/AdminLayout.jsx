import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, BookOpen, ShieldAlert,
    Settings, LogOut, Menu, X, FileQuestion, UserCheck
} from 'lucide-react';
import AdminNavbar from '../components/AdminNavbar';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const username = localStorage.getItem('username') || 'Admin';

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const navItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/users', icon: Users, label: 'User Management' },
        { path: '/admin/courses', icon: BookOpen, label: 'Course Management' },
        { path: '/admin/quizzes', icon: FileQuestion, label: 'Quizzes' },
        { path: '/admin/applications', icon: UserCheck, label: 'Teacher Applications' },
        { path: '/admin/audit-logs', icon: ShieldAlert, label: 'Audit Logs' },
        { path: '/admin/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="relative flex flex-col h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 overflow-hidden">
            <AdminNavbar />
            
            <div className="flex flex-1 overflow-hidden">

            {/* Sidebar */}
            <aside
                className={`relative z-20 flex flex-col border-r border-slate-200 dark:border-white/10 text-slate-900 dark:text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} hidden md:flex shrink-0 bg-white/50 dark:bg-slate-900/40 backdrop-blur-3xl`}
            >
                {/* Brand */}
                <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-white/10 shrink-0">
                        <span className="text-sm font-bold font-orbitron bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                            AdminPanel
                        </span>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors ml-auto"
                    >
                        {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                title={!isSidebarOpen ? item.label : undefined}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive
                                    ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30'
                                    : 'text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                <Icon size={19} className={isActive ? 'text-indigo-400' : ''} />
                                {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* User + Logout */}
                <div className="p-3 border-t border-slate-200 dark:border-white/10 space-y-1 shrink-0">
                    {isSidebarOpen && (
                        <div className="flex items-center gap-2 px-3 py-2 mb-1">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-sm font-bold shrink-0">
                                {username.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{username}</p>
                                <p className="text-xs text-gray-500">Administrator</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-400/10 transition-all"
                    >
                        <LogOut size={19} />
                        {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
                    </button>
                </div>
            </aside>

                {/* Main Content */}
                <div className="relative z-10 flex-1 flex flex-col overflow-hidden">

                {/* Mobile Header */}
                <header
                    className="p-4 md:hidden flex items-center justify-between border-b border-slate-200 dark:border-white/10 shrink-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl"
                >
                    <span className="text-base font-bold font-orbitron bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">AdminPanel</span>
                    <button className="p-2 text-slate-900 dark:text-white"><Menu size={22} /></button>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    <Outlet />
                </main>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
