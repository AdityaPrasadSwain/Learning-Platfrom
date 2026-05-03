import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, User, Activity } from 'lucide-react';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import api from '../services/api';

// Simplified navbar for teachers in registration/approval phase
const TeacherRegistrationNavbar = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState(null);
    const username = localStorage.getItem('username') || 'Teacher';

    useEffect(() => {
        const fetchStatus = async () => {
            const userId = localStorage.getItem('userId');
            if (userId) {
                try {
                    const response = await api.get('/teacher/application-status', { params: { userId } });
                    setStatus(response.data);
                } catch (error) {
                    console.error("Failed to fetch status", error);
                }
            }
        };
        fetchStatus();
    }, []);

    const getStatusColor = (s) => {
        const appStatus = s?.status || s;
        if (appStatus === 'APPROVED') return 'text-green-400 border-green-400';
        if (appStatus === 'REJECTED') return 'text-red-400 border-red-400';
        return 'text-yellow-400 border-yellow-400';
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 w-full bg-white/80 dark:bg-black/30 backdrop-blur-md border-b border-gray-200 dark:border-white/10 z-50 px-6 py-4 transition-colors duration-300"
        >
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="flex items-center gap-3">
                    <Logo size={36} />
                    <div className="flex flex-col">
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                            Teacher Portal
                        </span>
                        <span className="text-xs text-gray-400">Application Status</span>
                    </div>
                </Link>

                <div className="flex items-center gap-4">
                    {status && (
                        <div className={`hidden sm:flex px-3 py-1 rounded-full border ${getStatusColor(status)} bg-opacity-10 bg-white dark:bg-opacity-10 flex items-center gap-2`}>
                            <Activity size={14} />
                            <span className="text-xs font-bold">{status.status}</span>
                        </div>
                    )}
                    <ThemeToggle />
                    <Link to="/profile" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-colors text-sm font-medium">
                        <User size={17} /> {username}
                    </Link>
                    <button onClick={handleLogout} className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-2 text-sm font-medium">
                        <LogOut size={17} /> Logout
                    </button>
                </div>
            </div>
        </motion.nav>
    );
};

export default TeacherRegistrationNavbar;
