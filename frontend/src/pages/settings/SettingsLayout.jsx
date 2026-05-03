import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, Bell, BookOpen, Settings, ChevronRight, ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import ProfileSettings from './ProfileSettings';
import AccountSettings from './AccountSettings';
import NotificationSettings from './NotificationSettings';
import LearningSettings from './LearningSettings';
import TeacherAdvancedSettings from './TeacherAdvancedSettings';
import AdminSystemSettings from './AdminSystemSettings';

const SettingsLayout = () => {
    const location = useLocation();
    const role = localStorage.getItem('role');
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User, desc: 'Manage your public info' },
        { id: 'account', label: 'Security', icon: Shield, desc: 'Passwords & access' },
        { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Manage your alerts' },
    ];

    if (role === 'STUDENT') {
        tabs.push({ id: 'learning', label: 'Learning', icon: BookOpen, desc: 'Learning preferences' });
    } else if (role === 'TEACHER') {
        tabs.push({ id: 'teacher', label: 'Teaching', icon: Settings, desc: 'Course automation' });
    } else if (role === 'ADMIN') {
        tabs.push({ id: 'admin', label: 'System', icon: Settings, desc: 'Platform control' });
    }

    const renderContent = () => {
        const contentMap = {
            profile: <ProfileSettings />,
            account: <AccountSettings />,
            notifications: <NotificationSettings />,
            learning: <LearningSettings />,
            teacher: <TeacherAdvancedSettings />,
            admin: <AdminSystemSettings />
        };
        return contentMap[activeTab] || <ProfileSettings />;
    };

    return (
        <div className="max-w-[1400px] mx-auto space-y-10 pb-20 text-white px-4 md:px-0">
            {/* Professional Header Section */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900/40 backdrop-blur-xl border border-white/5 p-10 lg:p-14">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_-20%,#4f46e520,transparent_50%)]"></div>
                <div className="relative z-10 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-widest uppercase">
                        <Settings size={14} className="animate-spin-slow" />
                        Platform Configuration
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-display font-bold tracking-tight">
                        Platform <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Preferences</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
                        Fine-tune your digital learning environment. Manage security, notification delivery, and role-specific automation rules.
                    </p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-10 items-start">
                {/* Advanced Sidebar Navigation */}
                <div className="w-full lg:w-80 shrink-0 sticky top-24">
                    <div className="glass-panel p-3 space-y-2">
                        <p className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">General Settings</p>
                        {tabs.slice(0, 3).map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center justify-between gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${isActive ? 'bg-indigo-500 text-white shadow-xl shadow-indigo-500/25 scale-[1.02]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-white/20' : 'bg-slate-800 group-hover:bg-indigo-500/20 group-hover:text-indigo-400'}`}>
                                            <Icon size={20} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-bold tracking-tight">{tab.label}</p>
                                            <p className={`text-[11px] font-medium leading-none mt-1 ${isActive ? 'text-indigo-100' : 'text-slate-500'}`}>{tab.desc}</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className={`transition-all duration-300 ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                                </button>
                            );
                        })}

                        {tabs.length > 3 && (
                            <>
                                <div className="h-px bg-white/5 mx-4 my-4"></div>
                                <p className="px-4 py-2 text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em]">Role Specific</p>
                                {tabs.slice(3).map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center justify-between gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${isActive ? 'bg-indigo-500 text-white shadow-xl shadow-indigo-500/25 scale-[1.02]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-white/20' : 'bg-slate-800 group-hover:bg-indigo-500/20 group-hover:text-indigo-400'}`}>
                                                    <Icon size={20} />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-sm font-bold tracking-tight">{tab.label}</p>
                                                    <p className={`text-[11px] font-medium leading-none mt-1 ${isActive ? 'text-indigo-100' : 'text-slate-500'}`}>{tab.desc}</p>
                                                </div>
                                            </div>
                                            <ChevronRight size={16} className={`transition-all duration-300 ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                                        </button>
                                    );
                                })}
                            </>
                        )}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 min-w-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default SettingsLayout;
