import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Settings } from 'lucide-react';
import Logo from './Logo';

import ThemeToggle from './ThemeToggle';
import NotificationBell from './NotificationBell';

// Simplified navbar — navigation has been moved to StudentLayout sidebar
const StudentNavbar = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('username') || 'Student';

    const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-0 w-full bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 z-50 px-6 py-3 transition-colors duration-300"
        >
            <div className="flex justify-end items-center">


                <div className="flex items-center gap-6">
                    <ThemeToggle />
                    <NotificationBell />
                    
                    {/* User Profile Dropdown */}
                    <div className="relative">
                        <button 
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="flex items-center gap-3 px-3 py-1.5 rounded-full hover:bg-white/10 transition-all border border-transparent hover:border-white/10 group"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-lg group-hover:scale-110 transition-transform">
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
                                            <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Account</p>
                                            <p className="text-sm font-bold text-white mt-1 truncate">{username}</p>
                                        </div>
                                        
                                        <div className="p-2">
                                            <Link 
                                                to="/profile" 
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-cyan-400 rounded-xl transition-all"
                                            >
                                                <User size={18} />
                                                <span>My Profile</span>
                                            </Link>

                                            <Link 
                                                to="/student/settings" 
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-cyan-400 rounded-xl transition-all"
                                            >
                                                <Settings size={18} />
                                                <span>Settings</span>
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

export default StudentNavbar;
