import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Target, Zap } from 'lucide-react';
import { SettingToggle, SettingSelect, SettingInput } from '../../components/SettingComponents';
import { getUserSettings, updateUserSettings } from '../../api/settingsApi';

const LearningSettings = () => {
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
    const learn = settings.learning || {};

    return (
        <div className="glass-panel p-10 space-y-12 border-indigo-500/10">
            <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <Target size={28} />
                </div>
                <div>
                    <h2 className="text-2xl font-display font-bold text-white tracking-tight">Academic Experience</h2>
                    <p className="text-slate-500 text-sm">Personalize the environment where your growth happens.</p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Playback Intelligence</h3>
                </div>

                <div className="space-y-6">
                    <SettingSelect 
                        label="Default Dynamic Speed" 
                        description="Automatically calibrate playback for optimal information retention."
                        value={learn.playbackSpeed || '1'}
                        options={[
                            { value: '0.75', label: '0.75x (Detail)' },
                            { value: '1', label: '1.0x (Standard)' },
                            { value: '1.25', label: '1.25x (Efficient)' },
                            { value: '1.5', label: '1.5x (Accelerated)' },
                            { value: '2', label: '2.0x (Sprint)' }
                        ]}
                        onChange={(val) => handleUpdate('learning.playbackSpeed', val)}
                        icon={Play}
                    />
                    <SettingToggle 
                        label="Stateful Resumption" 
                        description="Synchronize your progress across all devices instantly."
                        checked={learn.autoResume ?? true}
                        onChange={(val) => handleUpdate('learning.autoResume', val)}
                        icon={RotateCcw}
                    />
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Strategic Goals</h3>
                </div>
                <div className="space-y-6">
                    <SettingInput 
                        label="Daily Target Velocity" 
                        description="Allocated minutes for focused knowledge acquisition."
                        type="number"
                        placeholder="30"
                        value={learn.dailyGoal || 30}
                        onChange={(val) => handleUpdate('learning.dailyGoal', val)}
                        icon={Target}
                    />
                    <SettingToggle 
                        label="Gamified Momentum" 
                        description="Track streaks and unlock academic achievements."
                        checked={learn.enableStreaks ?? true}
                        onChange={(val) => handleUpdate('learning.enableStreaks', val)}
                        icon={Zap}
                    />
                </div>
            </div>
        </div>
    );
};

export default LearningSettings;
