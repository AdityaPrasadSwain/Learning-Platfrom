import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Users, BookOpen, FileText, LogOut, LayoutDashboard, User, Menu, X, FileQuestion } from 'lucide-react';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

const AdminNavbar = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                <Link to="/admin/dashboard" className="flex items-center gap-3">
                    <Logo size={40} />
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-600">
                            Admin Panel
                        </span>
                        <span className="text-xs text-gray-400">System Management</span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6">
                    <Link
                        to="/admin/dashboard"
                        className="text-gray-800 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2"
                    >
                        <LayoutDashboard size={18} /> Dashboard
                    </Link>
                    <Link
                        to="/admin/users"
                        className="text-gray-800 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2"
                    >
                        <Users size={18} /> Users
                    </Link>
                    <Link
                        to="/admin/courses"
                        className="text-gray-800 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2"
                    >
                        <BookOpen size={18} /> Courses
                    </Link>

                    <Link
                        to="/admin/quizzes"
                        className="text-gray-800 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2"
                    >
                        <FileQuestion size={18} /> Quizzes
                    </Link>

                    <Link
                        to="/admin/audit-logs"
                        className="text-gray-800 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2"
                    >
                        <FileText size={18} /> Audit Logs
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
                        <Link
                            to="/admin/dashboard"
                            className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-white transition-colors flex items-center gap-2 p-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <LayoutDashboard size={18} /> Dashboard
                        </Link>
                        <Link
                            to="/admin/users"
                            className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-white transition-colors flex items-center gap-2 p-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <Users size={18} /> Users
                        </Link>
                        <Link
                            to="/admin/courses"
                            className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-white transition-colors flex items-center gap-2 p-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <BookOpen size={18} /> Courses
                        </Link>
                        <Link
                            to="/admin/quizzes"
                            className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-white transition-colors flex items-center gap-2 p-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <FileQuestion size={18} /> Quizzes
                        </Link>
                        <Link
                            to="/admin/audit-logs"
                            className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-white transition-colors flex items-center gap-2 p-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <FileText size={18} /> Audit Logs
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

export default AdminNavbar;
