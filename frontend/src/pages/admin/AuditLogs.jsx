import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import ThreeBackground from '../../components/ThreeBackground';
import { Clock, Shield, ArrowLeft } from 'lucide-react';
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
            <div className="relative min-h-screen flex items-center justify-center">
                <ThreeBackground />
                <Navbar />
                <div className="text-white text-2xl">Loading audit logs...</div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen">
            <ThreeBackground />
            <Navbar />
            <div className="relative z-10 pt-24 px-6 max-w-7xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <a
                        href="/admin/dashboard"
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Back to Dashboard</span>
                    </a>
                    <h1 className="text-2xl font-bold font-orbitron text-white neon-text">Audit Logs</h1>
                </div>

                <div className="glass-panel overflow-hidden">
                    <div className="p-4 border-b border-white/10 bg-white/5">
                        <div className="flex items-center text-neon-blue">
                            <Shield size={20} className="mr-2" />
                            <span className="text-sm font-medium">System Activities</span>
                        </div>
                    </div>
                    <ul className="divide-y divide-white/10">
                        {logs.map((log) => (
                            <li key={log.id} className="p-4 hover:bg-white/5 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="bg-neon-blue/20 border border-neon-blue p-2 rounded-full mr-4">
                                            <Clock size={16} className="text-neon-blue" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">
                                                <span className="font-bold text-neon-blue">{log.action}</span> on {log.entityType} #{log.entityId}
                                            </p>
                                            <p className="text-xs text-gray-400">Performed by Admin #{log.adminId}</p>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AuditLogs;
