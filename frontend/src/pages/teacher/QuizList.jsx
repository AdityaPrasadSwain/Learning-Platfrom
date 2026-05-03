import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, ToggleLeft, ToggleRight, FileQuestion, Clock, Award, BookOpen } from 'lucide-react';
import { getTeacherQuizzes, deleteQuiz, toggleQuizPublish } from '../../api/quizApi';
import { showSuccess, showError, showConfirm } from '../../utils/sweetAlert';

const QuizList = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => { fetchQuizzes(); }, []);

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
        const confirmed = await showConfirm('Delete Quiz', 'Are you sure? This action cannot be undone.');
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 text-white">
                <div className="text-xl font-orbitron animate-pulse">Loading quizzes...</div>
            </div>
        );
    }

    return (
        <div className="text-white space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold font-orbitron text-white">My Quizzes</h1>
                    <p className="text-gray-400 mt-1">Create and manage your assessments</p>
                </div>
                <Link
                    to="/teacher/quiz/create"
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-6 py-3 rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                >
                    <Plus size={18} /> Create Quiz
                </Link>
            </div>

            {/* Empty State */}
            {quizzes.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="glass-panel p-16 text-center"
                >
                    <FileQuestion size={56} className="mx-auto text-gray-500 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Quizzes Yet</h3>
                    <p className="text-gray-400 mb-6">Create your first quiz to get started</p>
                    <Link
                        to="/teacher/quiz/create"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-6 py-3 rounded-xl hover:scale-105 transition-all"
                    >
                        <Plus size={18} /> Create Quiz
                    </Link>
                </motion.div>
            ) : (
                <div className="grid gap-4">
                    {quizzes.map((quiz, index) => (
                        <motion.div
                            key={quiz.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="glass-panel p-6 hover:border-purple-500/30 transition-all"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1 min-w-0 pr-4">
                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                        <h3 className="text-lg font-bold text-white">{quiz.title}</h3>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                                            quiz.isPublished
                                                ? 'bg-green-400/10 text-green-400 border-green-400/30'
                                                : 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30'
                                        }`}>
                                            {quiz.isPublished ? 'Published' : 'Draft'}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{quiz.description || 'No description'}</p>
                                    <div className="flex items-center gap-5 text-sm text-gray-400 flex-wrap">
                                        <span className="flex items-center gap-1.5">
                                            <FileQuestion size={14} className="text-cyan-400" />
                                            {quiz.questionCount} Questions
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Award size={14} className="text-yellow-400" />
                                            {quiz.totalMarks} Marks
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Clock size={14} className="text-purple-400" />
                                            {quiz.duration} mins
                                        </span>
                                        {quiz.courseName && (
                                            <span className="flex items-center gap-1.5 text-purple-400">
                                                <BookOpen size={14} />
                                                {quiz.courseName}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => handleTogglePublish(quiz.id)}
                                        title={quiz.isPublished ? 'Unpublish' : 'Publish'}
                                        className={`p-2.5 rounded-xl transition-all ${quiz.isPublished
                                            ? 'bg-green-400/10 text-green-400 hover:bg-green-400/20 border border-green-400/20'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                                        }`}
                                    >
                                        {quiz.isPublished ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                                    </button>
                                    <Link
                                        to={`/teacher/quiz/${quiz.id}`}
                                        title="View & Edit Questions"
                                        className="p-2.5 bg-cyan-400/10 text-cyan-400 rounded-xl hover:bg-cyan-400/20 border border-cyan-400/20 transition-all"
                                    >
                                        <Eye size={18} />
                                    </Link>
                                    <Link
                                        to={`/teacher/quiz/${quiz.id}/edit`}
                                        title="Edit Quiz"
                                        className="p-2.5 bg-purple-400/10 text-purple-400 rounded-xl hover:bg-purple-400/20 border border-purple-400/20 transition-all"
                                    >
                                        <Edit size={18} />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(quiz.id)}
                                        title="Delete Quiz"
                                        className="p-2.5 bg-red-400/10 text-red-400 rounded-xl hover:bg-red-400/20 border border-red-400/20 transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default QuizList;
