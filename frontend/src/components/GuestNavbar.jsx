import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const GuestNavbar = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleScrollToSection = (e, sectionId) => {
        e.preventDefault();
        setIsMenuOpen(false);
        
        if (location.pathname !== '/') {
            navigate(`/#${sectionId}`);
            // Small delay to allow the home page to render before scrolling
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        } else {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="sticky top-0 w-full bg-white/80 dark:bg-ai-base/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5 z-50 px-6 py-4 transition-colors duration-300"
        >
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo Section */}
                <Link to="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-primary dark:bg-brand-primary rounded-[8px] flex items-center justify-center shadow-sm">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M3 6C3 4.34315 4.34315 3 6 3H18C19.6569 3 21 4.34315 21 6V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6ZM7 8C7 7.44772 7.44772 7 8 7H16C16.5523 7 17 7.44772 17 8C17 8.55228 16.5523 9 16 9H8C7.44772 9 7 8.55228 7 8ZM7 12C7 11.4477 7.44772 11 8 11H16C16.5523 11 17 11.4477 17 12C17 12.5523 16.5523 13 16 13H8C7.44772 13 7 12.5523 7 12ZM8 15C7.44772 15 7 15.4477 7 16C7 16.5523 7.44772 17 8 17H12C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15H8Z" fill="white"/>
                        </svg>
                    </div>
                    <span className="text-[20px] font-bold text-slate-900 dark:text-white tracking-tight">
                        e-Learling
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-10">
                    <a
                        href="#home"
                        onClick={(e) => handleScrollToSection(e, 'home')}
                        className="text-slate-900 dark:text-white font-bold hover:text-brand-primary dark:hover:text-brand-primary transition-colors cursor-pointer"
                    >
                        Home
                    </a>
                    <Link
                        to="/courses"
                        className="text-slate-600 dark:text-slate-300 font-medium hover:text-brand-primary dark:hover:text-white transition-colors"
                    >
                        Our Courses
                    </Link>
                    <a
                        href="#features"
                        onClick={(e) => handleScrollToSection(e, 'features')}
                        className="text-slate-600 dark:text-slate-300 font-medium hover:text-brand-primary dark:hover:text-white transition-colors cursor-pointer"
                    >
                        Features
                    </a>
                    <a
                        href="#team"
                        onClick={(e) => handleScrollToSection(e, 'team')}
                        className="text-slate-600 dark:text-slate-300 font-medium hover:text-brand-primary dark:hover:text-white transition-colors cursor-pointer"
                    >
                        Team
                    </a>
                    <a
                        href="#faq"
                        onClick={(e) => handleScrollToSection(e, 'faq')}
                        className="text-slate-600 dark:text-slate-300 font-medium hover:text-brand-primary dark:hover:text-white transition-colors cursor-pointer"
                    >
                        FAQ
                    </a>
                </div>

                {/* Right Actions */}
                <div className="hidden md:flex items-center gap-8">
                    <Link
                        to="/login"
                        className="text-slate-600 dark:text-slate-300 font-medium hover:text-brand-primary dark:hover:text-white transition-colors"
                    >
                        Sign In
                    </Link>
                    <Link
                        to="/register"
                        className="px-7 py-2.5 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold rounded-full hover:shadow-lg hover:shadow-brand-primary/20 transition-all"
                    >
                        Register
                    </Link>
                    <div className="ml-2 pl-6 border-l border-gray-200 dark:border-white/10">
                        <ThemeToggle />
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center gap-4">
                    <ThemeToggle />
                    <button
                        className="text-slate-800 dark:text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden bg-white/95 dark:bg-ai-base/95 backdrop-blur-xl border-t border-gray-200 dark:border-white/5 mt-4 rounded-b-2xl shadow-xl overflow-hidden absolute left-0 w-full"
                >
                    <div className="flex flex-col p-4 gap-2">
                        <a
                            href="#home"
                            onClick={(e) => handleScrollToSection(e, 'home')}
                            className="text-slate-900 dark:text-white font-bold p-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                        >
                            Home
                        </a>
                        <Link
                            to="/courses"
                            className="text-slate-600 dark:text-slate-300 font-medium p-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Our Courses
                        </Link>
                        <a
                            href="#features"
                            onClick={(e) => handleScrollToSection(e, 'features')}
                            className="text-slate-600 dark:text-slate-300 font-medium p-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                        >
                            Features
                        </a>
                        <a
                            href="#team"
                            onClick={(e) => handleScrollToSection(e, 'team')}
                            className="text-slate-600 dark:text-slate-300 font-medium p-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                        >
                            Team
                        </a>
                        <a
                            href="#faq"
                            onClick={(e) => handleScrollToSection(e, 'faq')}
                            className="text-slate-600 dark:text-slate-300 font-medium p-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                        >
                            FAQ
                        </a>
                        <div className="h-px bg-gray-200 dark:bg-white/10 my-2"></div>
                        <Link
                            to="/login"
                            className="text-slate-600 dark:text-slate-300 font-medium p-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/register"
                            className="px-4 py-3 mt-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold rounded-xl hover:opacity-90 transition-opacity text-center"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Register
                        </Link>
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
};

export default GuestNavbar;
