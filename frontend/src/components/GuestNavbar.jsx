import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, Home, BookOpen, Menu, X } from 'lucide-react';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

const GuestNavbar = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 w-full bg-white/80 dark:bg-ai-base/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5 z-50 px-6 py-4 transition-colors duration-300"
        >
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="flex items-center gap-3">
                    <Logo size={40} />
                    <div className="flex flex-col">
                        <span className="text-2xl font-display font-bold text-slate-500 dark:text-white">
                            LearningStream
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">Intelligent Learning Platform</span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6">
                    <Link
                        to="/"
                        className="text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-white transition-colors flex items-center gap-2 font-medium"
                    >
                        <Home size={18} /> Home
                    </Link>
                    <Link
                        to="/courses"
                        className="text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-white transition-colors flex items-center gap-2 font-medium"
                    >
                        <BookOpen size={18} /> Courses
                    </Link>
                    <Link
                        to="/login"
                        className="text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-white transition-colors flex items-center gap-2 font-medium"
                    >
                        <LogIn size={18} /> Login
                    </Link>
                    <Link
                        to="/register"
                        className="px-5 py-2.5 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold rounded-full hover:shadow-lg hover:shadow-brand-primary/20 hover:scale-[1.02] transition-all flex items-center gap-2"
                    >
                        <UserPlus size={18} /> Sign Up
                    </Link>

                    <div className="ml-4 pl-4 border-l border-gray-200 dark:border-white/10">
                        <ThemeToggle />
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
                            to="/"
                            className="text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-white transition-colors flex items-center gap-2 p-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <Home size={18} /> Home
                        </Link>
                        <Link
                            to="/courses"
                            className="text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-white transition-colors flex items-center gap-2 p-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <BookOpen size={18} /> Courses
                        </Link>
                        <Link
                            to="/login"
                            className="text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-white transition-colors flex items-center gap-2 p-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <LogIn size={18} /> Login
                        </Link>
                        <Link
                            to="/register"
                            className="px-4 py-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 justify-center"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <UserPlus size={18} /> Sign Up
                        </Link>
                        <div className="flex justify-center p-2 border-t border-gray-200 dark:border-white/10">
                            <ThemeToggle />
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
};

export default GuestNavbar;
