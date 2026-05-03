import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, ArrowLeft, FileText, User, Mail, Briefcase, Info } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getPendingApplications, approveApplication, rejectApplication } from '../../api/adminApi';
import { showSuccess, showError, showConfirm, showLoading, showInput } from '../../utils/sweetAlert';
import Swal from 'sweetalert2';

const TeacherApplications = () => {
    const [applications, setApplications] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const data = await getPendingApplications();
            setApplications(data);
        } catch (error) {
            console.error('Error fetching applications:', error);
            showError('Error', 'Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (app) => {
        const confirmed = await showConfirm(
            'Approve Teacher?',
            `Are you sure you want to approve ${app.user.username}?`
        );
        if (confirmed) {
            showLoading('Approving application...');
            try {
                await approveApplication(app.id);
                Swal.close();
                await showSuccess('Approved!', `${app.user.username} is now a teacher`);
                fetchApplications();
            } catch (error) {
                Swal.close();
                showError('Error', 'Failed to approve application');
            }
        }
    };

    const handleReject = async (app) => {
        const reason = await showInput(
            'Reject Application?',
            `Please provide a reason for rejecting ${app.user.username}:`,
            'Reason for rejection...'
        );

        if (reason) {
            showLoading('Rejecting application...');
            try {
                await rejectApplication(app.id, reason);
                Swal.close();
                await showSuccess('Rejected', 'Application has been rejected');
                fetchApplications();
            } catch (error) {
                Swal.close();
                showError('Error', 'Failed to reject application');
            }
        }
    };

    const filteredApplications = applications.filter(app =>
        app.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="text-slate-500 dark:text-slate-400 font-orbitron">Processing Applications...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12 transition-colors duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <Link
                        to="/admin/dashboard"
                        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-500 transition-colors group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Dashboard</span>
                    </Link>
                    <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">Teacher Applications</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Review and vet potential instructors for the platform.</p>
                </div>

                <div className="relative group max-w-md w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search applicants..."
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table Section */}
            <div className="glass-panel overflow-hidden border border-slate-200 dark:border-white/10 shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-white/[0.02] border-b border-slate-200 dark:border-white/10">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Applicant</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">Background</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">Credentials</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {filteredApplications.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 italic">No pending applications at this time.</td>
                                </tr>
                            ) : (
                                filteredApplications.map((app) => (
                                    <tr key={app.id} className="group hover:bg-slate-50 dark:hover:bg-white/[0.01] transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 font-bold">
                                                    {app.user.username[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 dark:text-white">{app.user.username}</div>
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                        <Mail size={12} />
                                                        {app.user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="space-y-1">
                                                <div className="inline-flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300 font-medium">
                                                    <Briefcase size={14} className="text-slate-400" />
                                                    {app.experience}
                                                </div>
                                                <div className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1">
                                                    <Info size={10} />
                                                    Submitted: {new Date(app.submittedAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <a
                                                href={app.resumeUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-bold hover:bg-indigo-500 hover:text-white transition-all border border-slate-200 dark:border-white/5 shadow-sm"
                                            >
                                                <FileText size={16} />
                                                View Portfolio
                                            </a>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleApprove(app)}
                                                    className="p-2.5 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-xl transition-all transform hover:scale-110 shadow-sm"
                                                    title="Approve Application"
                                                >
                                                    <CheckCircle size={20} />
                                                </button>
                                                <button
                                                    onClick={() => handleReject(app)}
                                                    className="p-2.5 bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white rounded-xl transition-all transform hover:scale-110 shadow-sm"
                                                    title="Reject Application"
                                                >
                                                    <XCircle size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TeacherApplications;
