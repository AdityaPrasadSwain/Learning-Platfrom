import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, FileText, Plus, ChevronRight, AlertCircle, Filter, BookOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getAssignmentsByTeacher } from '../../api/assignmentApi';
import { format } from 'date-fns';

const AssignmentList = () => {
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const teacherId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const data = await getAssignmentsByTeacher(teacherId);
                setAssignments(data);
            } catch (error) {
                console.error('Error fetching assignments:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAssignments();
    }, [teacherId]);

    const getStatusColor = (dueDate) => {
        const now = new Date();
        const due = new Date(dueDate);
        if (due < now) return 'bg-red-500/10 text-red-500 border-red-500/20';
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-orbitron">Assignment <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Management</span></h1>
                    <p className="text-slate-400 mt-1">Create and track assignments across all your courses.</p>
                </div>
                <Link to="/teacher/assignment/create">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-indigo-500/20 transition-all"
                    >
                        <Plus size={18} /> Create Assignment
                    </motion.button>
                </Link>
            </div>

            {assignments.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-16 text-center">
                    <FileText size={56} className="mx-auto text-slate-600 mb-4" />
                    <h2 className="text-xl font-bold mb-2">No assignments yet</h2>
                    <p className="text-slate-400 mb-6 max-w-md mx-auto">You haven't created any assignments yet. Start by creating one for your enrolled students.</p>
                    <Link to="/teacher/assignment/create">
                        <button className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-sm font-bold">
                            Create First Assignment
                        </button>
                    </Link>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {assignments.map((assignment, index) => (
                        <motion.div
                            key={assignment.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="glass-panel group hover:border-indigo-500/30 transition-all p-6"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/5 px-2 py-0.5 rounded-full border border-indigo-500/10">
                                        {assignment.courseTitle}
                                    </span>
                                    <h3 className="text-xl font-bold group-hover:text-indigo-400 transition-colors line-clamp-1">{assignment.title}</h3>
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusColor(assignment.dueDate)}`}>
                                    {new Date(assignment.dueDate) < new Date() ? 'Past Due' : 'Active'}
                                </span>
                            </div>

                            <p className="text-slate-400 text-sm line-clamp-2 mb-6 min-h-[40px]">
                                {assignment.description || 'No description provided.'}
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                                        <Calendar size={14} />
                                        <span className="text-[10px] font-bold uppercase">Due Date</span>
                                    </div>
                                    <p className="text-xs font-bold">{format(new Date(assignment.dueDate), 'MMM dd, yyyy')}</p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                                        <Clock size={14} />
                                        <span className="text-[10px] font-bold uppercase">Max Marks</span>
                                    </div>
                                    <p className="text-xs font-bold">{assignment.maxMarks} Points</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => navigate(`/teacher/assignment/${assignment.id}/submissions`)}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 hover:opacity-90 transition-all"
                                >
                                    View Submissions
                                    <ChevronRight size={16} />
                                </button>
                                <button className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl border border-white/5 transition-all">
                                    <Plus size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AssignmentList;
