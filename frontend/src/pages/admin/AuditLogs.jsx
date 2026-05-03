import React, { useState, useEffect } from 'react';
import { Clock, Shield, ArrowLeft, Activity, Info, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAuditLogs } from '../../api/adminApi';
import { showError } from '../../utils/sweetAlert';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const data = await getAuditLogs();
            setLogs(data);
        } catch (error) {
            console.error('Error fetching audit logs:', error);
            showError('Error', 'Failed to load audit logs');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="text-slate-500 dark:text-slate-400 font-orbitron">Retrieving Activity Logs...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12 transition-colors duration-500">
            {/* Header Section */}
            <div className="space-y-2">
                <Link
                    to="/admin/dashboard"
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-500 transition-colors group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Dashboard</span>
                </Link>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/10 rounded-2xl">
                        <Activity className="text-indigo-500" size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">Audit Logs</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Real-time chronicle of administrative actions and system changes.</p>
                    </div>
                </div>
            </div>

            {/* Logs List Container */}
            <div className="glass-panel overflow-hidden border border-slate-200 dark:border-white/10 shadow-xl">
                <div className="bg-slate-50 dark:bg-white/[0.02] px-6 py-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <Shield size={18} className="text-indigo-500" />
                        <span className="text-sm font-bold uppercase tracking-wider">System Security Journal</span>
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Live Updates</div>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-white/5">
                    {logs.length === 0 ? (
                        <div className="py-20 text-center">
                            <Info className="mx-auto text-slate-300 dark:text-slate-700 mb-4" size={48} />
                            <p className="text-slate-500 dark:text-slate-400 italic">No activity logs recorded yet.</p>
                        </div>
                    ) : (
                        logs.map((log) => (
                            <div key={log.id} className="p-6 hover:bg-slate-50 dark:hover:bg-white/[0.01] transition-all group">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className={`mt-1 p-2.5 rounded-xl border ${
                                            log.action.toLowerCase().includes('delete') || log.action.toLowerCase().includes('reject')
                                            ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                            : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                        }`}>
                                            <Clock size={18} />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-slate-900 dark:text-white font-medium leading-relaxed">
                                                <span className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/5 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md mr-1">{log.action}</span>
                                                <span className="text-slate-600 dark:text-slate-400">on</span>
                                                <span className="font-bold ml-1 text-slate-800 dark:text-slate-200">{log.entityType}</span>
                                                <span className="text-slate-400 ml-1">#{log.entityId}</span>
                                            </p>
                                            <div className="flex items-center gap-3 text-xs">
                                                <span className="text-slate-500 font-medium">Actor ID: <span className="text-slate-900 dark:text-white">{log.adminId}</span></span>
                                                <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
                                                <span className="text-slate-400">{new Date(log.timestamp).toLocaleDateString()} at {new Date(log.timestamp).toLocaleTimeString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="hidden md:flex flex-col items-end shrink-0">
                                        <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                            Audit ID: {log.id}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Footer Note */}
            <div className="flex items-center justify-center gap-2 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
                <AlertTriangle className="text-amber-500" size={16} />
                <p className="text-xs text-amber-600 dark:text-amber-500/80 font-medium">Audit logs are immutable and cannot be deleted by standard administrators.</p>
            </div>
        </div>
    );
};

export default AuditLogs;
