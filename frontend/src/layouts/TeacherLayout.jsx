import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, BookOpen, PlusCircle, LogOut, Menu, X,
    Video, FileQuestion, UserCircle, CalendarCheck, Upload, BarChart2
} from 'lucide-react';
import ThreeBackground from '../components/ThreeBackground';
import Navbar from '../components/Navbar';

const TeacherLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const username = localStorage.getItem('username') || 'Teacher';

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const navItems = [
        { path: '/teacher/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/teacher/my-courses', icon: BookOpen, label: 'My Courses' },
        { path: '/teacher/create-course', icon: PlusCircle, label: 'Create Course' },
        { path: '/teacher/upload', icon: Upload, label: 'Upload Video' },
        { path: '/teacher/quizzes', icon: FileQuestion, label: 'My Quizzes' },
        { path: '/teacher/live-class', icon: Video, label: 'Live Classes' },
        { path: '/teacher/profile', icon: UserCircle, label: 'My Profile' },
    ];

    return (
        <div className="relative flex h-screen">
            <ThreeBackground />

            {/* Sidebar */}
            <aside className={`relative z-20 flex flex-col border-r border-white/10 text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} hidden md:flex`}
                style={{ background: 'rgba(10,10,20,0.85)', backdropFilter: 'blur(20px)' }}>

                {/* Logo / Brand */}
                <div className="p-4 flex items-center justify-between border-b border-white/10 shrink-0">
                    {isSidebarOpen && (
                        <span className="text-base font-bold font-orbitron bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                            TeacherPanel
                        </span>
                    )}
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors ml-auto">
                        {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                        return (
                            <Link key={item.path} to={item.path}
                                title={!isSidebarOpen ? item.label : undefined}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive
                                    ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}>
                                <Icon size={19} className={isActive ? 'text-purple-400' : ''} />
                                {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* User + Logout */}
                <div className="p-3 border-t border-white/10 space-y-1 shrink-0">
                    {isSidebarOpen && (
                        <div className="flex items-center gap-2 px-3 py-2 mb-1">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold shrink-0">
                                {username.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-white truncate">{username}</p>
                                <p className="text-xs text-gray-500">Teacher</p>
                            </div>
                        </div>
                    )}
                    <button onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-400/10 transition-all">
                        <LogOut size={19} />
                        {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
                <Navbar />
                {/* Mobile Header */}
                <header className="p-4 md:hidden flex items-center justify-between border-b border-white/10"
                    style={{ background: 'rgba(10,10,20,0.85)', backdropFilter: 'blur(20px)' }}>
                    <span className="text-lg font-bold font-orbitron bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">TeacherPanel</span>
                    <button className="p-2 text-white"><Menu size={22} /></button>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default TeacherLayout;

