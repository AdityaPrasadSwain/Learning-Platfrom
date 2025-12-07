import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, User, Menu, X, FileText, Activity } from 'lucide-react';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import api from '../services/api';

const TeacherRegistrationNavbar = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [status, setStatus] = useState(null);

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
                    <Logo size={40} />
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                            Teacher Portal
                        </span>
                        <span className="text-xs text-gray-400">Application & Registration</span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6">
                    {status && (
                        <div className={`px-3 py-1 rounded-full border ${getStatusColor(status)} bg-opacity-10 bg-white dark:bg-opacity-10 dark:bg-white flex items-center gap-2`}>
                            <Activity size={16} />
                            <span className="text-sm font-bold">{status.status}</span>
                        </div>
                    )}
                    <Link
                        to="/teacher/apply"
                        className="text-gray-800 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2"
                    >
                        <FileText size={18} /> View Status
                    </Link>
                    <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200 dark:border-white/10">
                        <ThemeToggle />
                        <Link
                            to="/profile"
                            className="text-gray-800 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2"
                        >
                            <User size={18} /> Profile
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-2"
                        >
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-gray-800 dark:text-white"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden bg-white/95 dark:bg-black/90 backdrop-blur-xl border-t border-gray-200 dark:border-white/10 mt-4"
                >
                    <div className="flex flex-col p-4 gap-4">
                        {status && (
                            <div className={`mx-2 px-3 py-2 rounded border ${getStatusColor(status)} bg-opacity-10 bg-white dark:bg-opacity-10 dark:bg-white flex items-center gap-2 justify-center`}>
                                <Activity size={16} />
                                <span className="font-bold">{status.status}</span>
                            </div>
                        )}
                        <Link
                            to="/teacher/apply"
                            className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-white transition-colors flex items-center gap-2 p-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <FileText size={18} /> View Status
                        </Link>
                        <Link
                            to="/profile"
                            className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-white transition-colors flex items-center gap-2 p-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <User size={18} /> Profile
                        </Link>
                        <button
                            onClick={() => {
                                handleLogout();
                                setIsMenuOpen(false);
                            }}
                            className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-2 p-2"
                        >
                            <LogOut size={18} /> Logout
                        </button>
                        <div className="flex justify-center p-2 border-t border-gray-200 dark:border-white/10">
                            <ThemeToggle />
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
};

export default TeacherRegistrationNavbar;
