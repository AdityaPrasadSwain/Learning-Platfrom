import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User } from 'lucide-react';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

// Simplified navbar — navigation has been moved to TeacherLayout sidebar
const TeacherNavbar = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('username') || 'Teacher';

    const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-0 w-full bg-white/5 dark:bg-slate-900/40 backdrop-blur-xl border-b border-white/10 z-50 px-6 py-3"
        >
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/teacher/dashboard" className="flex items-center gap-3 group">
                    <div className="p-2 bg-gradient-to-tr from-purple-500 to-pink-600 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-purple-500/20">
                        <Logo size={28} color="white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                            Teacher Portal
                        </span>
                        <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Expert Center</span>
                    </div>
                </Link>

                <div className="flex items-center gap-6">
                    <ThemeToggle />
                    
                    {/* User Profile Dropdown */}
                    <div className="relative">
                        <button 
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="flex items-center gap-3 px-3 py-1.5 rounded-full hover:bg-white/10 transition-all border border-transparent hover:border-white/10 group"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-xs font-bold shadow-lg group-hover:scale-110 transition-transform">
                                {username.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-gray-300 hidden md:block">{username}</span>
                        </button>

                        <AnimatePresence>
                            {isUserMenuOpen && (
                                <>
                                    <div 
                                        className="fixed inset-0 z-[-1]" 
                                        onClick={() => setIsUserMenuOpen(false)}
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-2 w-56 glass-panel overflow-hidden z-50"
                                        style={{ background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(20px)' }}
                                    >
                                        <div className="p-4 border-b border-white/10 bg-white/5">
                                            <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Instructor</p>
                                            <p className="text-sm font-bold text-white mt-1 truncate">{username}</p>
                                        </div>
                                        
                                        <div className="p-2">
                                            <Link 
                                                to="/profile" 
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-purple-400 rounded-xl transition-all"
                                            >
                                                <User size={18} />
                                                <span>My Profile</span>
                                            </Link>
                                            
                                            <button 
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                                            >
                                                <LogOut size={18} />
                                                <span>Sign Out</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
};

export default TeacherNavbar;
