import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, FileQuestion, Clock, BookOpen } from 'lucide-react';
import { createQuiz } from '../../api/quizApi';
import { getAllCourses } from '../../api/courseApi';
import { showSuccess, showError } from '../../utils/sweetAlert';

const CreateQuiz = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        courseId: '',
        duration: 30,
        totalMarks: 0
    });

    useEffect(() => { fetchCourses(); }, []);

    const fetchCourses = async () => {
        try {
            const data = await getAllCourses();
            setCourses(data);
        } catch (error) {
            showError('Failed to load courses');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'courseId' || name === 'duration' ? (value ? parseInt(value) : '') : value
        }));
    };

    const handleCourseChange = (value) => {
        setFormData(prev => ({ ...prev, courseId: value ? parseInt(value) : '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) { showError('Please enter a quiz title'); return; }
        setLoading(true);
        try {
            const quiz = await createQuiz({ ...formData, courseId: formData.courseId || null });
            showSuccess('Quiz created successfully!');
            navigate(`/teacher/quiz/${quiz.id}`);
        } catch (error) {
            showError(error.response?.data?.message || 'Failed to create quiz');
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all";
    const labelClass = "block text-sm font-semibold text-gray-300 mb-2";

    return (
        <div className="min-h-screen text-white p-6 max-w-2xl mx-auto">
            <button
                onClick={() => navigate('/teacher/quizzes')}
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition group"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Back to Quizzes
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-3">
                        <FileQuestion size={28} className="text-purple-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold font-orbitron text-white">Create New Quiz</h1>
                        <p className="text-gray-400 text-sm mt-1">Build an engaging quiz for your students</p>
                    </div>
                </div>

                {/* Form Card */}
                <div className="glass-panel p-8 space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className={labelClass}>Quiz Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="Enter quiz title"
                                required
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className={inputClass}
                                placeholder="Enter quiz description"
                            />
                        </div>

                        <div>
                            <label className={labelClass}>
                                <BookOpen size={14} className="inline mr-1.5 text-cyan-400" />
                                Course (Optional)
                            </label>
                            <select
                                value={formData.courseId ? formData.courseId.toString() : ''}
                                onChange={(e) => handleCourseChange(e.target.value)}
                                className={inputClass + " cursor-pointer"}
                            >
                                <option value="" className="bg-gray-900">No Course</option>
                                {courses.map(course => (
                                    <option key={course.id} value={course.id.toString()} className="bg-gray-900">{course.title}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>
                                    <Clock size={14} className="inline mr-1.5 text-cyan-400" />
                                    Duration (minutes)
                                </label>
                                <input
                                    type="number"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    min="1"
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Total Marks</label>
                                <input
                                    type="number"
                                    name="totalMarks"
                                    value={formData.totalMarks}
                                    onChange={handleChange}
                                    min="0"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3.5 rounded-xl hover:opacity-90 hover:scale-[1.01] transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white" />
                            ) : (
                                <><Save size={18} /> Create Quiz</>
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default CreateQuiz;
