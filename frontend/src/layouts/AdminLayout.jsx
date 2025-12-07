import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    FileText,
    Settings,
    LogOut,
    Menu,
    X,
    ShieldAlert
} from 'lucide-react';
import ThreeBackground from '../components/ThreeBackground';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        // TODO: Clear token and redirect
        localStorage.removeItem('token');
        navigate('/login');
    };

    const navItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/users', icon: Users, label: 'User Management' },
        { path: '/admin/courses', icon: BookOpen, label: 'Course Management' },
        { path: '/admin/audit-logs', icon: ShieldAlert, label: 'Audit Logs' },
        { path: '/admin/settings', icon: Settings, label: 'Settings' },
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
                    {isSidebarOpen && <span className="text-xl font-bold font-orbitron text-neon-blue neon-text">AdminPanel</span>}
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
                                            ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue neon-border'
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
                    <span className="text-xl font-bold font-orbitron text-neon-blue neon-text">AdminPanel</span>
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

export default AdminLayout;
