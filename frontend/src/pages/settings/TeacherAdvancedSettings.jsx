import React, { useState, useEffect } from 'react';
import { Award, Clock, Video, FileText } from 'lucide-react';
import { SettingToggle, SettingInput } from '../../components/SettingComponents';
import { getUserSettings, updateUserSettings } from '../../api/settingsApi';

const TeacherAdvancedSettings = () => {
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
    };

    if (!settings) return null;
    const rules = settings.teaching_rules || {};

    return (
        <div className="glass-panel p-10 space-y-12 border-indigo-500/10">
            <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <Award size={28} />
                </div>
                <div>
                    <h2 className="text-2xl font-display font-bold text-white tracking-tight">Instructional Automation</h2>
                    <p className="text-slate-500 text-sm">Codify your pedagogical rules and automated course behaviors.</p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Academic Integrity & Grading</h3>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SettingInput 
                            label="Late Penalty Coefficient (%)" 
                            description="Daily reduction applied to overdue submissions."
                            type="number"
                            placeholder="10"
                            value={rules.latePenalty || 10}
                            onChange={(val) => handleUpdate('teaching_rules.latePenalty', val)}
                            icon={FileText}
                        />
                        <SettingInput 
                            label="Strategic Grace Period (Mins)" 
                            description="Temporal window permitted post-deadline."
                            type="number"
                            placeholder="15"
                            value={rules.gracePeriod || 15}
                            onChange={(val) => handleUpdate('teaching_rules.gracePeriod', val)}
                            icon={Clock}
                        />
                    </div>
                    <SettingToggle 
                        label="Automated Assessment Validation" 
                        description="Instantly compute and propagate quiz results upon submission."
                        checked={rules.autoGrade ?? true}
                        onChange={(val) => handleUpdate('teaching_rules.autoGrade', val)}
                        icon={Award}
                    />
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Live Orchestration</h3>
                </div>
                <div className="space-y-6">
                    <SettingToggle 
                        label="Autonomous Session Recording" 
                        description="Initialize archival protocols when the virtual session activates."
                        checked={rules.autoRecord ?? false}
                        onChange={(val) => handleUpdate('teaching_rules.autoRecord', val)}
                        icon={Video}
                    />
                    <SettingInput 
                        label="Attendance Verification Threshold (%)" 
                        description="Minimum engagement duration required for presence validation."
                        type="number"
                        placeholder="75"
                        value={rules.attendanceThreshold || 75}
                        onChange={(val) => handleUpdate('teaching_rules.attendanceThreshold', val)}
                        icon={Clock}
                    />
                </div>
            </div>
        </div>
    );
};

export default TeacherAdvancedSettings;
