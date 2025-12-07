import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    PlusCircle,
    LogOut,
    Menu,
    X,
    Video
} from 'lucide-react';
import ThreeBackground from '../components/ThreeBackground';

const TeacherLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const navItems = [
        { path: '/teacher/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/teacher/my-courses', icon: BookOpen, label: 'My Courses' },
        { path: '/teacher/create-course', icon: PlusCircle, label: 'Create Course' },
    ];

    return (
        <div className="relative flex h-screen">
            <ThreeBackground />

            {/* Sidebar */}
            <aside
                className={`relative z-20 glass-panel border-r border-white/10 text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'
                    } hidden md:flex flex-col`}
            >
                <div className="p-4 flex items-center justify-between border-b border-white/10">
                    {isSidebarOpen && <span className="text-xl font-bold font-orbitron text-neon-purple neon-text">TeacherPanel</span>}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-2 px-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={`flex items-center p-3 rounded-lg transition-all ${isActive
                                            ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple neon-border'
                                            : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                            }`}
                                    >
                                        <Icon size={20} />
                                        {isSidebarOpen && <span className="ml-3">{item.label}</span>}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full p-3 rounded-lg text-red-400 hover:bg-white/10 transition-colors"
                    >
                        <LogOut size={20} />
                        {isSidebarOpen && <span className="ml-3">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header */}
                <header className="glass-panel shadow-sm p-4 md:hidden flex items-center justify-between border-b border-white/10">
                    <span className="text-xl font-bold font-orbitron text-neon-purple neon-text">TeacherPanel</span>
                    <button className="p-2 text-white">
                        <Menu size={24} />
                    </button>
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
