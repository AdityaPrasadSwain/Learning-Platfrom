import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Edit } from 'lucide-react';
import { getTeacherQuiz, updateQuiz } from '../../api/quizApi';
import { showSuccess, showError } from '../../utils/sweetAlert';
import api from '../../api/axiosConfig';

const EditQuiz = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', courseId: '', duration: 30 });

    useEffect(() => { fetchData(); }, [quizId]);

    const fetchData = async () => {
        try {
            const [quizData, coursesRes] = await Promise.all([
                getTeacherQuiz(quizId),
                api.get('/courses/teacher/my-courses')
            ]);
            setFormData({
                title: quizData.title,
                description: quizData.description || '',
                courseId: quizData.courseId || '',
                duration: quizData.duration || 30
            });
            setCourses(coursesRes.data);
        } catch (error) {
            showError('Failed to load quiz');
            navigate('/teacher/quizzes');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'courseId' || name === 'duration' ? (value ? parseInt(value) : '') : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) { showError('Please enter a quiz title'); return; }
        setSaving(true);
        try {
            await updateQuiz(quizId, { ...formData, courseId: formData.courseId || null });
            showSuccess('Quiz updated successfully!');
            navigate(`/teacher/quiz/${quizId}`);
        } catch (error) {
            showError(error.response?.data?.message || 'Failed to update quiz');
        } finally {
            setSaving(false);
        }
    };

    const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/30 transition-all";
    const labelClass = "block text-sm font-semibold text-gray-300 mb-2";

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 text-white">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-purple-400" />
            </div>
        );
    }

    return (
        <div className="text-white max-w-2xl mx-auto">
            <button
                onClick={() => navigate(`/teacher/quiz/${quizId}`)}
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition group"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Back to Quiz
            </button>

            <div className="flex items-center gap-4 mb-8">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-3">
                    <Edit size={28} className="text-purple-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold font-orbitron">Edit Quiz</h1>
                    <p className="text-gray-400 text-sm mt-1">Update your quiz details</p>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-8"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className={labelClass}>Quiz Title *</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange}
                            className={inputClass} placeholder="Enter quiz title" required />
                    </div>
                    <div>
                        <label className={labelClass}>Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange}
                            rows={4} className={inputClass} placeholder="Enter quiz description" />
                    </div>
                    <div>
                        <label className={labelClass}>Course (Optional)</label>
                        <select name="courseId" value={formData.courseId} onChange={handleChange}
                            className={inputClass + " cursor-pointer"}>
                            <option value="" className="bg-gray-900">No Course</option>
                            {courses.map(course => (
                                <option key={course.id} value={course.id} className="bg-gray-900">{course.title}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Duration (minutes)</label>
                        <input type="number" name="duration" value={formData.duration} onChange={handleChange}
                            min="1" className={inputClass} />
                    </div>
                    <button type="submit" disabled={saving}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3.5 rounded-xl hover:opacity-90 hover:scale-[1.01] transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                        {saving ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white" /> : <><Save size={18} /> Save Changes</>}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default EditQuiz;
