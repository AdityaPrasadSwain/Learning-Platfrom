import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, ExternalLink, Clock, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserNotifications, getUnreadCount, markAsRead, markAllAsRead } from '../api/notificationApi';
import { formatDistanceToNow } from 'date-fns';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const userId = localStorage.getItem('userId');

    const fetchNotifications = async () => {
        if (!userId) return;
        try {
            const [notifs, count] = await Promise.all([
                getUserNotifications(userId),
                getUnreadCount(userId)
            ]);
            setNotifications(notifs);
            setUnreadCount(count);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, [userId]);

    const handleMarkAsRead = async (id) => {
        try {
            await markAsRead(id);
            fetchNotifications();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllAsRead(userId);
            fetchNotifications();
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const getTypeStyles = (type) => {
        switch (type) {
            case 'ASSIGNMENT': return 'bg-indigo-500/10 text-indigo-500';
            case 'QUIZ': return 'bg-purple-500/10 text-purple-500';
            case 'LIVE': return 'bg-red-500/10 text-red-500';
            default: return 'bg-slate-500/10 text-slate-500';
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-all group"
            >
                <Bell size={20} className="group-hover:scale-110 transition-transform" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[70]"
                        >
                            <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02]">
                                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    Notifications
                                    <span className="text-[10px] px-2 py-0.5 bg-indigo-500 text-white rounded-full uppercase tracking-wider font-bold">
                                        Live
                                    </span>
                                </h3>
                                {unreadCount > 0 && (
                                    <button 
                                        onClick={handleMarkAllRead}
                                        className="text-xs font-bold text-indigo-500 hover:text-indigo-600 transition-colors"
                                    >
                                        Mark all read
                                    </button>
                                )}
                            </div>

                            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                {notifications.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Bell size={20} className="text-slate-400" />
                                        </div>
                                        <p className="text-sm text-slate-500 font-medium">No notifications yet</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-100 dark:divide-white/5">
                                        {notifications.map((notif) => (
                                            <div 
                                                key={notif.id}
                                                className={`p-4 hover:bg-slate-50 dark:hover:bg-white/[0.01] transition-all relative group ${!notif.isRead ? 'bg-indigo-500/[0.02]' : ''}`}
                                            >
                                                {!notif.isRead && (
                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
                                                )}
                                                <div className="flex gap-4">
                                                    <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${getTypeStyles(notif.type)}`}>
                                                        <Info size={18} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <h4 className={`text-sm font-bold truncate ${!notif.isRead ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                                                {notif.title}
                                                            </h4>
                                                            {!notif.isRead && (
                                                                <button 
                                                                    onClick={() => handleMarkAsRead(notif.id)}
                                                                    className="p-1 text-indigo-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-indigo-500/10 rounded-lg"
                                                                    title="Mark as read"
                                                                >
                                                                    <Check size={14} />
                                                                </button>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                                                            {notif.message}
                                                        </p>
                                                        <div className="flex items-center gap-3 mt-2 text-[10px] font-medium text-slate-400">
                                                            <span className="flex items-center gap-1">
                                                                <Clock size={10} />
                                                                {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="p-3 bg-slate-50/50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/5 text-center">
                                <button className="text-xs font-bold text-slate-500 hover:text-indigo-500 transition-colors uppercase tracking-widest">
                                    View Activity History
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationBell;
