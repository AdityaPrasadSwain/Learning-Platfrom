import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, FileText, CheckCircle, Clock, AlertCircle, Award, Send } from 'lucide-react';
import { getSubmissionsByAssignment, gradeSubmission, getAssignmentById } from '../../api/assignmentApi';
import { showSuccess, showError, showLoading } from '../../utils/sweetAlert';
import { format } from 'date-fns';
import Swal from 'sweetalert2';

const GradingPage = () => {
    const { assignmentId } = useParams();
    const [assignment, setAssignment] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [gradingData, setGradingData] = useState({ marks: '', feedback: '' });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [assignmentData, submissionsData] = await Promise.all([
                getAssignmentById(assignmentId),
                getSubmissionsByAssignment(assignmentId)
            ]);
            setAssignment(assignmentData);
            setSubmissions(submissionsData);
        } catch (error) {
            console.error('Error fetching grading data:', error);
            showError('Error', 'Failed to load submissions.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [assignmentId]);

    const handleGradeSubmit = async (e) => {
        e.preventDefault();
        if (!gradingData.marks) return;

        showLoading('Submitting grade and notifying student...');
        try {
            await gradeSubmission({
                submissionId: selectedSubmission.id,
                marks: parseInt(gradingData.marks),
                feedback: gradingData.feedback
            });
            Swal.close();
            await showSuccess('Graded!', 'The student has been notified of their grade.');
            setSelectedSubmission(null);
            setGradingData({ marks: '', feedback: '' });
            fetchData();
        } catch (error) {
            Swal.close();
            showError('Error', 'Failed to submit grade.');
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'SUBMITTED': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'LATE': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'MISSING': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 text-white pb-12">
            {/* Header */}
            <div className="space-y-4">
                <Link to="/teacher/assignments" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-500 transition-colors group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Assignments</span>
                </Link>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold font-orbitron">{assignment?.title}</h1>
                        <p className="text-slate-400 mt-1">Reviewing submissions for {assignment?.courseTitle}</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-center">
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Submissions</p>
                            <p className="text-lg font-bold">{submissions.length}</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-center">
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Max Points</p>
                            <p className="text-lg font-bold text-indigo-400">{assignment?.maxMarks}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Submissions List */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-lg font-bold font-orbitron text-slate-300 flex items-center gap-2">
                        <FileText size={20} className="text-indigo-500" />
                        Student Submissions
                    </h2>

                    {submissions.length === 0 ? (
                        <div className="glass-panel p-12 text-center">
                            <AlertCircle size={40} className="mx-auto text-slate-600 mb-3" />
                            <p className="text-slate-400">No submissions received yet.</p>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {submissions.map((sub) => (
                                <motion.div
                                    key={sub.id}
                                    whileHover={{ scale: 1.01 }}
                                    className={`glass-panel p-4 flex items-center justify-between gap-4 cursor-pointer border transition-all ${selectedSubmission?.id === sub.id ? 'border-indigo-500 bg-indigo-500/5' : 'border-white/5 hover:border-white/10'}`}
                                    onClick={() => {
                                        setSelectedSubmission(sub);
                                        setGradingData({ marks: sub.marks || '', feedback: sub.feedback || '' });
                                    }}
                                >
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-bold shrink-0 shadow-lg">
                                            {sub.studentName[0].toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold truncate">{sub.studentName}</p>
                                            <p className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
                                                <Clock size={10} />
                                                {sub.submittedAt ? format(new Date(sub.submittedAt), 'MMM dd, hh:mm a') : 'Not Submitted'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 shrink-0">
                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getStatusStyles(sub.status)}`}>
                                            {sub.status}
                                        </span>
                                        <div className="text-right min-w-[60px]">
                                            <p className="text-xs font-bold">{sub.marks !== null ? `${sub.marks}/${assignment.maxMarks}` : '--'}</p>
                                            <p className="text-[10px] text-slate-500 uppercase font-bold">{sub.marks !== null ? 'Graded' : 'Pending'}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Grading Panel */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        <h2 className="text-lg font-bold font-orbitron text-slate-300 mb-4 flex items-center gap-2">
                            <Award size={20} className="text-indigo-500" />
                            Grading Panel
                        </h2>

                        <AnimatePresence mode="wait">
                            {selectedSubmission ? (
                                <motion.div
                                    key={selectedSubmission.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="glass-panel p-6 space-y-6"
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                                            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                                <User size={24} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Student</p>
                                                <p className="text-lg font-bold">{selectedSubmission.studentName}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Attached File</p>
                                            <a 
                                                href={selectedSubmission.fileUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <FileText size={18} className="text-indigo-400" />
                                                    <span className="text-sm font-medium truncate max-w-[150px]">View Submission</span>
                                                </div>
                                                <CheckCircle size={16} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </a>
                                        </div>

                                        <form onSubmit={handleGradeSubmit} className="space-y-4 pt-4">
                                            <div className="space-y-2">
                                                <label className="text-xs text-slate-500 uppercase font-bold tracking-widest flex justify-between">
                                                    Assign Marks <span>Max: {assignment.maxMarks}</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    value={gradingData.marks}
                                                    onChange={(e) => setGradingData({ ...gradingData, marks: e.target.value })}
                                                    max={assignment.maxMarks}
                                                    min="0"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all font-bold"
                                                    placeholder="Enter score..."
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs text-slate-500 uppercase font-bold tracking-widest">Feedback</label>
                                                <textarea
                                                    value={gradingData.feedback}
                                                    onChange={(e) => setGradingData({ ...gradingData, feedback: e.target.value })}
                                                    rows={4}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all text-sm resize-none"
                                                    placeholder="Provide constructive feedback..."
                                                />
                                            </div>

                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                                            >
                                                <Send size={18} />
                                                Submit Grade
                                            </motion.button>
                                        </form>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="glass-panel p-12 text-center border-dashed border-2"
                                >
                                    <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
                                        <User size={32} />
                                    </div>
                                    <p className="text-slate-500 text-sm font-medium">Select a student from the list to begin grading.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GradingPage;
