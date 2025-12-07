import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherRegistrationNavbar from '../../components/TeacherRegistrationNavbar';

import api from '../../services/api';
import Swal from 'sweetalert2';
import { CheckCircle, Clock, FileText, Award, XCircle, AlertCircle } from 'lucide-react';

const StartTeaching = () => {
    const navigate = useNavigate();
    const [resumeFile, setResumeFile] = useState(null);
    const [experience, setExperience] = useState('');
    const [bio, setBio] = useState('');
    const [applicationStatus, setApplicationStatus] = useState(null); // 'PENDING', 'APPROVED', 'REJECTED', or null

    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const checkStatus = async () => {
            const userId = localStorage.getItem('userId');
            if (userId) {
                try {
                    const response = await api.get('/teacher/application-status', { params: { userId } });
                    setApplicationStatus(response.data);

                    // Sync approval status to localStorage
                    if (response.data && response.data.status === 'APPROVED') {
                        localStorage.setItem('isApproved', 'true');
                    }
                } catch (error) {
                    console.error("Failed to fetch application status", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        checkStatus();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    const ApplicationTracker = ({ status, rejectionReason }) => {
        const steps = [
            { id: 1, label: 'Account Created', icon: CheckCircle },
            { id: 2, label: 'Application Submitted', icon: FileText },
            { id: 3, label: 'Under Review', icon: Clock },
            { id: 4, label: 'Final Decision', icon: status === 'REJECTED' ? XCircle : Award }
        ];

        const getStepStatus = (index) => {
            // Step 1 & 2 are always completed if we are here
            if (index < 2) return 'completed';

            if (status === 'PENDING') {
                if (index === 2) return 'active';
                return 'pending';
            }

            if (status === 'APPROVED' || status === 'REJECTED') {
                return 'completed'; // Step 3 is completed
            }
            return 'pending';
        };

        const getStepColor = (index, stepStatus) => {
            if (index === 3) {
                if (status === 'REJECTED') return 'text-red-500 border-red-500 bg-red-500/10';
                if (status === 'APPROVED') return 'text-green-500 border-green-500 bg-green-500/10';
                return 'text-gray-500 border-gray-600';
            }

            if (stepStatus === 'completed') return 'text-green-500 border-green-500 bg-green-500/10';
            if (stepStatus === 'active') return 'text-blue-400 border-blue-400 bg-blue-400/10 animate-pulse';
            return 'text-gray-600 border-gray-700';
        };

        return (
            <div className="w-full py-8">
                <div className="flex items-center justify-between relative px-4">
                    {/* Connecting Line */}
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-800 -z-10" />

                    {/* Progress Line */}
                    <div
                        className={`absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-gradient-to-r from-green-500 to-blue-500 -z-10 transition-all duration-1000`}
                        style={{
                            width: status === 'PENDING' ? '66%' : '100%'
                        }}
                    />

                    {steps.map((step, index) => {
                        const stepStatus = getStepStatus(index);
                        const isLast = index === steps.length - 1;
                        const isRejected = isLast && status === 'REJECTED';

                        return (
                            <div key={step.id} className="flex flex-col items-center group relative bg-gray-900 px-2">
                                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center mb-2 z-10 bg-gray-900 transition-all duration-300 ${getStepColor(index, stepStatus)}`}>
                                    <step.icon size={20} />
                                </div>
                                <span className={`text-xs md:text-sm font-medium ${stepStatus === 'pending' ? 'text-gray-500' : 'text-gray-200'} ${isRejected ? 'text-red-400' : ''}`}>
                                    {isLast && status === 'APPROVED' ? 'Approved' : isLast && status === 'REJECTED' ? 'Rejected' : step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Status Message */}
                <div className="mt-12 text-center bg-white/5 rounded-xl p-6 border border-white/10">
                    {status === 'PENDING' && (
                        <>
                            <h3 className="text-xl font-bold text-blue-400 mb-2">Application Under Review</h3>
                            <p className="text-gray-400">Our team is currently reviewing your profile. This usually takes 24-48 hours.</p>
                        </>
                    )}
                    {status === 'APPROVED' && (
                        <>
                            <h3 className="text-xl font-bold text-green-400 mb-2">Congratulations! 🎉</h3>
                            <p className="text-gray-400">Your application has been approved. You are now an official instructor.</p>
                        </>
                    )}
                    {status === 'REJECTED' && (
                        <>
                            <h3 className="text-xl font-bold text-red-500 mb-2">Application Rejected</h3>
                            <p className="text-gray-400 mb-4">Unfortunately, your application was not successful at this time.</p>
                            {rejectionReason && (
                                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 max-w-md mx-auto">
                                    <span className="text-red-300 font-medium block mb-1">Reason:</span>
                                    <p className="text-red-200 text-sm">{rejectionReason}</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        );
    };

    // Main Component Logic Updates
    if (applicationStatus?.status) {
        return (
            <div className="min-h-screen text-white relative overflow-hidden flex items-center justify-center">

                <TeacherRegistrationNavbar />
                <div className="z-10 bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl border border-white/10 text-center w-full max-w-4xl shadow-2xl mt-20">
                    <div className="mb-6 flex items-center justify-center gap-2">
                        <span className="text-xs uppercase tracking-widest text-gray-500">Tracking ID:</span>
                        <span className="font-mono text-purple-400">#APP-{localStorage.getItem('userId') || '0000'}</span>
                    </div>

                    <ApplicationTracker
                        status={applicationStatus.status}
                        rejectionReason={applicationStatus.rejectionReason}
                    />

                    <div className="mt-8">
                        {applicationStatus.status === 'APPROVED' ? (
                            <button
                                onClick={() => navigate('/teacher/dashboard')}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg"
                            >
                                Go to Teacher Dashboard
                            </button>
                        ) : applicationStatus.status === 'REJECTED' ? (
                            <button
                                onClick={() => setApplicationStatus(null)}
                                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 mx-auto"
                            >
                                <FileText size={20} /> Re-apply
                            </button>
                        ) : (
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
                            >
                                <Clock size={16} /> Refresh Status
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('userId');

        if (!resumeFile) {
            Swal.fire('Error', 'Please upload your resume', 'error');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('userId', userId);
            formData.append('experience', experience);
            formData.append('bio', bio);
            formData.append('resume', resumeFile);

            await api.post('/teacher/apply', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            Swal.fire({
                title: 'Application Submitted',
                text: 'Your application is under review. You will be notified once approved.',
                icon: 'success',
                background: '#1f2937',
                color: '#fff'
            });
            // Update local state to show pending immediately without refresh
            setApplicationStatus({ status: 'PENDING' });
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to submit application',
                icon: 'error',
                background: '#1f2937',
                color: '#fff'
            });
        }
    };

    return (
        <div className="min-h-screen text-white relative overflow-hidden">

            <TeacherRegistrationNavbar />
            <div className="container mx-auto px-6 pt-32 flex justify-center">
                <div className="w-full max-w-lg bg-gray-900/60 backdrop-blur-xl p-8 rounded-2xl border border-white/10">
                    <h2 className="text-3xl font-bold mb-6 text-center text-purple-400">Teacher Application</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm mb-1">Resume (PDF/DOC)</label>
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => setResumeFile(e.target.files[0])}
                                className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500/10 file:text-purple-400 hover:file:bg-purple-500/20"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Years of Experience</label>
                            <input
                                type="text"
                                value={experience}
                                onChange={(e) => setExperience(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Bio / Motivation</label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white h-32"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded font-bold"
                            disabled={!resumeFile || !experience || !bio}
                        >
                            Submit Application
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StartTeaching;
