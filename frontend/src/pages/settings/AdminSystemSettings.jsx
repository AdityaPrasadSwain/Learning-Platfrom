import React, { useState, useEffect } from 'react';
import { Zap, Shield, HardDrive, Bell } from 'lucide-react';
import { SettingToggle, SettingInput } from '../../components/SettingComponents';
import { getSystemSettings, updateSystemSetting } from '../../api/settingsApi';
import { showSuccess } from '../../utils/sweetAlert';

const AdminSystemSettings = () => {
    const [allSettings, setAllSettings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const data = await getSystemSettings();
            setAllSettings(data);
        } catch (error) {
            console.error('Error fetching system settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (key, value) => {
        try {
            await updateSystemSetting(key, value);
            fetchSettings(); // Refresh
            showSuccess('Updated', `System setting "${key}" updated.`);
        } catch (error) {
            console.error('Error updating system setting:', error);
        }
    };

    if (loading) return null;

    const featureToggles = allSettings.find(s => s.settingKey === 'feature_toggles')?.value || {};
    const platformConfig = allSettings.find(s => s.settingKey === 'platform_config')?.value || {};

    return (
        <div className="glass-panel p-10 space-y-12 border-indigo-500/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
                        <Zap size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-display font-bold text-white tracking-tight">System Command Center</h2>
                        <p className="text-slate-500 text-sm">Orchestrate global platform modules and infrastructure limits.</p>
                    </div>
                </div>
                <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Real-time Sync Active</span>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Module Availability</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SettingToggle 
                        label="Live Interactive Classes" 
                        description="Toggle real-time video broadcasting capabilities."
                        checked={featureToggles.live_class ?? true}
                        onChange={(val) => handleUpdate('feature_toggles', { ...featureToggles, live_class: val })}
                        icon={Zap}
                    />
                    <SettingToggle 
                        label="Assignment Engine" 
                        description="Manage student submissions and grading pipelines."
                        checked={featureToggles.assignment ?? true}
                        onChange={(val) => handleUpdate('feature_toggles', { ...featureToggles, assignment: val })}
                        icon={HardDrive}
                    />
                    <SettingToggle 
                        label="Dynamic Quiz Module" 
                        description="Enable automated assessments and instant feedback."
                        checked={featureToggles.quiz ?? true}
                        onChange={(val) => handleUpdate('feature_toggles', { ...featureToggles, quiz: val })}
                        icon={Zap}
                    />
                    <SettingToggle 
                        label="Cloud Recording" 
                        description="Allow instructors to archive sessions for later viewing."
                        checked={featureToggles.recording ?? true}
                        onChange={(val) => handleUpdate('feature_toggles', { ...featureToggles, recording: val })}
                        icon={HardDrive}
                    />
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Infrastructure Thresholds</h3>
                </div>
                <div className="space-y-6">
                    <SettingInput 
                        label="Maximum Upload Capacity" 
                        description="Set the global limit for single assignment file uploads."
                        placeholder="e.g. 100MB"
                        value={platformConfig.max_upload_size || '50MB'}
                        onChange={(val) => handleUpdate('platform_config', { ...platformConfig, max_upload_size: val })}
                        icon={HardDrive}
                    />
                    <SettingInput 
                        label="Inactivity Timeout" 
                        description="Duration in seconds before an idle session is terminated."
                        type="number"
                        placeholder="3600"
                        value={platformConfig.session_timeout || 3600}
                        onChange={(val) => handleUpdate('platform_config', { ...platformConfig, session_timeout: parseInt(val) })}
                        icon={Shield}
                    />
                </div>
            </div>

            <div className="relative group overflow-hidden p-8 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 hover:border-indigo-500/20 transition-all duration-500">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Shield size={120} className="text-indigo-400" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-lg">
                            <Shield size={28} />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-white">Platform Safeguard Mode</h4>
                            <p className="text-sm text-slate-500 mt-1 max-w-sm">When enabled, the platform enters read-only maintenance mode. All write operations will be temporarily suspended.</p>
                        </div>
                    </div>
                    <div className="shrink-0">
                        <SettingToggle 
                            label="Maintenance Active" 
                            checked={platformConfig.maintenance_mode ?? false}
                            onChange={(val) => handleUpdate('platform_config', { ...platformConfig, maintenance_mode: val })}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSystemSettings;
