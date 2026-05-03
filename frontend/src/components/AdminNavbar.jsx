import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, LayoutDashboard, Users, BookOpen, Bell, Search, Settings } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import NotificationBell from './NotificationBell';

const AdminNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const username = localStorage.getItem('username') || 'Admin';
    const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };


    return (
        <nav className="sticky top-0 w-full bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 z-[60] px-6 py-3 transition-all duration-300">
            <div className="max-w-[1600px] mx-auto flex justify-between items-center">
                
                {/* Left Section: Logo & Brand */}
                <div className="flex items-center gap-8">
                    <Link to="/admin/dashboard" className="flex items-center gap-3 group">
                        <Logo className="w-9 h-9 group-hover:scale-110 transition-transform duration-300" />
                        <div className="flex flex-col">
                            <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-none">AntiGravity</span>
                            <span className="text-[10px] font-bold text-indigo-500 tracking-[0.2em] uppercase mt-1">Admin Center</span>
                        </div>
                    </Link>

                </div>

                {/* Right Section: Actions & Profile */}
                <div className="flex items-center gap-4">
                    {/* Search Bar (Visual) */}
                    <div className="hidden md:flex items-center relative group">
                        <Search className="absolute left-3 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search records..." 
                            className="bg-slate-100 dark:bg-slate-800/50 border border-transparent focus:border-indigo-500/50 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-900 dark:text-white w-64 transition-all focus:w-80 outline-none"
                        />
                    </div>

                    <div className="h-6 w-px bg-slate-200 dark:bg-white/10 mx-2 hidden sm:block"></div>

                    <ThemeToggle />
                    <NotificationBell />
                    
                    {/* User Profile Dropdown */}
                    <div className="relative">
                        <button 
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="flex items-center gap-3 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold shadow-lg group-hover:ring-4 ring-indigo-500/20 transition-all">
                                {username.charAt(0).toUpperCase()}
                            </div>
                        </button>

                        <AnimatePresence>
                            {isUserMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-[-1]" onClick={() => setIsUserMenuOpen(false)} />
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[70]"
                                    >
                                        <div className="p-5 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white font-bold">
                                                    {username.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{username}</p>
                                                    <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider mt-0.5">System Administrator</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="p-2">
                                            <Link 
                                                to="/profile" 
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-all"
                                            >
                                                <User size={18} className="text-slate-400" />
                                                <span>My Profile</span>
                                            </Link>
                                            <Link 
                                                to="/admin/settings" 
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-all"
                                            >
                                                <Settings size={18} className="text-slate-400" />
                                                <span>Settings</span>
                                            </Link>
                                            
                                            <div className="my-2 h-px bg-slate-100 dark:bg-white/5"></div>

                                            <button 
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                            >
                                                <LogOut size={18} />
                                                <span className="font-bold">Sign Out</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;
