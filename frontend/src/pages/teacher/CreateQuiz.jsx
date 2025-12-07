import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, ArrowLeft } from 'lucide-react';
import TeacherNavbar from '../../components/TeacherNavbar';
import Footer from '../../components/Footer';
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

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const data = await getAllCourses();
            setCourses(data);
        } catch (error) {
            console.error('Failed to fetch courses:', error);
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
        setFormData(prev => ({
            ...prev,
            courseId: value ? parseInt(value) : ''
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            showError('Please enter a quiz title');
            return;
        }

        setLoading(true);
        try {
            const quiz = await createQuiz({
                ...formData,
                courseId: formData.courseId || null
            });
            showSuccess('Quiz created successfully!');
            navigate(`/teacher/quiz/${quiz.id}`);
        } catch (error) {
            showError(error.response?.data?.message || 'Failed to create quiz');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden">

            <div className="relative z-10">
                <TeacherNavbar />
                <div className="pt-24 pb-12 px-6">
                    <div className="container mx-auto max-w-2xl">
                        <button
                            onClick={() => navigate('/teacher/quizzes')}
                            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
                        >
                            <ArrowLeft size={20} /> Back to Quizzes
                        </button>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8"
                        >
                            <h1 className="text-2xl font-bold text-white mb-6">Create New Quiz</h1>

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

                                <label className="block text-gray-300 mb-2">Course (Optional)</label>
                                <select
                                    value={formData.courseId ? formData.courseId.toString() : ''}
                                    onChange={(e) => handleCourseChange(e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                                >
                                    <option value="" disabled>No Course</option>
                                    {courses.map(course => (
                                        <option key={course.id} value={course.id.toString()}>{course.title}</option>
                                    ))}
                                </select>

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
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                                    ) : (
                                        <>
                                            <Save size={20} /> Create Quiz
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

export default CreateQuiz;
