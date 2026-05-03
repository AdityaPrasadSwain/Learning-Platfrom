import React, { useState, useEffect } from 'react';
import { User, Mail, Camera, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { SettingInput } from '../../components/SettingComponents';
import { showSuccess, showError } from '../../utils/sweetAlert';
import api from '../../api/axiosConfig';

const ProfileSettings = () => {
    const userId = localStorage.getItem('userId');
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get(`/users/${userId}`);
                setProfile(response.data);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
        fetchProfile();
    }, [userId]);

    const handleSave = async () => {
        setLoading(true);
        try {
            await api.put(`/users/update/${userId}`, profile);
            showSuccess('Profile Updated', 'Your profile information has been saved.');
        } catch (error) {
            showError('Error', 'Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-panel p-10 space-y-12">
            <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative w-32 h-32 rounded-[1.8rem] bg-slate-800 border-2 border-white/10 flex items-center justify-center text-4xl font-bold shadow-2xl overflow-hidden">
                        {profile.username?.charAt(0).toUpperCase()}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-violet-500/10"></div>
                    </div>
                    <button className="absolute -bottom-2 -right-2 p-3 bg-indigo-500 hover:bg-indigo-600 border-2 border-slate-900 rounded-2xl transition-all text-white shadow-xl hover:scale-110 active:scale-95">
                        <Camera size={18} />
                    </button>
                </div>
                <div className="text-center md:text-left space-y-3">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em]">Profile Identity</p>
                        <h3 className="text-3xl font-display font-bold text-white tracking-tight">{profile.firstName} {profile.lastName}</h3>
                    </div>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 text-xs font-medium">@{profile.username}</span>
                        <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">{localStorage.getItem('role')}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400">Personal Details</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SettingInput 
                        label="First Name" 
                        placeholder="e.g. John"
                        value={profile.firstName} 
                        onChange={(val) => setProfile({...profile, firstName: val})}
                        icon={User}
                    />
                    <SettingInput 
                        label="Last Name" 
                        placeholder="e.g. Doe"
                        value={profile.lastName} 
                        onChange={(val) => setProfile({...profile, lastName: val})}
                        icon={User}
                    />
                </div>
                <SettingInput 
                    label="Email Address" 
                    description="Used for notifications and account recovery"
                    placeholder="your@email.com"
                    value={profile.email} 
                    onChange={(val) => setProfile({...profile, email: val})}
                    icon={Mail}
                    type="email"
                />
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-white/5">
                <p className="text-xs text-slate-500 italic max-w-sm">Note: Some information may be restricted based on your institutional policy.</p>
                <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={loading}
                    className="group relative flex items-center gap-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-2xl shadow-indigo-500/25 disabled:opacity-50 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <Save size={20} className="group-hover:rotate-12 transition-transform" />
                    )}
                    <span className="tracking-tight">Save Profile Changes</span>
                </motion.button>
            </div>
        </div>
    );
};

export default ProfileSettings;
