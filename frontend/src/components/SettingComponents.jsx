import React from 'react';
import { motion } from 'framer-motion';

export const SettingToggle = ({ label, description, checked, onChange, icon: Icon, disabled = false }) => {
    return (
        <div className={`flex items-center justify-between p-5 rounded-[1.5rem] border transition-all duration-300 ${checked ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-slate-900/40 border-white/5'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-white/10 hover:bg-slate-800/60'}`}>
            <div className="flex items-center gap-5">
                {Icon && (
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${checked ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/40' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'}`}>
                        <Icon size={22} />
                    </div>
                )}
                <div className="min-w-0">
                    <h4 className="text-[15px] font-bold text-white tracking-tight">{label}</h4>
                    {description && <p className="text-[11px] text-slate-500 mt-1 leading-tight font-medium">{description}</p>}
                </div>
            </div>
            <button
                disabled={disabled}
                onClick={() => onChange(!checked)}
                className={`relative w-14 h-7 rounded-full transition-all duration-500 outline-none ${checked ? 'bg-indigo-500 ring-4 ring-indigo-500/20' : 'bg-slate-700'}`}
            >
                <motion.div
                    initial={false}
                    animate={{ x: checked ? 32 : 4 }}
                    className="absolute top-1.5 w-4 h-4 bg-white rounded-full shadow-2xl"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
            </button>
        </div>
    );
};

export const SettingSelect = ({ label, description, value, options, onChange, icon: Icon }) => {
    return (
        <div className="flex items-center justify-between p-5 rounded-[1.5rem] bg-slate-900/40 border border-white/5 hover:border-white/10 transition-all duration-300">
            <div className="flex items-center gap-5">
                {Icon && (
                    <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center shadow-inner">
                        <Icon size={22} />
                    </div>
                )}
                <div className="min-w-0">
                    <h4 className="text-[15px] font-bold text-white tracking-tight">{label}</h4>
                    {description && <p className="text-[11px] text-slate-500 mt-1 leading-tight font-medium">{description}</p>}
                </div>
            </div>
            <div className="relative group">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="appearance-none bg-slate-800/80 border border-white/10 rounded-xl px-5 py-2.5 text-[13px] font-bold text-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer min-w-[120px]"
                >
                    {options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
            </div>
        </div>
    );
};

export const SettingInput = ({ label, description, value, onChange, type = "text", placeholder, icon: Icon }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-[1.5rem] bg-slate-900/40 border border-white/5 hover:border-white/10 transition-all duration-300 gap-5">
            <div className="flex items-center gap-5">
                {Icon && (
                    <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center shadow-inner">
                        <Icon size={22} />
                    </div>
                )}
                <div className="min-w-0">
                    <h4 className="text-[15px] font-bold text-white tracking-tight">{label}</h4>
                    {description && <p className="text-[11px] text-slate-500 mt-1 leading-tight font-medium">{description}</p>}
                </div>
            </div>
            <div className="relative w-full md:w-80">
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-slate-800/80 border border-white/10 rounded-xl px-5 py-3 text-[14px] text-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-600 transition-all"
                />
            </div>
        </div>
    );
};
