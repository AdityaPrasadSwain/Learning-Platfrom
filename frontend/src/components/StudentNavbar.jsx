import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Video, GraduationCap, User, LogOut, LayoutDashboard, FileQuestion, Menu, X } from 'lucide-react';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

const StudentNavbar = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('username') || 'Student';
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 w-full bg-white/80 dark:bg-ai-base/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5 z-50 px-6 py-4 transition-colors duration-300"
        >
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/dashboard" className="flex items-center gap-3">
                    <Logo size={40} />
                    <div className="flex flex-col">
                        <span className="text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-secondary">
                            LearningStream
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">Student Portal</span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6">
                    <Link
                        to="/dashboard"
                        className="text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-white transition-colors flex items-center gap-2 font-medium"
                    >
                        <LayoutDashboard size={18} /> Dashboard
                    </Link>
                    <Link
                        to="/courses"
                        className="text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-white transition-colors flex items-center gap-2 font-medium"
                    >
                        <BookOpen size={18} /> All Courses
                    </Link>
                    <Link
                        to="/my-learning"
                        className="text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-white transition-colors flex items-center gap-2 font-medium"
                    >
                        <GraduationCap size={18} /> My Learning
                    </Link>
                    <Link
                        to="/videos"
                        className="text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-white transition-colors flex items-center gap-2 font-medium"
                    >
                        <Video size={18} /> Videos
                    </Link>
                    <Link
                        to="/student/quizzes"
                        className="text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-white transition-colors flex items-center gap-2 font-medium"
                    >
                        <FileQuestion size={18} /> Quizzes
                    </Link>

                    <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200 dark:border-white/10">
                        <ThemeToggle />
                        <Link
                            to="/profile"
                            className="flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:text-brand-primary transition-colors font-medium"
                        >
                            <User size={18} />
                            <span className="text-sm">{username}</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="text-red-500 hover:text-red-400 transition-colors flex items-center gap-2 font-medium"
                        >
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-slate-800 dark:text-white"
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
                    className="md:hidden bg-white/95 dark:bg-ai-base/95 backdrop-blur-xl border-t border-gray-200 dark:border-white/5 mt-4"
                >
                    <div className="flex flex-col p-4 gap-4">
                        <Link
                            to="/dashboard"
                            className="text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-white transition-colors flex items-center gap-2 p-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <LayoutDashboard size={18} /> Dashboard
                        </Link>
                        <Link
                            to="/courses"
                            className="text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-white transition-colors flex items-center gap-2 p-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <BookOpen size={18} /> All Courses
                        </Link>
                        <Link
                            to="/my-learning"
                            className="text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-white transition-colors flex items-center gap-2 p-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <GraduationCap size={18} /> My Learning
                        </Link>
                        <Link
                            to="/videos"
                            className="text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-white transition-colors flex items-center gap-2 p-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <Video size={18} /> Videos
                        </Link>
                        <Link
                            to="/student/quizzes"
                            className="text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-white transition-colors flex items-center gap-2 p-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <FileQuestion size={18} /> Quizzes
                        </Link>
                        <Link
                            to="/profile"
                            className="flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:text-brand-primary dark:hover:text-white transition-colors p-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <User size={18} />
                            <span className="text-sm">{username}</span>
                        </Link>
                        <button
                            onClick={() => {
                                handleLogout();
                                setIsMenuOpen(false);
                            }}
                            className="text-red-500 hover:text-red-400 transition-colors flex items-center gap-2 p-2"
                        >
                            <LogOut size={18} /> Logout
                        </button>
                        <div className="p-2 border-t border-gray-200 dark:border-white/10 flex justify-center">
                            <ThemeToggle />
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
};

export default StudentNavbar;
