import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, Type, AlignLeft, Award, ArrowLeft, Send } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { createAssignment } from '../../api/assignmentApi';
import { getMyCourses } from '../../api/courseApi';
import { showSuccess, showError, showLoading } from '../../utils/sweetAlert';
import Swal from 'sweetalert2';

const CreateAssignment = () => {
    const navigate = useNavigate();
    const teacherId = localStorage.getItem('userId');
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        courseId: '',
        title: '',
        description: '',
        dueDate: '',
        maxMarks: 100
    });

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await getMyCourses(teacherId);
                setCourses(data);
                if (data.length > 0) {
                    setFormData(prev => ({ ...prev, courseId: data[0].id }));
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };
        fetchCourses();
    }, [teacherId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.courseId || !formData.title || !formData.dueDate) {
            showError('Required Fields', 'Please fill in all required fields.');
            return;
        }

        showLoading('Creating assignment and notifying students...');
        setLoading(true);
        try {
            const assignmentData = {
                ...formData,
                teacherId: parseInt(teacherId),
                courseId: parseInt(formData.courseId),
                maxMarks: parseInt(formData.maxMarks)
            };
            await createAssignment(assignmentData);
            Swal.close();
            await showSuccess('Assignment Created', 'Your assignment has been created and all enrolled students have been notified.');
            navigate('/teacher/assignments');
        } catch (error) {
            Swal.close();
            showError('Error', error.response?.data?.message || 'Failed to create assignment.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto text-white space-y-8">
            {/* Header */}
            <div className="space-y-4">
                <Link 
                    to="/teacher/assignments" 
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-500 transition-colors group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Assignments</span>
                </Link>
                <h1 className="text-3xl font-bold font-orbitron">Create <span className="text-indigo-400">New Assignment</span></h1>
                <p className="text-slate-400">Define tasks and deadlines for your students. Automated notifications will be sent upon creation.</p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-8"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Course Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Type size={16} className="text-indigo-500" />
                            Target Course
                        </label>
                        <select
                            name="courseId"
                            value={formData.courseId}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500/50 transition-all text-white"
                            required
                        >
                            {courses.map(course => (
                                <option key={course.id} value={course.id} className="bg-slate-900">
                                    {course.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <FileText size={16} className="text-indigo-500" />
                            Assignment Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g., Advanced React Hooks Deep Dive"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500/50 transition-all"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <AlignLeft size={16} className="text-indigo-500" />
                            Description & Instructions
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={5}
                            placeholder="Provide detailed instructions, requirements, and submission guidelines..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500/50 transition-all resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Due Date */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Calendar size={16} className="text-indigo-500" />
                                Due Date & Time
                            </label>
                            <input
                                type="datetime-local"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500/50 transition-all [color-scheme:dark]"
                                required
                            />
                        </div>

                        {/* Max Marks */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Award size={16} className="text-indigo-500" />
                                Maximum Marks
                            </label>
                            <input
                                type="number"
                                name="maxMarks"
                                value={formData.maxMarks}
                                onChange={handleChange}
                                min="0"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500/50 transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/5">
                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold py-4 rounded-xl shadow-xl shadow-indigo-500/20 hover:opacity-90 transition-all disabled:opacity-50"
                        >
                            <Send size={20} />
                            Publish Assignment
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default CreateAssignment;
