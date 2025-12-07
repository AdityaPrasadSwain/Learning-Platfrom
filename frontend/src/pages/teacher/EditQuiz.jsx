import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, ArrowLeft } from 'lucide-react';
import TeacherNavbar from '../../components/TeacherNavbar';
import Footer from '../../components/Footer';

import { getTeacherQuiz, updateQuiz } from '../../api/quizApi';
import { showSuccess, showError } from '../../utils/sweetAlert';
import axios from 'axios';

const EditQuiz = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        courseId: '',
        duration: 30
    });

    useEffect(() => {
        fetchData();
    }, [quizId]);

    const fetchData = async () => {
        try {
            const [quizData, coursesResponse] = await Promise.all([
                getTeacherQuiz(quizId),
                axios.get('http://localhost:8080/api/courses/my-courses', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
            ]);

            setFormData({
                title: quizData.title,
                description: quizData.description || '',
                courseId: quizData.courseId || '',
                duration: quizData.duration || 30
            });
            setCourses(coursesResponse.data);
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

    const handleCourseChange = (e) => {
        setFormData(prev => ({
            ...prev,
            courseId: e.target.value ? parseInt(e.target.value) : ''
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            showError('Please enter a quiz title');
            return;
        }

        setSaving(true);
        try {
            await updateQuiz(quizId, {
                ...formData,
                courseId: formData.courseId || null
            });
            showSuccess('Quiz updated successfully!');
            navigate(`/teacher/quiz/${quizId}`);
        } catch (error) {
            showError(error.response?.data?.message || 'Failed to update quiz');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen relative overflow-hidden flex items-center justify-center">

                <div className="relative z-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden">

            <div className="relative z-10">
                <TeacherNavbar />
                <div className="pt-24 pb-12 px-6">
                    <div className="container mx-auto max-w-2xl">
                        <button
                            onClick={() => navigate(`/teacher/quiz/${quizId}`)}
                            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
                        >
                            <ArrowLeft size={20} /> Back to Quiz
                        </button>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8"
                        >
                            <h1 className="text-2xl font-bold text-white mb-6">Edit Quiz</h1>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-gray-300 mb-2">Quiz Title *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                                        placeholder="Enter quiz title"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-300 mb-2">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                                        placeholder="Enter quiz description"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-300 mb-2">Course (Optional)</label>
                                    <select
                                        name="courseId"
                                        value={formData.courseId}
                                        onChange={handleCourseChange}
                                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                                    >
                                        <option value="">No Course</option>
                                        {courses.map(course => (
                                            <option key={course.id} value={course.id}>
                                                {course.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-300 mb-2">Duration (minutes)</label>
                                    <input
                                        type="number"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleChange}
                                        min="1"
                                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
                                >
                                    {saving ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                                    ) : (
                                        <>
                                            <Save size={20} /> Save Changes
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default EditQuiz;
