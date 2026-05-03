import React, { useState, useEffect } from 'react';
import { Bell, Mail, Smartphone, Clock, Shield } from 'lucide-react';
import { SettingToggle, SettingSelect } from '../../components/SettingComponents';
import { getUserSettings, updateUserSettings } from '../../api/settingsApi';
import { showSuccess } from '../../utils/sweetAlert';

const NotificationSettings = () => {
    const userId = localStorage.getItem('userId');
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            const data = await getUserSettings(userId);
            setSettings(data);
        };
        fetchSettings();
    }, [userId]);

    const handleUpdate = async (key, value) => {
        const newSettings = { ...settings };
        if (key.includes('.')) {
            const [parent, child] = key.split('.');
            newSettings[parent] = { ...newSettings[parent], [child]: value };
        } else {
            newSettings[key] = value;
        }
        
        setSettings(newSettings);
        await updateUserSettings(userId, newSettings);
        // Optional: toast notification
    };

    if (!settings) return null;

    const notif = settings.notifications || {};

    return (
        <div className="glass-panel p-10 space-y-12 border-indigo-500/10">
            <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <Bell size={28} />
                </div>
                <div>
                    <h2 className="text-2xl font-display font-bold text-white tracking-tight">Notification Engine</h2>
                    <p className="text-slate-500 text-sm">Fine-tune how and when the platform communicates with you.</p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Delivery Channels</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SettingToggle 
                        label="Email Dispatch" 
                        description="Receive rich HTML reports for academic updates."
                        checked={notif.email ?? true}
                        onChange={(val) => handleUpdate('notifications.email', val)}
                        icon={Mail}
                    />
                    <SettingToggle 
                        label="System Push" 
                        description="Direct browser & device alerts for instant action."
                        checked={notif.push ?? true}
                        onChange={(val) => handleUpdate('notifications.push', val)}
                        icon={Smartphone}
                    />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Learning Alerts</h3>
                <SettingToggle 
                    label="Assignment Reminders" 
                    description="Get notified 24h before a deadline"
                    checked={notif.assignment ?? true}
                    onChange={(val) => handleUpdate('notifications.assignment', val)}
                    icon={Bell}
                />
                <SettingToggle 
                    label="Live Class Alerts" 
                    description="Instant notification when a live session starts"
                    checked={notif.live ?? true}
                    onChange={(val) => handleUpdate('notifications.live', val)}
                    icon={Smartphone}
                />
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Priority & Timing</h3>
                </div>
                <div className="space-y-6">
                    <SettingSelect 
                        label="Intelligence Delivery" 
                        description="Select your preferred notification frequency."
                        value={notif.digest || 'instant'}
                        options={[
                            { value: 'instant', label: 'Real-time (High Priority)' },
                            { value: 'daily', label: 'Daily Digest (Standard)' },
                            { value: 'weekly', label: 'Weekly Roundup (Summary)' }
                        ]}
                        onChange={(val) => handleUpdate('notifications.digest', val)}
                        icon={Clock}
                    />
                    <SettingToggle 
                        label="Strategic Quiet Hours" 
                        description="Automatically suppress all alerts between 22:00 and 07:00."
                        checked={notif.quietHours ?? false}
                        onChange={(val) => handleUpdate('notifications.quietHours', val)}
                        icon={Shield}
                    />
                </div>
            </div>
        </div>
    );
};

export default NotificationSettings;
