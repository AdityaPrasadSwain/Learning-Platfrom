import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, Clock, AlertCircle, CheckCircle, ChevronRight, BookOpen, ExternalLink, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAssignmentsByCourse } from '../../api/assignmentApi';
import { getMyEnrollments } from '../../api/enrollmentApi';
import { format } from 'date-fns';

const StudentAssignments = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState('all');
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const enrollments = await getMyEnrollments();
                setCourses(enrollments);

                // Fetch assignments for all courses
                const allAssignmentsPromises = enrollments.map(e => 
                    getAssignmentsByCourse(e.courseId, userId)
                );
                const assignmentsResults = await Promise.all(allAssignmentsPromises);
                
                // Flatten and sort by due date
                const flattened = assignmentsResults.flat().sort((a, b) => 
                    new Date(a.dueDate) - new Date(b.dueDate)
                );
                setAssignments(flattened);
            } catch (error) {
                console.error('Error fetching student assignments:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId]);

    const filteredAssignments = selectedCourse === 'all' 
        ? assignments 
        : assignments.filter(a => a.courseId === parseInt(selectedCourse));

    const getStatusInfo = (assignment) => {
        const now = new Date();
        const due = new Date(assignment.dueDate);
        
        if (assignment.isSubmitted) return { label: 'Submitted', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle };
        if (due < now) return { label: 'Missing', color: 'text-red-500 bg-red-500/10 border-red-500/20', icon: AlertCircle };
        return { label: 'Pending', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', icon: Clock };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 text-white pb-12">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold font-orbitron">My <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Assignments</span></h1>
                <p className="text-slate-400 mt-1">Manage your coursework and track upcoming deadlines.</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <button 
                    onClick={() => setSelectedCourse('all')}
                    className={`px-5 py-2 rounded-xl text-sm font-bold transition-all border ${selectedCourse === 'all' ? 'bg-cyan-500 border-cyan-400 text-white shadow-lg shadow-cyan-500/20' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                >
                    All Courses
                </button>
                {courses.map(e => (
                    <button 
                        key={e.courseId}
                        onClick={() => setSelectedCourse(e.courseId.toString())}
                        className={`px-5 py-2 rounded-xl text-sm font-bold transition-all border ${selectedCourse === e.courseId.toString() ? 'bg-cyan-500 border-cyan-400 text-white shadow-lg shadow-cyan-500/20' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                    >
                        {e.courseTitle}
                    </button>
                ))}
            </div>

            {filteredAssignments.length === 0 ? (
                <div className="glass-panel p-16 text-center">
                    <FileText size={56} className="mx-auto text-slate-600 mb-4" />
                    <h2 className="text-xl font-bold mb-2">No assignments found</h2>
                    <p className="text-slate-400">Great job! You have no pending assignments for this selection.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredAssignments.map((assignment, index) => {
                        const status = getStatusInfo(assignment);
                        const StatusIcon = status.icon;
                        return (
                            <motion.div
                                key={assignment.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="glass-panel group hover:border-cyan-500/30 transition-all flex flex-col"
                            >
                                <div className="p-6 flex-1 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1 min-w-0">
                                            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest truncate block">
                                                {assignment.courseTitle}
                                            </span>
                                            <h3 className="text-lg font-bold group-hover:text-cyan-400 transition-colors line-clamp-1">
                                                {assignment.title}
                                            </h3>
                                        </div>
                                        <div className={`p-2 rounded-xl border ${status.color}`}>
                                            <StatusIcon size={16} />
                                        </div>
                                    </div>

                                    <p className="text-slate-400 text-sm line-clamp-2 min-h-[40px]">
                                        {assignment.description || 'No instructions provided.'}
                                    </p>

                                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-1">
                                                <Calendar size={10} /> Due Date
                                            </p>
                                            <p className="text-xs font-bold">{format(new Date(assignment.dueDate), 'MMM dd, yyyy')}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-1">
                                                <Award size={10} /> Points
                                            </p>
                                            <p className="text-xs font-bold text-cyan-400">{assignment.maxMarks} Max</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-white/[0.02] border-t border-white/5">
                                    <button
                                        onClick={() => navigate(`/student/assignment/${assignment.id}`)}
                                        className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${assignment.isSubmitted ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 hover:opacity-90'}`}
                                    >
                                        {assignment.isSubmitted ? 'View Submission' : 'Submit Assignment'}
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default StudentAssignments;
