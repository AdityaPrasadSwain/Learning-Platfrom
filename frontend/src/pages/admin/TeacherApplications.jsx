import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import ThreeBackground from '../../components/ThreeBackground';
import { Search, CheckCircle, XCircle, ArrowLeft, FileText } from 'lucide-react';
import { getPendingApplications, approveApplication, rejectApplication } from '../../api/adminApi';
import { showSuccess, showError, showConfirm, showLoading } from '../../utils/sweetAlert';
import Swal from 'sweetalert2';

const TeacherApplications = () => {
    const [applications, setApplications] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

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
                console.error('Error approving application:', error);
                Swal.close();
                showError('Error', 'Failed to approve application');
            }
        }
    };

    const handleReject = async (app) => {
        const result = await Swal.fire({
            title: 'Reject Application?',
            text: `Please provide a reason for rejecting ${app.user.username}:`,
            input: 'text',
            inputPlaceholder: 'Reason for rejection...',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, reject it!',
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to write a reason!'
                }
            }
        });

        if (result.isConfirmed) {
            const reason = result.value;
            showLoading('Rejecting application...');
            try {
                await rejectApplication(app.id, reason);
                Swal.close();
                await showSuccess('Rejected', 'Application has been rejected');
                fetchApplications();
            } catch (error) {
                console.error('Error rejecting application:', error);
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
            <div className="relative min-h-screen flex items-center justify-center">
                <ThreeBackground />
                <Navbar />
                <div className="text-white text-2xl font-orbitron animate-pulse">Loading applications...</div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen">
            <ThreeBackground />
            <Navbar />
            <div className="relative z-10 pt-24 px-6 max-w-7xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <a
                            href="/admin/dashboard"
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft size={20} />
                            <span>Back to Dashboard</span>
                        </a>
                        <h1 className="text-2xl font-bold font-orbitron text-white neon-text">Teacher Applications</h1>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neon-blue" size={20} />
                        <input
                            type="text"
                            placeholder="Search applicants..."
                            className="pl-10 pr-4 py-2 glass-panel text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="glass-panel overflow-hidden">
                    {applications.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">
                            No pending applications found.
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-white/5 border-b border-white/10">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-semibold text-neon-blue uppercase tracking-wider">Applicant</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-neon-blue uppercase tracking-wider">Experience</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-neon-blue uppercase tracking-wider">Bio</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-neon-blue uppercase tracking-wider">Resume</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-neon-blue uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {filteredApplications.map((app) => (
                                    <tr key={app.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="text-sm font-medium text-white">{app.user.username}</div>
                                                <div className="text-sm text-gray-400">{app.user.email}</div>
                                                <div className="text-xs text-gray-500 mt-1">Submitted: {new Date(app.submittedAt).toLocaleDateString()}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-300">
                                            {app.experience}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate" title={app.bio}>
                                            {app.bio}
                                        </td>
                                        <td className="px-6 py-4">
                                            <a
                                                href={app.resumeUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-neon-blue hover:text-neon-purple flex items-center gap-1 text-sm"
                                            >
                                                <FileText size={16} /> View Resume
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium space-x-2">
                                            <button
                                                onClick={() => handleApprove(app)}
                                                className="text-green-400 hover:text-green-300 transition-colors p-1"
                                                title="Approve"
                                            >
                                                <CheckCircle size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleReject(app)}
                                                className="text-red-400 hover:text-red-300 transition-colors p-1"
                                                title="Reject"
                                            >
                                                <XCircle size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherApplications;
