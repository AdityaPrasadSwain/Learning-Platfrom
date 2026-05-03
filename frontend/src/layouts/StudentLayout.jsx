import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, BookOpen, GraduationCap, Video,
    FileQuestion, LogOut, Menu, X, UserCircle, PlayCircle, FileText, Settings
} from 'lucide-react';
import StudentNavbar from '../components/StudentNavbar';

const StudentLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const username = localStorage.getItem('username') || 'Student';

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const navItems = [
        { path: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/courses', icon: BookOpen, label: 'All Courses' },
        { path: '/my-learning', icon: GraduationCap, label: 'My Learning' },
        { path: '/videos', icon: Video, label: 'Videos' },
        { path: '/student/quizzes', icon: FileQuestion, label: 'Quizzes' },
        { path: '/student/assignments', icon: FileText, label: 'Assignments' },
        { path: '/student/live-class', icon: PlayCircle, label: 'Live Classes' },
        { path: '/profile', icon: UserCircle, label: 'My Profile' },
        { path: '/student/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="relative flex flex-col h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
            <StudentNavbar />

            <div className="flex flex-1 overflow-hidden">

                {/* Sidebar */}
                <aside
                    className={`relative z-20 flex flex-col border-r border-slate-200 dark:border-white/10 text-slate-900 dark:text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} hidden md:flex shrink-0 bg-white/50 dark:bg-slate-900/40 backdrop-blur-3xl`}
                >
                    {/* Brand */}
                    <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-white/10 shrink-0">
                        {isSidebarOpen && (
                            <Link to="/student/dashboard" className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                                    <GraduationCap size={14} className="text-white" />
                                </div>
                                <span className="text-sm font-bold font-orbitron bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                    StudentHub
                                </span>
                            </Link>
                        )}
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
                                        ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30'
                                        : 'text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                >
                                    <Icon size={19} className={isActive ? 'text-cyan-400' : ''} />
                                    {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User + Logout */}
                    <div className="p-3 border-t border-slate-200 dark:border-white/10 space-y-1 shrink-0">
                        {isSidebarOpen && (
                            <div className="flex items-center gap-2 px-3 py-2 mb-1">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm font-bold shrink-0">
                                    {username.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{username}</p>
                                    <p className="text-xs text-gray-500">Student</p>
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
                        <span className="text-base font-bold font-orbitron bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">StudentHub</span>
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

export default StudentLayout;
