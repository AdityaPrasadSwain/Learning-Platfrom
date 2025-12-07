import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, ToggleLeft, ToggleRight, FileQuestion, Clock, Award } from 'lucide-react';
import TeacherNavbar from '../../components/TeacherNavbar';
import Footer from '../../components/Footer';

import { getTeacherQuizzes, deleteQuiz, toggleQuizPublish } from '../../api/quizApi';
import { showSuccess, showError, showConfirm } from '../../utils/sweetAlert';

const QuizList = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const data = await getTeacherQuizzes();
            setQuizzes(data);
        } catch (error) {
            showError('Failed to load quizzes');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (quizId) => {
        const confirmed = await showConfirm('Delete Quiz', 'Are you sure you want to delete this quiz? This action cannot be undone.');
        if (confirmed) {
            try {
                await deleteQuiz(quizId);
                showSuccess('Quiz deleted successfully');
                fetchQuizzes();
            } catch (error) {
                showError('Failed to delete quiz');
            }
        }
    };

    const handleTogglePublish = async (quizId) => {
        try {
            await toggleQuizPublish(quizId);
            showSuccess('Quiz status updated');
            fetchQuizzes();
        } catch (error) {
            showError('Failed to update quiz status');
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden">

            <div className="relative z-10">
                <TeacherNavbar />
                <div className="pt-24 pb-12 px-6">
                    <div className="container mx-auto max-w-6xl">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">My Quizzes</h1>
                                <p className="text-gray-400">Create and manage your quizzes</p>
                            </div>
                            <Link
                                to="/teacher/quiz/create"
                                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:opacity-90 transition"
                            >
                                <Plus size={20} /> Create Quiz
                            </Link>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                            </div>
                        ) : quizzes.length === 0 ? (
                            <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                                <FileQuestion size={64} className="mx-auto text-gray-500 mb-4" />
                                <h3 className="text-xl text-white mb-2">No Quizzes Yet</h3>
                                <p className="text-gray-400 mb-4">Create your first quiz to get started</p>
                                <Link
                                    to="/teacher/quiz/create"
                                    className="inline-flex items-center gap-2 bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition"
                                >
                                    <Plus size={18} /> Create Quiz
                                </Link>
                            </div>
                        ) : (
                            <div className="grid gap-6">
                                {quizzes.map((quiz, index) => (
                                    <motion.div
                                        key={quiz.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-semibold text-white">{quiz.title}</h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${quiz.isPublished
                                                        ? 'bg-green-500/20 text-green-400'
                                                        : 'bg-yellow-500/20 text-yellow-400'
                                                        }`}>
                                                        {quiz.isPublished ? 'Published' : 'Draft'}
                                                    </span>
                                                </div>
                                                <p className="text-gray-400 mb-4">{quiz.description || 'No description'}</p>
                                                <div className="flex items-center gap-6 text-sm text-gray-400">
                                                    <span className="flex items-center gap-1">
                                                        <FileQuestion size={16} /> {quiz.questionCount} Questions
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Award size={16} /> {quiz.totalMarks} Marks
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={16} /> {quiz.duration} mins
                                                    </span>
                                                    {quiz.courseName && (
                                                        <span className="text-purple-400">Course: {quiz.courseName}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleTogglePublish(quiz.id)}
                                                    className={`p-2 rounded-lg transition ${quiz.isPublished
                                                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                                        : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                                                        }`}
                                                    title={quiz.isPublished ? 'Unpublish' : 'Publish'}
                                                >
                                                    {quiz.isPublished ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                                                </button>
                                                <Link
                                                    to={`/teacher/quiz/${quiz.id}`}
                                                    className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition"
                                                    title="View & Edit Questions"
                                                >
                                                    <Eye size={20} />
                                                </Link>
                                                <Link
                                                    to={`/teacher/quiz/${quiz.id}/edit`}
                                                    className="p-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition"
                                                    title="Edit Quiz"
                                                >
                                                    <Edit size={20} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(quiz.id)}
                                                    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                                                    title="Delete Quiz"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default QuizList;
