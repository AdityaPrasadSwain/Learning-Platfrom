import React, { useState } from 'react';
import { Lock, ShieldCheck, Key, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { SettingInput, SettingToggle } from '../../components/SettingComponents';
import { showSuccess, showError } from '../../utils/sweetAlert';
import api from '../../api/axiosConfig';

const AccountSettings = () => {
    const userId = localStorage.getItem('userId');
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });
    const [twoFactor, setTwoFactor] = useState(false);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            showError('Mismatch', 'New passwords do not match.');
            return;
        }
        
        try {
            await api.post('/auth/change-password', {
                currentPassword: passwords.current,
                newPassword: passwords.new
            });
            showSuccess('Password Changed', 'Your account security has been updated.');
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (error) {
            showError('Error', 'Failed to change password. Please check your current password.');
        }
    };

    return (
        <div className="space-y-10">
            {/* Security Credentials Card */}
            <div className="glass-panel p-10 space-y-10 border-indigo-500/10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                        <Lock size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-display font-bold text-white tracking-tight">Security Credentials</h2>
                        <p className="text-slate-500 text-sm">Keep your account protected with a strong password.</p>
                    </div>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div className="p-1">
                        <SettingInput 
                            label="Current Password" 
                            type="password"
                            placeholder="Enter current password"
                            value={passwords.current}
                            onChange={(val) => setPasswords({...passwords, current: val})}
                            icon={Lock}
                        />
                    </div>
                    
                    <div className="h-px bg-white/5 mx-2"></div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-1">
                        <SettingInput 
                            label="New Password" 
                            type="password"
                            placeholder="Min. 8 characters"
                            value={passwords.new}
                            onChange={(val) => setPasswords({...passwords, new: val})}
                            icon={Key}
                        />
                        <SettingInput 
                            label="Confirm New Password" 
                            type="password"
                            placeholder="Repeat new password"
                            value={passwords.confirm}
                            onChange={(val) => setPasswords({...passwords, confirm: val})}
                            icon={ShieldCheck}
                        />
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                        <div className="hidden sm:block">
                            <p className="text-xs text-slate-500 font-medium">Last changed: 3 months ago</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="relative px-8 py-3.5 bg-white text-slate-950 font-bold rounded-2xl shadow-[0_10px_20px_rgba(255,255,255,0.1)] hover:shadow-[0_15px_30px_rgba(255,255,255,0.15)] transition-all duration-300"
                        >
                            Update Security Key
                        </motion.button>
                    </div>
                </form>
            </div>

            {/* Account Privacy & Protection Card */}
            <div className="glass-panel p-10 space-y-10 border-indigo-500/10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-display font-bold text-white tracking-tight">Account Protection</h2>
                        <p className="text-slate-500 text-sm">Advanced security layers for your digital identity.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <SettingToggle 
                        label="Two-Factor Authentication" 
                        description="Require a secure code for every login attempt."
                        checked={twoFactor}
                        onChange={setTwoFactor}
                        icon={ShieldCheck}
                    />
                    
                    <div className="group relative p-6 rounded-[1.8rem] bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center shadow-lg">
                                <LogOut size={22} />
                            </div>
                            <div>
                                <h4 className="text-[15px] font-bold text-white">Global Sign Out</h4>
                                <p className="text-[11px] text-slate-500 mt-1 font-medium leading-tight">Terminate all active sessions across all devices.</p>
                            </div>
                        </div>
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 bg-red-500 text-white text-[13px] font-bold rounded-xl shadow-xl shadow-red-500/20 transition-all flex items-center justify-center gap-2"
                        >
                            <LogOut size={16} />
                            Reset All Sessions
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountSettings;
