import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Upload, Calendar, Award, CheckCircle, Clock, AlertCircle, Send, ExternalLink } from 'lucide-react';
import { getAssignmentById, submitAssignment, getStudentSubmission } from '../../api/assignmentApi';
import { showSuccess, showError, showLoading } from '../../utils/sweetAlert';
import { format } from 'date-fns';
import Swal from 'sweetalert2';

const SubmitAssignment = () => {
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState(null);
    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fileUrl, setFileUrl] = useState('');
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [assignmentData, submissionData] = await Promise.all([
                    getAssignmentById(assignmentId, userId),
                    getStudentSubmission(assignmentId, userId)
                ]);
                setAssignment(assignmentData);
                setSubmission(submissionData);
                if (submissionData) setFileUrl(submissionData.fileUrl);
            } catch (error) {
                console.error('Error fetching assignment details:', error);
                showError('Error', 'Failed to load assignment details.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [assignmentId, userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!fileUrl) return;

        showLoading('Uploading submission...');
        try {
            const submissionData = {
                assignmentId: parseInt(assignmentId),
                studentId: parseInt(userId),
                fileUrl: fileUrl
            };
            await submitAssignment(submissionData);
            Swal.close();
            await showSuccess('Submitted!', 'Your assignment has been submitted successfully.');
            navigate('/student/assignments');
        } catch (error) {
            Swal.close();
            showError('Submission Failed', 'Failed to submit assignment. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    const isPastDue = new Date(assignment?.dueDate) < new Date();

    return (
        <div className="max-w-5xl mx-auto space-y-8 text-white pb-12">
            {/* Header */}
            <div className="space-y-4">
                <Link to="/student/assignments" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-cyan-500 transition-colors group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Assignments</span>
                </Link>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold font-orbitron">{assignment?.title}</h1>
                        <p className="text-slate-400 mt-1">{assignment?.courseTitle}</p>
                    </div>
                    <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 font-bold text-sm ${submission ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : isPastDue ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                        {submission ? <CheckCircle size={16} /> : isPastDue ? <AlertCircle size={16} /> : <Clock size={16} />}
                        {submission ? 'Submitted' : isPastDue ? 'Past Due' : 'Not Submitted'}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Details Side */}
                <div className="lg:col-span-2 space-y-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-8 space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <FileText size={16} className="text-cyan-400" />
                                Instructions
                            </h2>
                            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                                {assignment?.description || 'No specific instructions provided.'}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Deadline</p>
                                <p className="font-bold text-slate-200">{format(new Date(assignment?.dueDate), 'MMM dd, yyyy HH:mm')}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Maximum Points</p>
                                <p className="font-bold text-cyan-400">{assignment?.maxMarks} Points</p>
                            </div>
                        </div>
                    </motion.div>

                    {submission?.feedback && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-6 space-y-3">
                            <h3 className="font-bold text-indigo-400 flex items-center gap-2">
                                <Award size={18} />
                                Instructor Feedback
                            </h3>
                            <p className="text-sm text-slate-300 leading-relaxed italic">"{submission.feedback}"</p>
                            {submission.marks !== null && (
                                <div className="pt-2">
                                    <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Score: </span>
                                    <span className="text-xl font-bold text-white">{submission.marks}</span>
                                    <span className="text-sm text-slate-500 font-bold"> / {assignment.maxMarks}</span>
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>

                {/* Submission Side */}
                <div className="lg:col-span-1">
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel p-6 space-y-6">
                        <h2 className="text-lg font-bold font-orbitron flex items-center gap-2">
                            <Upload size={20} className="text-cyan-400" />
                            {submission ? 'My Submission' : 'Submit Work'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Resource URL</label>
                                <input
                                    type="url"
                                    value={fileUrl}
                                    onChange={(e) => setFileUrl(e.target.value)}
                                    placeholder="Link to your Google Drive / PDF / Repo"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 transition-all text-sm"
                                    disabled={!!submission && submission.marks !== null}
                                    required
                                />
                                <p className="text-[10px] text-slate-500 italic">Please ensure the link is publicly accessible.</p>
                            </div>

                            {submission ? (
                                <div className="space-y-4">
                                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle size={20} className="text-emerald-500" />
                                            <div>
                                                <p className="text-xs font-bold">Work Submitted</p>
                                                <p className="text-[10px] text-slate-500">{format(new Date(submission.submittedAt), 'MMM dd, HH:mm')}</p>
                                            </div>
                                        </div>
                                        <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg hover:bg-cyan-500/20 transition-all">
                                            <ExternalLink size={16} />
                                        </a>
                                    </div>
                                    
                                    {submission.marks === null && (
                                        <motion.button
                                            type="submit"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all text-sm"
                                        >
                                            Update Submission
                                        </motion.button>
                                    )}
                                </div>
                            ) : (
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                                >
                                    <Send size={18} />
                                    Turn in Assignment
                                </motion.button>
                            )}
                        </form>

                        <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl space-y-2">
                            <div className="flex items-center gap-2 text-amber-500">
                                <AlertCircle size={14} />
                                <span className="text-[10px] font-bold uppercase">Important</span>
                            </div>
                            <p className="text-[10px] text-slate-400 leading-relaxed">
                                Submitting after the deadline will mark your work as <span className="text-amber-500 font-bold">LATE</span>. Once graded, submissions cannot be modified.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default SubmitAssignment;
